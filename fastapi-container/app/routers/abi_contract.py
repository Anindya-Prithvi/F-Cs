abi = [
    {
        "inputs": [{"internalType": "string", "name": "doc_id", "type": "string"}],
        "name": "buyProperty",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "doc_id", "type": "string"}],
        "name": "delete_property",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "string", "name": "doc_id", "type": "string"},
            {"internalType": "uint256", "name": "_price", "type": "uint256"},
            {"internalType": "uint256", "name": "_hmac", "type": "uint256"},
        ],
        "name": "editProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_price", "type": "uint256"},
            {"internalType": "uint256", "name": "_hmac", "type": "uint256"},
            {"internalType": "string", "name": "_doc_id", "type": "string"},
        ],
        "name": "enlistProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "doc_id", "type": "string"}],
        "name": "getProperty",
        "outputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "string", "name": "", "type": "string"}],
        "name": "properties",
        "outputs": [
            {"internalType": "address", "name": "owner", "type": "address"},
            {"internalType": "uint256", "name": "price", "type": "uint256"},
            {"internalType": "address", "name": "given_to", "type": "address"},
            {"internalType": "uint256", "name": "hmac", "type": "uint256"},
            {"internalType": "string", "name": "doc_id", "type": "string"},
        ],
        "stateMutability": "view",
        "type": "function",
    },
]
