// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HiddenFeeToken
 * @notice Demonstrates the "Hidden Fee" scam pattern.
 *
 * How it works:
 * 1. Buy fee is 0% - users can buy freely
 * 2. Sell fee is set to 90% by default - users lose 90% when selling
 * 3. Owner receives all the fees
 * 4. Owner can adjust fees anytime (even to 100%)
 */
contract HiddenFeeToken is ERC20, Ownable {
    uint256 public buyFee = 0;      // 0% buy fee (looks safe!)
    uint256 public sellFee = 90;    // 90% sell fee (the trap!)
    uint256 public constant FEE_DENOMINATOR = 100;
    uint256 public constant FAUCET_MAX = 1_000 ether;

    mapping(address => bool) public whitelist;

    event FeesUpdated(uint256 buyFee, uint256 sellFee);
    event Whitelisted(address indexed user, bool status);

    constructor() ERC20("Hidden Fee Token", "HFEE") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 ether);
        whitelist[msg.sender] = true;
    }

    function setFees(uint256 _buyFee, uint256 _sellFee) external onlyOwner {
        require(_buyFee <= 100 && _sellFee <= 100, "Fee too high");
        buyFee = _buyFee;
        sellFee = _sellFee;
        emit FeesUpdated(_buyFee, _sellFee);
    }

    function setWhitelist(address user, bool v) external onlyOwner {
        whitelist[user] = v;
        emit Whitelisted(user, v);
    }

    /// @notice Faucet to simulate "buying" tokens
    function faucet(address to, uint256 amount) external {
        require(amount <= FAUCET_MAX, "Faucet too large");
        // Buy has low/no fee, so users feel safe
        uint256 fee = (amount * buyFee) / FEE_DENOMINATOR;
        if (fee > 0) {
            _mint(owner(), fee);
        }
        _mint(to, amount - fee);
    }

    function _update(address from, address to, uint256 amount) internal override {
        // Minting is always allowed
        if (from == address(0)) {
            super._update(from, to, amount);
            return;
        }

        // Whitelisted addresses bypass fees
        if (whitelist[from]) {
            super._update(from, to, amount);
            return;
        }

        // Apply sell fee (this is the scam!)
        uint256 fee = (amount * sellFee) / FEE_DENOMINATOR;
        if (fee > 0) {
            super._update(from, owner(), fee);  // Fee goes to owner
        }
        super._update(from, to, amount - fee);  // User gets crumbs
    }
}
