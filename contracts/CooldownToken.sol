// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CooldownToken
 * @notice Demonstrates the "Cooldown Trap" scam pattern.
 *
 * How it works:
 * 1. Each address has a cooldown period after buying/receiving
 * 2. Owner can set cooldown to extreme values (e.g., 365 days)
 * 3. Users cannot sell until cooldown expires
 * 4. Effectively traps tokens forever
 */
contract CooldownToken is ERC20, Ownable {
    uint256 public cooldown = 365 days;  // 1 year cooldown!
    uint256 public constant FAUCET_MAX = 1_000 ether;

    mapping(address => uint256) public lastReceiveTime;
    mapping(address => bool) public whitelist;

    event CooldownUpdated(uint256 newCooldown);
    event Whitelisted(address indexed user, bool status);

    constructor() ERC20("Cooldown Token", "COOL") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 ether);
        whitelist[msg.sender] = true;
    }

    function setCooldown(uint256 _cooldown) external onlyOwner {
        cooldown = _cooldown;
        emit CooldownUpdated(_cooldown);
    }

    function setWhitelist(address user, bool v) external onlyOwner {
        whitelist[user] = v;
        emit Whitelisted(user, v);
    }

    /// @notice Faucet to simulate "buying" tokens
    function faucet(address to, uint256 amount) external {
        require(amount <= FAUCET_MAX, "Faucet too large");
        _mint(to, amount);
        lastReceiveTime[to] = block.timestamp;  // Start cooldown!
    }

    function getRemainingCooldown(address user) external view returns (uint256) {
        uint256 elapsed = block.timestamp - lastReceiveTime[user];
        if (elapsed >= cooldown) return 0;
        return cooldown - elapsed;
    }

    function _update(address from, address to, uint256 amount) internal override {
        // Minting is always allowed
        if (from == address(0)) {
            super._update(from, to, amount);
            return;
        }

        // Whitelisted addresses bypass cooldown
        if (whitelist[from]) {
            super._update(from, to, amount);
            return;
        }

        // The trap: must wait for cooldown to expire!
        uint256 elapsed = block.timestamp - lastReceiveTime[from];
        if (elapsed < cooldown) {
            uint256 remaining = cooldown - elapsed;
            revert(string(abi.encodePacked("Cooldown active: ", _formatDays(remaining), " remaining")));
        }

        super._update(from, to, amount);
    }

    function _formatDays(uint256 seconds_) internal pure returns (string memory) {
        uint256 days_ = seconds_ / 1 days;
        if (days_ > 0) {
            return string(abi.encodePacked(_toString(days_), " days"));
        }
        uint256 hours_ = seconds_ / 1 hours;
        return string(abi.encodePacked(_toString(hours_), " hours"));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
