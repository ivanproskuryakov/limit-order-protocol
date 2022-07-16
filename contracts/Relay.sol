// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "./lib/PineUtils.sol";
import "./gelato/ERC20OrderRouter.sol";

contract Relay {
    address payable public erc20OrderRouter;

    constructor(address routerAddress) {
        console.log('initMessage ..... ', routerAddress);

        erc20OrderRouter = payable(routerAddress);
    }

    function balanceOf(address account) external view returns (uint256) {
        return address(account).balance;
    }

    function transfer() external {
        //        address payable makerAddress;
        //        // solhint-disable-next-line no-inline-assembly
        //        assembly {
        //            makerAddress := shr(96, calldataload(interactiveData.offset))
        //        }
        //        IWithdrawable(takerAsset).withdraw(takingAmount);
        //        makerAddress.transfer(takingAmount);
    }

    function balanceLog(IERC20 _token) view public {
        uint256 amount = PineUtils.balanceOf(_token, address(msg.sender));

        console.log('balanceLog _token ..... ', address(_token));
        console.log('balanceLog sender ..... ', address(msg.sender));
        console.log('balanceLog sender ..... ', msg.sender);
        console.log('balanceLog amount ..... ', amount);
    }
}
