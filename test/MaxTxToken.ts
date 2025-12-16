import hre from "hardhat";
import { expect } from "chai";
import type { MaxTxToken } from "../typechain-types";

const { ethers } = hre;

describe("MaxTxToken", () => {
    it("blocks transfers exceeding maxTxAmount (the scam)", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("MaxTxToken") as unknown as MaxTxToken;
        await token.waitForDeployment();

        // maxTxAmount is 0 by default - the trap!
        expect(await token.maxTxAmount()).to.equal(0);

        await token.connect(user).faucet(user.address, ethers.parseEther("100"));

        // Any transfer above 0 will fail
        await expect(
            token.connect(user).transfer(owner.address, ethers.parseEther("1"))
        ).to.be.revertedWith("Exceeds max transaction amount");
    });

    it("allows transfers when maxTxAmount is set high enough", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("MaxTxToken") as unknown as MaxTxToken;
        await token.waitForDeployment();

        // Owner raises the limit
        await token.connect(owner).setMaxTxAmount(ethers.parseEther("1000"));

        await token.connect(user).faucet(user.address, ethers.parseEther("100"));
        await token.connect(user).transfer(owner.address, ethers.parseEther("50"));
        expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("50"));
    });

    it("whitelisted addresses bypass max tx limit", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("MaxTxToken") as unknown as MaxTxToken;
        await token.waitForDeployment();

        await token.connect(owner).setWhitelist(user.address, true);
        await token.connect(user).faucet(user.address, ethers.parseEther("100"));

        // Even with maxTxAmount = 0, whitelisted can transfer
        await token.connect(user).transfer(owner.address, ethers.parseEther("100"));
        expect(await token.balanceOf(user.address)).to.equal(0);
    });
});
