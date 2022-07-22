// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "./lib/PineUtils.sol";
import "./lib/ERC20OrderRouter.sol";

interface IRouter {
    function depositToken(
        uint256 _amount,
        address _module,
        IERC20 _inputToken,
        address payable _owner,
        address _witness,
        bytes calldata _data,
        bytes32 _secret
    ) external;
}

contract Relay {
    IRouter router;

    constructor(IRouter _address) {
        router = _address;
    }

    /*
     * @see - https://github.com/pine-finance/contracts-v2/blob/master/test/PineCore.spec.ts
     * @see - https://github.com/pine-finance/contracts-v2/tree/master/contracts/mocks
     *
     * @param _amount - Address of the module to use for the order execution
     * @param _module - Address of the module to use for the order execution - vaultFactory
     * @param _inputToken - Address of the input token
     * @param _owner - Address of the order's owner
     * @param _witness - Address of the witness
     * @param _data - Bytes of the order's data
     * @param _secret - Private key of the _witness
     * @param _amount - uint256 of the order amount
     */
    function transfer(
        uint256 _amount,
        address _module,
        IERC20 _inputToken,
        address _witness,
        bytes calldata _data,
        bytes32 _secret
    ) external {
        address payable owner = payable(msg.sender);

//        _inputToken.transferFrom(owner, address(this), _amount);
//        _inputToken.transferFrom(owner, address(vaultAddress), _amount);

        router.depositToken(
            _amount,
            _module,
            _inputToken,
            owner,
            _witness,
            _data,
            _secret
        );
    }

}
