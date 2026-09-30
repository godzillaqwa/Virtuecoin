// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title WylieNationalBankTreasury
 * @notice On-chain VTC treasury/accounting contract for the Wylie National Bank
 * project. This is a smart-contract treasury, not a regulated bank or bank
 * account, and it does not custody fiat deposits.
 */
contract WylieNationalBankTreasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable vtc;
    address public vault;
    string public externalTronVault;

    event VaultUpdated(address indexed previousVault, address indexed newVault);
    event TronVaultReferenceUpdated(string previousReference, string newReference);
    event VTCDeposited(address indexed from, uint256 amount);
    event VTCWithdrawn(address indexed to, uint256 amount);

    constructor(address vtc_, address initialOwner_) {
        require(vtc_ != address(0), "WNB: VTC is zero");
        require(initialOwner_ != address(0), "WNB: owner is zero");

        vtc = IERC20(vtc_);
        _transferOwnership(initialOwner_);
    }

    function setVault(address newVault) external onlyOwner {
        require(newVault != address(0), "WNB: vault is zero");
        address previousVault = vault;
        vault = newVault;
        emit VaultUpdated(previousVault, newVault);
    }

    /**
     * @dev Stores an external Tron vault identifier/address for operational
     * reference only. This contract cannot move TRON assets.
     */
    function setExternalTronVault(string calldata tronVaultReference) external onlyOwner {
        string memory previous = externalTronVault;
        externalTronVault = tronVaultReference;
        emit TronVaultReferenceUpdated(previous, tronVaultReference);
    }

    function depositVTC(uint256 amount) external nonReentrant {
        require(amount > 0, "WNB: amount is zero");
        vtc.safeTransferFrom(msg.sender, address(this), amount);
        emit VTCDeposited(msg.sender, amount);
    }

    function withdrawVTC(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "WNB: recipient is zero");
        require(amount > 0, "WNB: amount is zero");
        vtc.safeTransfer(to, amount);
        emit VTCWithdrawn(to, amount);
    }

    function treasuryBalance() external view returns (uint256) {
        return vtc.balanceOf(address(this));
    }
}
