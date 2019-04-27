import os
import unittest
from collections import namedtuple
from unittest import mock
from unittest.mock import mock_open, patch

from ethereumListener import load_env, ConfigurationException, parse_mssql_cns, load_secrets
from constants import DOCKER_SECRET_DIR


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
        parsed = parse_mssql_cns('Server=dummy_server;Database=dummy_database;User ID=dummy_user;')
        self.assertEqual('dummy_server', parsed.server)
        self.assertEqual('dummy_database', parsed.database)
        self.assertEqual('dummy_user', parsed.user)

    def test_load_secrets_pwd_in_env(self):
        env_dict = {'server': 'dummy_server', 'database': 'dummy_database', 'user': 'dummy_user',
                    'password': 'dummy_password'}
        pwd_env = namedtuple('ParsedCns', env_dict.keys())(**env_dict)
        actual = load_secrets(pwd_env)
        self.assertEqual(pwd_env, actual)

    def test_load_secrets_pwd_not_in_env(self):
        env_dict = {'server': 'dummy_server', 'database': 'dummy_database', 'user': 'dummy_user'}
        parsed_cns = namedtuple('ParsedCns', env_dict.keys())(**env_dict)
        secret_name = 'dummy_name'
        password = 'dummy_password'
        with patch('builtins.open', mock_open(read_data=password), create=True) as m:
            actual = load_secrets(parsed_cns, secret_name)
        m.assert_called_once_with(f'{DOCKER_SECRET_DIR}/{secret_name}', 'r')
        self.assertEqual(actual.password, password)


if __name__ == '__main__':
    unittest.main()
