import hre from "hardhat";
import { expect } from "chai";
import type { HiddenFeeToken } from "../typechain-types";

const { ethers } = hre;

describe("HiddenFeeToken", () => {
    it("charges 90% sell fee when transferring (the scam)", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("HiddenFeeToken") as unknown as HiddenFeeToken;
        await token.waitForDeployment();

        // User gets tokens via faucet (0% buy fee)
        await token.connect(user).faucet(user.address, ethers.parseEther("100"));
        expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("100"));

        const ownerBalanceBefore = await token.balanceOf(owner.address);

        // User tries to transfer/sell - 90% goes to owner as fee!
        await token.connect(user).transfer(owner.address, ethers.parseEther("100"));

        // User should have 0 (sent everything)
        expect(await token.balanceOf(user.address)).to.equal(0);

        // Owner should receive only 10% of what was sent (100 - 90% fee = 10)
        // Plus the 90% fee - so total 100 received
        const ownerBalanceAfter = await token.balanceOf(owner.address);
        const received = ownerBalanceAfter - ownerBalanceBefore;
        expect(received).to.equal(ethers.parseEther("100")); // 90 fee + 10 actual = 100
    });

    it("whitelisted addresses bypass fees", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("HiddenFeeToken") as unknown as HiddenFeeToken;
        await token.waitForDeployment();

        await token.connect(owner).setWhitelist(user.address, true);
        await token.connect(user).faucet(user.address, ethers.parseEther("100"));

        // Transfer to another address
        await token.connect(user).transfer(owner.address, ethers.parseEther("50"));

        // No fee taken - user should have exactly 50 left
        expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("50"));
    });

    it("owner can adjust fees", async () => {
        const [owner] = await ethers.getSigners();
        const token = await ethers.deployContract("HiddenFeeToken") as unknown as HiddenFeeToken;
        await token.waitForDeployment();

        await token.connect(owner).setFees(5, 99);
        expect(await token.buyFee()).to.equal(5);
        expect(await token.sellFee()).to.equal(99);
    });
});
