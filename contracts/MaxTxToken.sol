// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MaxTxToken
 * @notice Demonstrates the "Max Transaction Limit" scam pattern.
 *
 * How it works:
 * 1. Owner sets a maxTxAmount limit
 * 2. Setting it to 0 means nobody can transfer any tokens
 * 3. Only whitelisted addresses bypass the limit
 * 4. Scammer can reduce limit after users buy in
 */
contract MaxTxToken is ERC20, Ownable {
    uint256 public maxTxAmount = 0;  // Set to 0 - nobody can sell!
    uint256 public constant FAUCET_MAX = 1_000 ether;

    mapping(address => bool) public whitelist;

    event MaxTxUpdated(uint256 newMax);
    event Whitelisted(address indexed user, bool status);

    constructor() ERC20("Max Tx Token", "MAXTX") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 ether);
        whitelist[msg.sender] = true;
    }

    function setMaxTxAmount(uint256 _maxTx) external onlyOwner {
        maxTxAmount = _maxTx;
        emit MaxTxUpdated(_maxTx);
    }

    function setWhitelist(address user, bool v) external onlyOwner {
        whitelist[user] = v;
        emit Whitelisted(user, v);
    }

    /// @notice Faucet to simulate "buying" tokens
    function faucet(address to, uint256 amount) external {
        require(amount <= FAUCET_MAX, "Faucet too large");
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 amount) internal override {
        // Minting is always allowed
        if (from == address(0)) {
            super._update(from, to, amount);
            return;
        }

        // Whitelisted addresses bypass the limit
        if (whitelist[from]) {
            super._update(from, to, amount);
            return;
        }

        // The trap: amount must be <= maxTxAmount
        if (amount > maxTxAmount) {
            revert("Exceeds max transaction amount");
        }

        super._update(from, to, amount);
    }
}
