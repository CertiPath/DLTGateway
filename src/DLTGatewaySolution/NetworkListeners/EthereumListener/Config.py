import logging
from os import getenv

from Exceptions import ConfigurationException


class Config:
    @staticmethod
    def load_env(sql_cns='DLT_SQL_CNS'):
        cns_val = getenv(sql_cns)
        logging.info(f'Loaded environment variable. {sql_cns}="{cns_val}"')
        if not cns_val:
            raise ConfigurationException('Cannot load connection string from environment variables.')
        return cns_val
