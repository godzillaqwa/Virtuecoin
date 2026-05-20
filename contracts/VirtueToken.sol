// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VirtueToken is ERC20, ERC20Burnable, Ownable {
    constructor(string memory name_, string memory symbol_, uint256 initialSupply_, address tokenOwner_) ERC20(name_, symbol_) {
        _mint(tokenOwner_, initialSupply_);
        transferOwnership(tokenOwner_);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
