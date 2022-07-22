const fs = require('fs');
const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const BN = Web3.utils.BN;

require('dotenv').config();

const pk = process.env.POLYGON_PRIVATE_KEY
const json = fs.readFileSync('/Users/ivan/code/limit-order-protocol/deployments/polygon/Relay.json');
const abi = JSON.parse(json);

const network = 'https://polygon-rpc.com';

// Relay
// https://polygonscan.com/address/0x10D6a9c3A751c82630220F67F5dd174fF49FC479
const relayAddress = '0x10D6a9c3A751c82630220F67F5dd174fF49FC479';

// Token to sell
// https://polygonscan.com/token/0x15b7c0c907e4C6b9AdaAaabC300C08991D6CEA05
const inputToken = '0x0000000000000000000000000000000000001010'; // MATIC

// Token to buy
// https://polygonscan.com/token/0x15b7c0c907e4C6b9AdaAaabC300C08991D6CEA05
const outputToken = '0x6b175474e89094c44da98b954eedeac495271d0f'; // GEL

// Minimum amount of outToken which the users wants to receive back
const minReturn = new BN(0.01);

// const minReturn = ethers.utils.parseEther("1");

const options = {
    transactionConfirmationBlocks: 1
};


(async () => {
    const web3 = new Web3(network, null, options);

    web3.eth.setProvider(web3.givenProvider);

    const account = web3.eth.accounts.privateKeyToAccount(pk);
    const contract = new Contract(abi.abi, relayAddress);

    contract.setProvider(network);
    web3.eth.setProvider(network);

    // Address of user who places the order (must be same as signer address)
    const userAddress = account.address;

    const data = web3.eth.abi.encodeParameters(
        ['address', 'uint256'],
        [
            outputToken,
            minReturn,
        ]
    )

    const encoded = contract
        .methods
        .transfer(
            minReturn,
            inputToken,
            outputToken,
            userAddress,
            data,
            web3.utils.soliditySha3(account.privateKey),
        )
        .encodeABI();

    const block = await web3.eth.getBlock('latest');
    const gasLimit = Math.round((block.gasLimit / block.transactions.length) * 2);

    const txCount = '0x' + (await web3.eth.getTransactionCount(account.address) + 5).toString(16);

    const tx = {
        nonce: web3.utils.toHex(txCount),
        gas: gasLimit,
        data: encoded
    }

    const txSigned = await web3.eth.accounts.signTransaction(tx, account.privateKey);

    web3
        .eth
        .sendSignedTransaction(txSigned.rawTransaction)
        .once('transactionHash', hash => {
            console.log('txHash', hash)
        })
        .once('receipt', receipt => {
            console.log('receipt', receipt)
        })
        .on('confirmation', (confNumber, receipt) => {
            console.log('confNumber', confNumber, 'receipt', receipt)
        })
        .on('error', error => {
            console.log('error', error)
        })
        .then(receipt => {
            console.log('trasaction mined!', receipt);
        });

})()
    .then(r => console.log(r))
    .catch(e => console.log(e));
