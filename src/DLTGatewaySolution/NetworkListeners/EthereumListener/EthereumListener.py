from web3 import Web3 
web3 = Web3(Web3.HTTPProvider("https://ropsten.infura.io/v3/b7a05b7fc370460288e2e6b1fd296c7f"))
print(web3.eth.blockNumber)