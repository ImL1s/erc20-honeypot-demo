// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TradingSwitchToken
 * @notice Demonstrates the "Trading Switch" scam pattern.
 *
 * How it works:
 * 1. Owner controls a tradingEnabled switch
 * 2. When enabled, everyone can trade
 * 3. Owner can disable trading anytime, trapping all holders
 * 4. Only whitelisted addresses (team) can transfer when disabled
 */
contract TradingSwitchToken is ERC20, Ownable {
    bool public tradingEnabled = true;  // Starts enabled to attract buyers
    uint256 public constant FAUCET_MAX = 1_000 ether;

    mapping(address => bool) public whitelist;

    event TradingStatusChanged(bool enabled);
    event Whitelisted(address indexed user, bool status);

    constructor() ERC20("Trading Switch Token", "TSWITCH") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 ether);
        whitelist[msg.sender] = true;
    }

    function setTradingEnabled(bool _enabled) external onlyOwner {
        tradingEnabled = _enabled;
        emit TradingStatusChanged(_enabled);
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

        // Whitelisted addresses can always transfer
        if (whitelist[from]) {
            super._update(from, to, amount);
            return;
        }

        // The trap: trading must be enabled!
        if (!tradingEnabled) {
            revert("Trading is disabled");
        }

        super._update(from, to, amount);
    }
}
