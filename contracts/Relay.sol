// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "./lib/PineUtils.sol";
import "./lib/ERC20OrderRouter.sol";

contract Relay {
    address payable public router;

    constructor(address _address) {
        console.log('initMessage ..... ', _address);

        router = payable(_address);
    }

    function balanceOf(address account) external view returns (uint256) {
        return address(account).balance;
    }

    /**
     * @see - https://github.com/pine-finance/contracts-v2/blob/master/test/PineCore.spec.ts
     * @see - https://github.com/pine-finance/contracts-v2/blob/master/test/PineCore.spec.ts
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
        address _inputToken,
        address _witness,
        bytes calldata _data,
        bytes32 _secret
    ) external {
        //        address payable makerAddress;
        //        // solhint-disable-next-line no-inline-assembly
        //        assembly {
        //            makerAddress := shr(96, calldataload(interactiveData.offset))
        //        }
        //        IWithdrawable(takerAsset).withdraw(takingAmount);

        _owner = address(msg.sender);

        router.depositToken(
            _amount,
            _module,
            _inputToken,
            _owner,
            _witness,
            _data,
            _secret
        );

        //        (IERC20 outputToken, uint256 minReturn) = abi.decode(_data, (IERC20, uint256));

    }

    function balanceLog(IERC20 _token) view public {
        uint256 amount = PineUtils.balanceOf(_token, address(msg.sender));

        console.log('balanceLog _token ..... ', address(_token));
        console.log('balanceLog sender ..... ', address(msg.sender));
        console.log('balanceLog sender ..... ', msg.sender);
        console.log('balanceLog amount ..... ', amount);
    }
}
