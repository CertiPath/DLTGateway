import hashlib
import logging
from collections import namedtuple
from functools import reduce
from os import getenv

import pymssql
from web3 import Web3

from constants import DOCKER_SECRET_SQL_LOGIN_PWD, DOCKER_SECRET_DIR, FRAMEWORK_NAME_ETH


class ConfigurationException(RuntimeError):
    def __init__(self, message):
        super().__init__(message)


def parse_mssql_cns(cns):
    def kvp_to_dict(expr):
        [left, right] = expr.split('=')
        left = left.lower()
        key_map = {'user id': 'user'}
        return {left if left not in key_map else key_map[left]: right}

    def accumulate_dict(d1, d2):
        return {**d1, **d2}

    parts = filter(None, cns.split(';'))
    d = reduce(accumulate_dict, map(kvp_to_dict, parts), {})
    required_keys = ['server', 'database', 'user']
    for key in required_keys:
        if key not in d:
            raise ConfigurationException(f'Missing required key "{key}" from the connection string.')
    return namedtuple('ParsedCns', d.keys())(**d)


def load_env(sql_cns='DLT_SQL_CNS'):
    cns_val = getenv(sql_cns)
    logging.info(f'Loaded environment variable. {sql_cns}="{cns_val}"')
    if not cns_val:
        raise ConfigurationException('Cannot load connection string from environment variables.')
    return parse_mssql_cns(cns_val)


def load_secrets(parsed_env_cns, secret_name=DOCKER_SECRET_SQL_LOGIN_PWD):
    pwd_field = 'password'
    # Python namedtuple uses "_" to prevent collision, not for access protection.
    # noinspection PyProtectedMember
    d = parsed_env_cns._asdict()
    if pwd_field in d:
        return parsed_env_cns

    file_path = f"{DOCKER_SECRET_DIR}/{secret_name}"
    logging.info(f'Reading docker secret at "{file_path}"')
    with open(file_path, 'r') as f:
        pwd = f.read()
        md5 = hashlib.md5(pwd.encode('utf-8'))
        logging.info(f'Hashed password: {md5}')
    logging.info(f'Closing file at "{file_path}"')
    f.close()
    d[pwd_field] = pwd
    return namedtuple('ParsedCns', d.keys())(**d)


def fetch_all(parsed_cns, sql):
    with pymssql.connect(parsed_cns.server, parsed_cns.user, parsed_cns.password, parsed_cns.database) as conn:
        with conn.cursor(as_dict=True) as cursor:
            cursor.execute(sql)
            rows = []
            for row in cursor:
                rows.append(row)
            return rows


def db_query_network(parsed_cns, network_name='', framework_name=FRAMEWORK_NAME_ETH):
    and_network_name_condition = f"AND N.Name = '{network_name}'" if network_name else ''
    sql = f"""
        SELECT N.GUID,
               N.BlockchainFrameworkGUID,
               N.Name,
               N.Endpoint,
               N.Deleted,
               N.LastBlockProcessed,
               N.Disabled
        FROM   BusinessNetwork AS N
               INNER JOIN BlockchainFramework AS F
                       ON N.BlockchainFrameworkGUID = F.GUID
        WHERE  N.Deleted = 0
               AND F.Deleted = 0
               AND F.Name = '{framework_name}'
               {and_network_name_condition}
       """
    logging.debug(f'Querying business network table: "{sql}"')
    rows = fetch_all(parsed_cns, sql)
    for row in rows:
        logging.info(f"[{row['Name']}] Endpoint: {row['Endpoint']}")
    return rows


def eth_connect(network_dict):
    end_point = network_dict['Endpoint']
    logging.info(f'[{network_dict["Name"]}] Connecting to endpoint "{end_point}"')
    web3 = Web3(end_point)
    return web3


def eth_get_latest_block_number(web3):
    return web3.eth.blockNumber


# web3.eth
# noinspection PyUnresolvedReferences
def eth_get_blocks(network_dict, num_blocks=10):
    web3 = eth_connect(network_dict)

    last_block_number = network_dict["LastBlockProcessed"]
    logging.info(f'[{network_dict["Name"]}] LastBlockProcessed: {last_block_number}')
    latest_block_number = eth_get_latest_block_number(web3)
    delta = min(max(latest_block_number - last_block_number, 0), num_blocks)
    for offset in range(delta):
        block_number = last_block_number + offset
        logging.info(f'[{network_dict["Name"]}] Requesting block #{block_number}')


def process_networks(networks):
    for network in networks:
        eth_get_blocks(network)


def main():
    logging.basicConfig(level=logging.INFO)
    parsed_cns = load_secrets(load_env())
    process_networks(db_query_network(parsed_cns))


if __name__ == '__main__':
    main()
