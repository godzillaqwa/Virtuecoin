// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title FrostedFleetSupremacy
 * @notice On-chain game-state layer for the daily Frosted Fleet supremacy
 * mechanic. Player balances are read from VTC; Synchronicities are recorded
 * as the game's scoring denomination.
 *
 * Randomness note: this contract deliberately does not pretend that
 * block.prevrandao is a secure production randomness oracle. A trusted game
 * operator can publish the daily winner now; a production deployment should
 * replace that step with a verifiable randomness system such as VRF.
 */
contract FrostedFleetSupremacy is Ownable {
    IERC20 public immutable vtc;
    uint256 public constant SYNCHRONICITIES_PER_VTC = 20;
    uint256 public constant DAY = 1 days;

    struct Player {
        bool registered;
        uint256 synchronicities;
    }

    mapping(address => Player) public players;
    mapping(uint256 => address) public dailySupreme;
    mapping(uint256 => uint256) public dailySeed;

    event PlayerRegistered(address indexed player);
    event SynchronicitiesUpdated(address indexed player, uint256 synchronicities);
    event DailySupremeSelected(
        uint256 indexed day,
        address indexed player,
        uint256 seed
    );

    constructor(address vtc_, address initialOwner_) {
        require(vtc_ != address(0), "Fleet: VTC is zero");
        require(initialOwner_ != address(0), "Fleet: owner is zero");

        vtc = IERC20(vtc_);
        _transferOwnership(initialOwner_);
    }

    function register() external {
        players[msg.sender].registered = true;
        emit PlayerRegistered(msg.sender);
    }

    /**
     * @dev Game operators may record Synchronicities earned through gameplay.
     * This does not mint or transfer VTC.
     */
    function setSynchronicities(address player, uint256 amount) external onlyOwner {
        require(player != address(0), "Fleet: player is zero");
        players[player] = Player({registered: true, synchronicities: amount});
        emit SynchronicitiesUpdated(player, amount);
    }

    function vtcBalance(address player) public view returns (uint256) {
        return vtc.balanceOf(player);
    }

    function synchronicitiesFromWholeVTC(uint256 wholeVTC) public pure returns (uint256) {
        return wholeVTC * SYNCHRONICITIES_PER_VTC;
    }

    function currentDay() public view returns (uint256) {
        return block.timestamp / DAY;
    }

    /**
     * @dev Publishes a daily winner. The seed is recorded for auditability.
     * Production deployments should source the seed from a verifiable
     * randomness provider rather than an operator-supplied value.
     */
    function selectDailySupreme(
        uint256 day,
        address player,
        uint256 seed
    ) external onlyOwner {
        require(day >= currentDay(), "Fleet: day is in the past");
        require(players[player].registered, "Fleet: player not registered");

        dailySupreme[day] = player;
        dailySeed[day] = seed;

        emit DailySupremeSelected(day, player, seed);
    }

    function isSupremeToday(address player) external view returns (bool) {
        return dailySupreme[currentDay()] == player;
    }
}
