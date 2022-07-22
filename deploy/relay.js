const hre = require('hardhat');

const {deployments, getNamedAccounts, getChainId} = hre;

module.exports = async () => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();


    console.log('running deploy script');
    console.log('network id ', await getChainId());
    console.log('deployer ', deployer);

    const router = '0x0c2c2963A4353FfD839590f7cb1E783688378814';

    const Relay = await deploy('Relay', {
        from: deployer,
        args: [router],
        log: true,
    });

    console.log('Deployed to:', Relay.address);

};
