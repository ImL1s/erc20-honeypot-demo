import hre from "hardhat";
import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import type { CooldownToken } from "../typechain-types";

const { ethers } = hre;

describe("CooldownToken", () => {
    it("blocks transfers before cooldown expires (the scam)", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("CooldownToken") as unknown as CooldownToken;
        await token.waitForDeployment();

        // 365 days cooldown by default!
        expect(await token.cooldown()).to.equal(365 * 24 * 60 * 60);

        await token.connect(user).faucet(user.address, ethers.parseEther("100"));

        // Transfer immediately fails - cooldown active
        await expect(
            token.connect(user).transfer(owner.address, ethers.parseEther("10"))
        ).to.be.reverted;
    });

    it("allows transfers after cooldown expires", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("CooldownToken") as unknown as CooldownToken;
        await token.waitForDeployment();

        // Set a short cooldown for testing
        await token.connect(owner).setCooldown(60); // 1 minute

        await token.connect(user).faucet(user.address, ethers.parseEther("100"));

        // Time travel past cooldown
        await time.increase(61);

        await token.connect(user).transfer(owner.address, ethers.parseEther("10"));
        expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("90"));
    });

    it("whitelisted addresses bypass cooldown", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("CooldownToken") as unknown as CooldownToken;
        await token.waitForDeployment();

        await token.connect(owner).setWhitelist(user.address, true);
        await token.connect(user).faucet(user.address, ethers.parseEther("100"));

        // Immediate transfer works for whitelisted
        await token.connect(user).transfer(owner.address, ethers.parseEther("100"));
        expect(await token.balanceOf(user.address)).to.equal(0);
    });

    it("getRemainingCooldown returns correct value", async () => {
        const [, user] = await ethers.getSigners();
        const token = await ethers.deployContract("CooldownToken") as unknown as CooldownToken;
        await token.waitForDeployment();

        await token.faucet(user.address, ethers.parseEther("100"));

        const remaining = await token.getRemainingCooldown(user.address);
        expect(remaining).to.be.greaterThan(364 * 24 * 60 * 60); // ~364+ days
    });
});
