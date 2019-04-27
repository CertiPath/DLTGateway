import os
import unittest
from unittest import mock

from ethereumListener import load_env, ConfigurationException, parse_mssql_cns


class TestClass(unittest.TestCase):
    def test_load_env_empty_string(self):
        dlt_sql_cns = 'DLT_SQL_CNS'
        k = mock.patch.dict(os.environ, {dlt_sql_cns: ''})
        k.start()
        with self.assertRaises(ConfigurationException) as context:
            load_env(dlt_sql_cns)
        k.stop()
        self.assertTrue('Cannot load connection string' in str(context.exception))

    def test_parse_mssql_cns_missing_server(self):
        with self.assertRaises(ConfigurationException) as context:
            parse_mssql_cns('Database=dummy_database;User ID=dummy_user')
        self.assertTrue('server' in str(context.exception))

    def test_parse_mssql_cns_missing_database(self):
        with self.assertRaises(ConfigurationException) as context:
            parse_mssql_cns('Server=dummy_server;User ID=dummy_user')
        self.assertTrue('database' in str(context.exception))

    def test_parse_mssql_cns_missing_user(self):
        with self.assertRaises(ConfigurationException) as context:
            parse_mssql_cns('Server=dummy_server;Database=dummy_database')
        self.assertTrue('user' in str(context.exception))

    def test_parse_mssql_cns_with_trailing_semi_colon(self):
        parse_mssql_cns('Server=dummy_server;Database=dummy_database;User ID=dummy_user;')


if __name__ == '__main__':
    unittest.main()
