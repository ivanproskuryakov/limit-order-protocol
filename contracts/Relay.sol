// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "./lib/PineUtils.sol";
import "./gelato/ERC20OrderRouter.sol";

contract Relay {
    address payable public router;

    constructor(address _address) {
        console.log('initMessage ..... ', _address);

        router = payable(_address);
    }

    function balanceOf(address account) external view returns (uint256) {
        return address(account).balance;
    }

    function transfer(
        uint256 _amount,
        address _module,
        address _inputToken,
        address payable _owner,
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

        //uint256 _amount,
        //address _module,
        //address _inputToken,
        //address payable _owner,
        //address _witness,
        //bytes calldata _data,
        //bytes32 _secret
        
        router.depositToken(
            _amount,
            _module,
            _inputToken,
            _owner,
            _witness,
            _data,
            _secret
        );
    }

    function balanceLog(IERC20 _token) view public {
        uint256 amount = PineUtils.balanceOf(_token, address(msg.sender));

        console.log('balanceLog _token ..... ', address(_token));
        console.log('balanceLog sender ..... ', address(msg.sender));
        console.log('balanceLog sender ..... ', msg.sender);
        console.log('balanceLog amount ..... ', amount);
    }
}
