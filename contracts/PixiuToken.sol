// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PixiuToken
 * @notice Honeypot-style ERC20 demo: buying works, selling reverts due to blacklist/strict mode.
 */
contract PixiuToken is ERC20, Ownable {
    mapping(address => bool) public blacklist;
    uint256 public constant FAUCET_MAX = 1_000 ether;
    bool public strictMode;

    constructor() ERC20("Pixiu Token", "PIXIU") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 ether);
    }

    function setBlacklist(address user, bool v) external onlyOwner {
        blacklist[user] = v;
    }

    function setStrictMode(bool v) external onlyOwner {
        strictMode = v;
    }

    /// @notice Open faucet to mimic "buy works"; capped per call for demo.
    function faucet(address to, uint256 amount) external {
        require(amount <= FAUCET_MAX, "Faucet too large");
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 amount) internal override {
        if (from != address(0)) {
            if (strictMode) revert("Sell blocked: strict");
            if (blacklist[from]) revert("Sell blocked: blacklisted");
        }
        super._update(from, to, amount);
    }
}
