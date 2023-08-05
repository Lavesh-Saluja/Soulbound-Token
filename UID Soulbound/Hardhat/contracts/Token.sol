// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract Token is ERC20{
    constructor() ERC20("STK", "Soulbound token") {
        _mint(msg.sender, 50*10**18);
    }
    function mint()public{
        _mint(msg.sender, 50*10**18);
    }
}