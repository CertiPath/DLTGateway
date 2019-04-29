import os
import unittest
from collections import namedtuple
from unittest import mock
from unittest.mock import mock_open, patch

from ethereumListener import load_env, ConfigurationException, parse_mssql_cns, load_secrets, db_query_network, \
    db_fetch_all, eth_get_blocks, process_networks
from constants import DOCKER_SECRET_DIR, FRAMEWORK_NAME_ETH


def dummy_block(block_number=2000000):
    dummy_block_2000000 = {
        'difficulty': 49824742724615,
        'extraData': '0xe4b883e5bda9e7a59ee4bb99e9b1bc',
        'gasLimit': 4712388,
        'gasUsed': 21000,
        'hash': '0xc0f4906fea23cf6f3cce98cb44e8e1449e455b28d684dfa9ff65426495584de6',
        'logsBloom': '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        'miner': '0x61c808d82a3ac53231750dadc13c777b59310bd9',
        'nonce': '0x3b05c6d5524209f1',
        'number': 2000000,
        'parentHash': '0x57ebf07eb9ed1137d41447020a25e51d30a0c272b5896571499c82c33ecb7288',
        'receiptRoot': '0x84aea4a7aad5c5899bd5cfc7f309cc379009d30179316a2a7baa4a2ea4a438ac',
        'sha3Uncles': '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
        'size': 650,
        'stateRoot': '0x96dbad955b166f5119793815c36f11ffa909859bbfeb64b735cca37cbf10bef1',
        'timestamp': 1470173578,
        'totalDifficulty': 44010101827705409388,
        'transactions': ['0xc55e2b90168af6972193c1f86fa4d7d7b31a29c156665d15b9cd48618b5177ef'],
        'transactionsRoot': '0xb31f174d27b99cdae8e746bd138a01ce60d8dd7b224f7c60845914def05ecc58',
        'uncles': [],
    }
    dummy_blocks = [dummy_block_2000000]
    return next(b for b in dummy_blocks if b['number'] == block_number)


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

    @patch('ethereumListener.db_get_cns')
    @patch('ethereumListener.db_fetch_all')
    def test_db_query_network_with_network_name(self, mock_db_fetch_all, mock_db_get_cns):
        env_dict = {'server': 'dummy_server', 'database': 'dummy_database', 'user': 'dummy_user',
                    'password': 'dummy_password'}
        mock_db_get_cns.return_value = namedtuple('ParsedCns', env_dict.keys())(**env_dict)
        network_name = 'dummy_network'

        db_query_network(network_name)
        mock_db_fetch_all.assert_called_with(f"""
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
               AND F.Name = '{FRAMEWORK_NAME_ETH}'
               AND N.Name = '{network_name}'
       """)

    @patch('ethereumListener.db_get_cns')
    @patch('ethereumListener.db_fetch_all')
    def test_db_query_network_without_network_name(self, mock_db_fetch_all, mock_db_get_cns):
        env_dict = {'server': 'dummy_server', 'database': 'dummy_database', 'user': 'dummy_user',
                    'password': 'dummy_password'}
        mock_db_get_cns.return_value = namedtuple('ParsedCns', env_dict.keys())(**env_dict)
        db_query_network()
        mock_db_fetch_all.assert_called_with(f"""
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
               AND F.Name = '{FRAMEWORK_NAME_ETH}'
               
       """)

    def test_process_networks_when_no_networks_found(self):
        network_rows = []
        process_networks(network_rows)

    @patch('ethereumListener.eth_get_latest_block_number')
    @patch('ethereumListener.eth_connect')
    def test_eth_get_blocks_negative_latest_block_number(self, mock_eth_connect, mock_eth_get_latest_block_number):
        mock_eth_connect.return_value = {}
        mock_eth_get_latest_block_number.return_value = -10

        network_row = {'Name': 'dummy_eth_network', 'Endpoint': 'http://dummy.endpoint.com/dummy_token',
                       'LastBlockProcessed': 0}
        eth_get_blocks(network_row)

    @patch('ethereumListener.eth_get_latest_block_number')
    @patch('ethereumListener.eth_connect')
    def test_eth_get_blocks_zero_latest_block_number(self, mock_eth_connect, mock_eth_get_latest_block_number):
        mock_eth_connect.return_value = {}
        mock_eth_get_latest_block_number.return_value = 0

        network_row = {'Name': 'dummy_eth_network', 'Endpoint': 'http://dummy.endpoint.com/dummy_token',
                       'LastBlockProcessed': 0}
        eth_get_blocks(network_row)

    @patch('ethereumListener.eth_get_tran_count')
    @patch('ethereumListener.eth_get_latest_block_number')
    @patch('ethereumListener.eth_connect')
    def test_eth_get_blocks_positive_latest_block_number(self, mock_eth_connect, mock_eth_get_latest_block_number,
                                                         mock_eth_get_tran_count):
        mock_eth_connect.return_value = {}
        mock_eth_get_latest_block_number.return_value = 2
        mock_eth_get_tran_count.return_value = 1

        network_row = {'Name': 'dummy_eth_network', 'Endpoint': 'http://dummy.endpoint.com/dummy_token',
                       'LastBlockProcessed': 0}
        eth_get_blocks(network_row)
        self.assertEqual(2, mock_eth_get_tran_count.call_count)


if __name__ == '__main__':
    unittest.main()
