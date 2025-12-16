import hre from "hardhat";
import { expect } from "chai";
import type { TradingSwitchToken } from "../typechain-types";

const { ethers } = hre;

describe("TradingSwitchToken", () => {
    it("blocks transfers when trading is disabled (the scam)", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("TradingSwitchToken") as unknown as TradingSwitchToken;
        await token.waitForDeployment();

        // User gets tokens
        await token.connect(user).faucet(user.address, ethers.parseEther("100"));
        expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("100"));

        // Owner disables trading!
        await token.connect(owner).setTradingEnabled(false);

        // User cannot transfer
        await expect(
            token.connect(user).transfer(owner.address, ethers.parseEther("10"))
        ).to.be.revertedWith("Trading is disabled");
    });

    it("allows transfers when trading is enabled", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("TradingSwitchToken") as unknown as TradingSwitchToken;
        await token.waitForDeployment();

        // Trading is enabled by default
        expect(await token.tradingEnabled()).to.equal(true);

        await token.connect(user).faucet(user.address, ethers.parseEther("100"));
        await token.connect(user).transfer(owner.address, ethers.parseEther("10"));
        expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("90"));
    });

    it("whitelisted addresses can transfer when trading disabled", async () => {
        const [owner, user] = await ethers.getSigners();
        const token = await ethers.deployContract("TradingSwitchToken") as unknown as TradingSwitchToken;
        await token.waitForDeployment();

        await token.connect(owner).setWhitelist(user.address, true);
        await token.connect(user).faucet(user.address, ethers.parseEther("100"));
        await token.connect(owner).setTradingEnabled(false);

        // Whitelisted user can still transfer
        await token.connect(user).transfer(owner.address, ethers.parseEther("10"));
        expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("90"));
    });
});
