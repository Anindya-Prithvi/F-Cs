# from web3 import Web3
# # from app.utils.abi_contract import abi
# from abi_contract import abi

# from ..utils.clients import PROPERTY_LISTINGS_COLLECTION
# from bson.objectid import ObjectId



# def verify_single_listing():
#     # Connect to Goerli testnet
#     # w3 = Web3(Web3.HTTPProvider('https://arbitrum-goerli.infura.io/v3/e4201a80a7014f1590572e08df3a306a'))
#     w3 = Web3(Web3.HTTPProvider('https://goerli.infura.io/v3/e4201a80a7014f1590572e08df3a306a'))

#     print(w3)

#     # Contract ABI
#     abi2 = [
# 	{
# 		"inputs": [
# 			{
# 				"internalType": "string",
# 				"name": "doc_id",
# 				"type": "string"
# 			}
# 		],
# 		"name": "buyProperty",
# 		"outputs": [],
# 		"stateMutability": "payable",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [
# 			{
# 				"internalType": "string",
# 				"name": "doc_id",
# 				"type": "string"
# 			}
# 		],
# 		"name": "delete_property",
# 		"outputs": [],
# 		"stateMutability": "nonpayable",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [
# 			{
# 				"internalType": "string",
# 				"name": "doc_id",
# 				"type": "string"
# 			},
# 			{
# 				"internalType": "uint256",
# 				"name": "_price",
# 				"type": "uint256"
# 			},
# 			{
# 				"internalType": "uint256",
# 				"name": "_hmac",
# 				"type": "uint256"
# 			}
# 		],
# 		"name": "editProperty",
# 		"outputs": [],
# 		"stateMutability": "nonpayable",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [
# 			{
# 				"internalType": "uint256",
# 				"name": "_price",
# 				"type": "uint256"
# 			},
# 			{
# 				"internalType": "uint256",
# 				"name": "_hmac",
# 				"type": "uint256"
# 			},
# 			{
# 				"internalType": "string",
# 				"name": "_doc_id",
# 				"type": "string"
# 			}
# 		],
# 		"name": "enlistProperty",
# 		"outputs": [],
# 		"stateMutability": "nonpayable",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [
# 			{
# 				"internalType": "string",
# 				"name": "doc_id",
# 				"type": "string"
# 			}
# 		],
# 		"name": "getProperty",
# 		"outputs": [
# 			{
# 				"internalType": "address",
# 				"name": "",
# 				"type": "address"
# 			},
# 			{
# 				"internalType": "uint256",
# 				"name": "",
# 				"type": "uint256"
# 			},
# 			{
# 				"internalType": "address",
# 				"name": "",
# 				"type": "address"
# 			},
# 			{
# 				"internalType": "uint256",
# 				"name": "",
# 				"type": "uint256"
# 			}
# 		],
# 		"stateMutability": "view",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [
# 			{
# 				"internalType": "string",
# 				"name": "",
# 				"type": "string"
# 			}
# 		],
# 		"name": "properties",
# 		"outputs": [
# 			{
# 				"internalType": "address",
# 				"name": "owner",
# 				"type": "address"
# 			},
# 			{
# 				"internalType": "uint256",
# 				"name": "price",
# 				"type": "uint256"
# 			},
# 			{
# 				"internalType": "address",
# 				"name": "given_to",
# 				"type": "address"
# 			},
# 			{
# 				"internalType": "uint256",
# 				"name": "hmac",
# 				"type": "uint256"
# 			},
# 			{
# 				"internalType": "string",
# 				"name": "doc_id",
# 				"type": "string"
# 			}
# 		],
# 		"stateMutability": "view",
# 		"type": "function"
# 	}
# ]
#     # Contract address
#     contract_address = "0xe35FE337fE0B637d0449fa733A0627255D07FCF8"

#     # Connect to contract
#     contract = w3.eth.contract(address=contract_address, abi=abi)
#     print(contract)

#     property_id = "6554a097db676dc26ac5e232"

#     owner_address, price, given_to_address, hmac = contract.functions.getProperty(property_id).call()

#     print(owner_address, price, given_to_address, hmac)

#     database_hmac = PROPERTY_LISTINGS_COLLECTION.find_one({"_id": ObjectId(property_id)}).get("hmac")

#     print(database_hmac)


# verify_single_listing()



# #   property.owner,
# #   property.price,
# #   property.given_to,
# #   property.hmac
