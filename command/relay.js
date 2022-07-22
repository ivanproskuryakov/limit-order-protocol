const fs = require('fs');
const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const BN = Web3.utils.BN;


const pk = ''
const json = fs.readFileSync('/Users/ivan/code/limit-order-protocol/deployments/polygon/Relay.json');
const abi = JSON.parse(json);

const network = 'https://polygon-rpc.com';

(async () => {
    const web3 = new Web3(network);

    web3.eth.setProvider(web3.givenProvider);

    const account = web3.eth.accounts.privateKeyToAccount(pk);
    const contract = new Contract(abi.abi, '0x10D6a9c3A751c82630220F67F5dd174fF49FC479');

    contract.setProvider(network);
    web3.eth.setProvider(network);

    const data = web3.eth.abi.encodeParameters([], []);

    // contract.methods.transfer(
    //     new BN(0.001),
    //     '0x879133681EC687C4AA169A3EfAdE96F45398ee3e', // ERC20OrderRouter
    //     '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI TOKEN
    //     account.address,
    //     data,
    //     web3.utils.soliditySha3(account.privateKey),
    // ).call((err, result) => {
    //     console.log(err)
    //     console.log(result)
    // });


    const res = await contract.methods.transfer(
        new BN(0.001),
        '0x879133681EC687C4AA169A3EfAdE96F45398ee3e', // ERC20OrderRouter
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI TOKEN
        account.address,
        data,
        web3.utils.soliditySha3(account.privateKey),
    ).send({from: account.address});

    console.log(res);

})()
    .then(r => console.log(r))
    .catch(e => console.log(e));
