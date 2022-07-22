const networks = {};

function register (name, chainId, url, privateKey) {
    if (url && privateKey) {
        networks[name] = {
            url,
            chainId,
            accounts: [privateKey],
        };
        console.log(`Network '${name}' registered`);
    } else {
        console.log(`Network '${name}' not registered`);
    }
}

register('ganache', 1337, process.env.GANACHE_RPC_URL, process.env.GANACHE_PRIVATE_KEY);
register('ropsten', 1337, process.env.ROPSTEN_RPC_URL, process.env.ROPSTEN_PRIVATE_KEY);
register('mumbai', 80001, process.env.MUMBAI_RPC_URL, process.env.MUMBAI_PRIVATE_KEY);
register('polygon', 137, process.env.POLYGON_RPC_URL, process.env.POLYGON_PRIVATE_KEY);

module.exports = networks;
