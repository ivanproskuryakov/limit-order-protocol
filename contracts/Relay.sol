// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "./lib/PineUtils.sol";

contract Relay {
    string public message;

    address public owner;

    constructor(string memory initMessage) {
        owner = msg.sender;

        console.log('initMessage ..... ', initMessage);

        message = initMessage;
    }

    function balanceOf(address account) external view returns (uint256) {
        return address(account).balance;
    }

    function balanceLog(IERC20 _token) view public {
        uint256 amount = PineUtils.balanceOf(_token, address(msg.sender));

        console.log('balanceLog _token ..... ', address(_token));
        console.log('balanceLog sender ..... ', address(msg.sender));
        console.log('balanceLog sender ..... ', msg.sender);
        console.log('balanceLog amount ..... ', amount);
    }
}
