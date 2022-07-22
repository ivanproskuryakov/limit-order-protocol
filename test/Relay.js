const Wallet = require('ethereumjs-wallet').default;

const TokenMock = artifacts.require('TokenMock');
const Relay = artifacts.require('Relay');
const GelatoPineCore = artifacts.require('GelatoPineCore');
const VaultFactory = artifacts.require('VaultFactory');
const WrappedTokenMock = artifacts.require('WrappedTokenMock');
const ERC20OrderRouter = artifacts.require('ERC20OrderRouter');
const UniswapV2Handler = artifacts.require('UniswapV2Handler');

const BN = web3.utils.BN;

describe('Relay', async function () {
    let addr1, // 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        wallet;

    const privatekey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const account = Wallet.fromPrivateKey(Buffer.from(privatekey, 'hex'));

    before(async function () {
        [addr1, wallet] = await web3.eth.getAccounts();
    });

    /**
     * @see https://github.com/pine-finance/contracts-v2/blob/master/test/modules/LimitOrders.spec.ts
     */
    it('submit order', async () => {
        this.dai = await TokenMock.new('DAI', 'DAI');
        this.gel = await TokenMock.new('GEL', 'GEL');
        this.weth = await WrappedTokenMock.new('WETH', 'WETH');

        // module
        this.vaultFactory = await VaultFactory.new();

        // gelato
        this.gelatoPineCore = await GelatoPineCore.new(wallet);
        this.erc20orderRouter = await ERC20OrderRouter.new(this.gelatoPineCore.address);

        // relay
        this.relay = await Relay.new(this.erc20orderRouter.address);
        this.uniswapV2Handler = await UniswapV2Handler.new(
            this.vaultFactory.address,
            this.weth.address,
            web3.utils.soliditySha3(VaultFactory._json.bytecode),
        );

        const data = web3.eth.abi.encodeParameters(
            ['address', 'uint256', 'uint256'],
            [
                this.gel.address,           // Buy TOKEN GEL
                new BN(1),                  // Get at least 300 Tokens
                new BN(1)                   // Pay 10 WEI to sender
            ]
        );

        console.log('this.dai.address', this.dai.address);
        console.log('this.weth.address', this.weth.address);
        console.log('this.gel.address', this.gel.address);

        console.log('this.vaultFactory.address', this.vaultFactory.address);
        console.log('this.gelatoPineCore.address', this.gelatoPineCore.address);
        console.log('this.erc20orderRouter.address', this.erc20orderRouter.address);

        console.log('this.relay.address', this.relay.address); //
        console.log('this.uniswapV2Handler.address', this.uniswapV2Handler.address);

        console.log('addr1', addr1);
        console.log('wallet', wallet);


        await this.dai.mint(addr1, '1000000');
        await this.weth.mint(addr1, '1000000');
        await this.gel.mint(addr1, '1000000');

        await this.dai.mint('0x5dafb66cc160c4f3c874b7e3eee9d94c3ace6c14', '1000000');
        await this.weth.mint('0x5dafb66cc160c4f3c874b7e3eee9d94c3ace6c14', '1000000');
        await this.gel.mint('0x5dafb66cc160c4f3c874b7e3eee9d94c3ace6c14', '1000000');

        await this.dai.mint(wallet, '1000000');
        await this.weth.mint(wallet, '1000000');
        await this.gel.mint(wallet, '1000000');

        await this.weth.mint(this.relay.address, '1000000');

        await this.dai.mint(this.vaultFactory.address, '1000000');
        await this.weth.mint(this.vaultFactory.address, '1000000');
        await this.gel.mint(this.vaultFactory.address, '1000000');

        await this.dai.approve(this.relay.address, '1000000', {from: addr1});
        await this.weth.approve(this.relay.address, '1000000', {from: addr1});

        // await this.gel.approve('0x5dafb66cc160c4f3c874b7e3eee9d94c3ace6c14', '1000000', {from: this.erc20orderRouter.address});

        await this.gel.approve(this.erc20orderRouter.address, '1000000');

        // await this.dai.approve(this.relay.address, '1000000', {from: addr1});

        await this.relay.transfer(
            100,
            this.uniswapV2Handler.address,
            this.dai.address,
            wallet,
            data,
            web3.utils.soliditySha3(privatekey),
        );

        const balanceDaiAddr1 = await this.dai.balanceOf(addr1);
        const balanceDaiWallet = await this.dai.balanceOf(wallet);
        const balanceDaiRelay = await this.dai.balanceOf(this.relay.address);

        console.log(balanceDaiAddr1.toString());
        console.log(balanceDaiWallet.toString());
        console.log(balanceDaiRelay.toString());
    });

});
