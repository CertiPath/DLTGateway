import logging
from collections import namedtuple
from functools import reduce
from os import getenv


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


def main():
    logging.basicConfig(level=logging.INFO)
    load_env()


if __name__ == '__main__':
    main()
