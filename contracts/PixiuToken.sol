// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PixiuToken
 * @notice Realistic honeypot demo using whitelist + auto-blacklist mechanism.
 *
 * How it works (like real honeypots):
 * 1. Whitelist: Team/owner addresses can always transfer (sell)
 * 2. Auto-blacklist: Buyers are automatically blacklisted when receiving tokens
 * 3. Blacklisted users can receive but cannot send tokens
 *
 * This mimics real honeypot behavior where:
 * - Team can sell anytime (whitelisted)
 * - Regular buyers get trapped (auto-blacklisted on purchase)
 */
contract PixiuToken is ERC20, Ownable {
    mapping(address => bool) public blacklist;
    mapping(address => bool) public whitelist;
    uint256 public constant FAUCET_MAX = 1_000 ether;
    bool public autoBlacklist; // Auto-blacklist buyers on purchase

    event Whitelisted(address indexed user, bool status);
    event Blacklisted(address indexed user, bool status);
    event AutoBlacklistChanged(bool enabled);

    constructor() ERC20("Pixiu Token", "PIXIU") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 ether);
        whitelist[msg.sender] = true; // Owner is whitelisted
        autoBlacklist = true; // Enable auto-blacklist by default
    }

    function setWhitelist(address user, bool v) external onlyOwner {
        whitelist[user] = v;
        emit Whitelisted(user, v);
    }

    function setBlacklist(address user, bool v) external onlyOwner {
        blacklist[user] = v;
        emit Blacklisted(user, v);
    }

    function setAutoBlacklist(bool v) external onlyOwner {
        autoBlacklist = v;
        emit AutoBlacklistChanged(v);
    }

    /// @notice Open faucet to mimic "buy works"; capped per call for demo.
    /// @dev Buyers are auto-blacklisted if autoBlacklist is enabled.
    function faucet(address to, uint256 amount) external {
        require(amount <= FAUCET_MAX, "Faucet too large");
        _mint(to, amount);
        // Auto-blacklist the buyer (simulates real honeypot behavior)
        if (autoBlacklist && !whitelist[to]) {
            blacklist[to] = true;
            emit Blacklisted(to, true);
        }
    }

    function _update(address from, address to, uint256 amount) internal override {
        // Minting (from == 0) is always allowed
        if (from != address(0)) {
            // Whitelisted addresses can always transfer (team can sell)
            if (!whitelist[from]) {
                // Non-whitelisted: check blacklist
                if (blacklist[from]) {
                    revert("Sell blocked: blacklisted");
                }
            }
        }
        super._update(from, to, amount);
    }
}
