const ethSigUtil = require('eth-sig-util');
const Wallet = require('ethereumjs-wallet').default;

const TokenMock = artifacts.require('TokenMock');
const Relay = artifacts.require('Relay');
const GelatoPineCore = artifacts.require('gelato/GelatoPineCore');
const VaultFactory = artifacts.require('VaultFactory')
const UniswapV2Handler = artifacts.require('UniswapV2Handler')
const ERC20OrderRouter = artifacts.require('gelato/ERC20OrderRouter');

describe('LimitOrderProtocol', async function () {
    let addr1, wallet;

    // addr1 - 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
    const privatekey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const account = Wallet.fromPrivateKey(Buffer.from(privatekey, 'hex'));

    before(async function () {
        [addr1, wallet] = await web3.eth.getAccounts();
    });

    beforeEach(async function () {
        this.dai = await TokenMock.new('DAI', 'DAI');
        this.gel = await TokenMock.new('GEL', 'GEL');

        await this.dai.mint(addr1, '1000000');
    });

    /**
     * @see https://github.com/pine-finance/contracts-v2/blob/master/test/PineCore.spec.ts
     * @see https://github.com/pine-finance/contracts-v2/tree/master/contracts/mocks
     */
    it('relay', async function () {
        this.vaultFactory = await VaultFactory.new();
        this.uniswapV2Handler = await UniswapV2Handler.new(this.vaultFactory.address);
        this.gelatoPineCore = await GelatoPineCore.new(this.dai.address);
        this.erc20orderRouter = await ERC20OrderRouter.new(this.gelatoPineCore.address);
        this.relay = await Relay.new(this.erc20orderRouter.address);

        const balanceDai = await this.dai.balanceOf(addr1)
        const data = web3.eth.abi.encodeParameters(
            ['address', 'uint256', 'uint256'],
            [
                this.gel.address,             // Buy TOKEN GEL
                new BN(300),                  // Get at least 300 Tokens
                new BN(10)                    // Pay 10 WEI to sender
            ]
        )

        const signature = ethSigUtil.signTypedMessage(account.getPrivateKey(), {data});


        this.relay.transfer(
            1000,
            this.vaultFactory.address,
            this.dai.address,
            wallet,
            signature,
        )

        console.log(balanceDai.toString())
        console.log(this.dai.address)
    });
});
