// SPDX-License-Identifier: GPL-2.0

pragma solidity ^0.6.12;


import "./Fabric.sol";


contract VaultFactory {
    using Fabric for bytes32;

    function getVault(bytes32  _data) public view returns (address) {
        return _data.getVault();
    }

    function executeVault(bytes32 _data, IERC20 _token, address _to) public {
        _data.executeVault(_token, _to);
    }
}
