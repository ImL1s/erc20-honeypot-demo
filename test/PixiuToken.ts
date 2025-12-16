import hre from "hardhat";
import { expect } from "chai";
import type { PixiuToken } from "../typechain-types";

const { ethers } = hre;

describe("PixiuToken", () => {
  it("auto-blacklists buyers on faucet (simulating purchase)", async () => {
    const [owner, user] = await ethers.getSigners();

    const pixiu = await ethers.deployContract("PixiuToken") as unknown as PixiuToken;
    await pixiu.waitForDeployment();

    // Faucet should auto-blacklist the buyer
    await expect(pixiu.connect(user).faucet(user.address, ethers.parseEther("10")))
      .to.emit(pixiu, "Blacklisted")
      .withArgs(user.address, true);

    expect(await pixiu.balanceOf(user.address)).to.equal(ethers.parseEther("10"));
    expect(await pixiu.blacklist(user.address)).to.equal(true);

    // Blacklisted user cannot transfer (sell)
    await expect(
      pixiu.connect(user).transfer(owner.address, ethers.parseEther("1"))
    ).to.be.revertedWith("Sell blocked: blacklisted");
  });

  it("allows whitelisted addresses to transfer even if blacklisted", async () => {
    const [owner, user] = await ethers.getSigners();
    const pixiu = await ethers.deployContract("PixiuToken") as unknown as PixiuToken;
    await pixiu.waitForDeployment();

    // Whitelist the user first, then faucet
    await pixiu.connect(owner).setWhitelist(user.address, true);
    await pixiu.connect(user).faucet(user.address, ethers.parseEther("10"));

    // Should NOT be blacklisted since whitelisted
    expect(await pixiu.blacklist(user.address)).to.equal(false);

    // Whitelisted user can transfer
    await pixiu.connect(user).transfer(owner.address, ethers.parseEther("1"));
    expect(await pixiu.balanceOf(user.address)).to.equal(ethers.parseEther("9"));
  });

  it("owner is whitelisted by default and can always transfer", async () => {
    const [owner, user] = await ethers.getSigners();
    const pixiu = await ethers.deployContract("PixiuToken") as unknown as PixiuToken;
    await pixiu.waitForDeployment();

    // Owner should be whitelisted
    expect(await pixiu.whitelist(owner.address)).to.equal(true);

    // Owner can transfer
    await pixiu.connect(owner).transfer(user.address, ethers.parseEther("1"));
    expect(await pixiu.balanceOf(user.address)).to.equal(ethers.parseEther("1"));
  });

  it("can disable auto-blacklist to allow normal trading", async () => {
    const [owner, user] = await ethers.getSigners();
    const pixiu = await ethers.deployContract("PixiuToken") as unknown as PixiuToken;
    await pixiu.waitForDeployment();

    // Disable auto-blacklist
    await pixiu.connect(owner).setAutoBlacklist(false);

    // Faucet without blacklisting
    await pixiu.connect(user).faucet(user.address, ethers.parseEther("10"));
    expect(await pixiu.blacklist(user.address)).to.equal(false);

    // User can now transfer
    await pixiu.connect(user).transfer(owner.address, ethers.parseEther("1"));
    expect(await pixiu.balanceOf(user.address)).to.equal(ethers.parseEther("9"));
  });

  it("owner can manually unblacklist a user", async () => {
    const [owner, user] = await ethers.getSigners();
    const pixiu = await ethers.deployContract("PixiuToken") as unknown as PixiuToken;
    await pixiu.waitForDeployment();

    // User gets auto-blacklisted
    await pixiu.connect(user).faucet(user.address, ethers.parseEther("10"));
    expect(await pixiu.blacklist(user.address)).to.equal(true);

    // Remove from blacklist
    await pixiu.connect(owner).setBlacklist(user.address, false);
    expect(await pixiu.blacklist(user.address)).to.equal(false);

    // Now user can transfer
    await pixiu.connect(user).transfer(owner.address, ethers.parseEther("1"));
    expect(await pixiu.balanceOf(user.address)).to.equal(ethers.parseEther("9"));
  });
});
