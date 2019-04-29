import hashlib
import json
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


def db_fetch_all(sql):
    cns = db_get_cns()
    with pymssql.connect(cns.server, cns.user, cns.password, cns.database) as conn:
        with conn.cursor(as_dict=True) as cursor:
            cursor.execute(sql)
            rows = []
            for row in cursor:
                rows.append(row)
            return rows


def db_query_network(network_name='', framework_name=FRAMEWORK_NAME_ETH):
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
    rows = db_fetch_all(sql)
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


def eth_get_block(web3, block_number):
    return web3.eth.getBlock(block_number)


def eth_get_tran_count(web3, block_number):
    return web3.eth.getBlockTransactionCount(block_number)


def eth_get_tran(web3, block_number, tran_index):
    return web3.eth.getBlockTransactionByBlock(block_number, tran_index)


def db_connect():
    cns = db_get_cns()
    return pymssql.connect(cns.server, cns.user, cns.password, cns.database)


def db_cursor(conn):
    return conn.cursor(as_dict=True)


def db_call_proc(sp_name, sp_params_dict, cursor):
    cursor.callproc(sp_name, sp_params_dict.values())


def save_tran(network_guid, block_number, tran, cursor):
    db_call_proc('AddTransaction', {
        'networkGUID': network_guid,
        'blockNumber': block_number,
        'transactionID': tran['hash'],
        'data': json.dumps(tran)
    }, cursor)


def eth_get_blocks(network_dict, num_blocks=10):
    web3 = eth_connect(network_dict)
    last_block_number = network_dict["LastBlockProcessed"]
    network_name = network_dict["Name"]
    logging.info(f'[{network_name}] LastBlockProcessed: {last_block_number}')
    latest_block_number = eth_get_latest_block_number(web3)
    delta = min(max(latest_block_number - last_block_number, 0), num_blocks)
    logging.debug(f'Delta = latest - last = {delta}')
    if delta < 1:
        logging.warning(f'[{network_name}] Last block processed is the same as the latest block number. '
                        f'Skipping network "{network_name}".')
        return

    with db_connect() as conn:
        with db_cursor(conn) as cursor:
            for offset in range(delta):
                block_number = last_block_number + offset + 1
                tran_count = eth_get_tran_count(web3, block_number)
                block = eth_get_block(web3, block_number)
                block_hash = block['hash']
                logging.info(f'[{network_name}] Block #{block_number} ({block_hash}) '
                             f'contains {tran_count} transactions.')
                for ti in range(tran_count):
                    save_tran(network_dict['GUID'], block_number, eth_get_tran(web3, block_number, ti), cursor)


def process_networks(networks):
    for network in networks:
        eth_get_blocks(network)


parsed_cns = None


def db_set_cns(cns):
    global parsed_cns
    parsed_cns = cns


def db_get_cns():
    global parsed_cns
    return parsed_cns


def main():
    logging.basicConfig(level=logging.INFO)
    db_set_cns(load_secrets(load_env()))
    process_networks(db_query_network())


if __name__ == '__main__':
    main()
