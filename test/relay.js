const ethSigUtil = require('eth-sig-util');
const Wallet = require('ethereumjs-wallet').default;

const TokenMock = artifacts.require('TokenMock');
const Relay = artifacts.require('Relay');
const GelatoPineCore = artifacts.require('gelato/GelatoPineCore');
const ERC20OrderRouter = artifacts.require('gelato/ERC20OrderRouter');

describe('LimitOrderProtocol', async function () {
    let addr1;

    // addr1 - 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
    const privatekey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const account = Wallet.fromPrivateKey(Buffer.from(privatekey, 'hex'));

    before(async function () {
        [addr1] = await web3.eth.getAccounts();
    });

    beforeEach(async function () {
        this.dai = await TokenMock.new('DAI', 'DAI');
        // this.gel = await TokenMock.new('GEL', 'GEL');

        await this.dai.mint(addr1, '1000000');
    });

    it('relay', async function () {
        this.gelatoPineCore = await GelatoPineCore.new(this.dai.address);
        this.erc20orderRouter = await ERC20OrderRouter.new(this.gelatoPineCore.address);
        this.relay = await Relay.new(this.erc20orderRouter.address);


        const data = {}
        const signature = ethSigUtil.signTypedMessage(account.getPrivateKey(), {data});

        const balanceDai = await this.dai.balanceOf(addr1)

        await this.relay.balanceLog(this.dai.address);


        this.relay.transfer(this.dai.address, 1000, signature)

        console.log(balanceDai.toString())
        console.log(this.dai.address)
    });
});
