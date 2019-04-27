import hashlib
import logging
from collections import namedtuple
from functools import reduce
from os import getenv

import pymssql

from constants import DOCKER_SECRET_SQL_LOGIN_PWD, DOCKER_SECRET_DIR


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


def main():
    logging.basicConfig(level=logging.INFO)

    parsed_cns = load_secrets(load_env())
    conn = pymssql.connect(parsed_cns.server, parsed_cns.user, parsed_cns.password, parsed_cns.database)


if __name__ == '__main__':
    main()
