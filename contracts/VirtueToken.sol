// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VirtueToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 2_000_000_000 * 10 ** 18;
    uint256 public constant SYNCHRONICITIES_PER_VTC = 20;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        address tokenOwner_
    ) ERC20(name_, symbol_) {
        require(tokenOwner_ != address(0), "VirtueToken: owner is zero");
        require(initialSupply_ <= MAX_SUPPLY, "VirtueToken: initial supply exceeds max");

        _mint(tokenOwner_, initialSupply_);
        transferOwnership(tokenOwner_);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "VirtueToken: max supply exceeded");
        _mint(to, amount);
    }
}
