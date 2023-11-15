import { useSDK } from '@metamask/sdk-react';
import React, { useState } from 'react';
import { ethers } from "ethers";

const Web3Testpage = () => {
    // Create a new contract object using the ABI and bytecode
    const provider = new ethers.getDefaultProvider();
    

    // MetaMask requires requesting permission to connect users accounts
    // await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const [blocknum, setblocknum] = useState(0);
    const bn = provider.getBlockNumber().then((p)=>setblocknum(p))

    return (
        <div>
            Hello {blocknum}
        </div>
    );
};

export default Web3Testpage