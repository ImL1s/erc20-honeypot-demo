import { ethers } from "hardhat";
import { expect } from "chai";

describe("PixiuToken", () => {
  it("allows mint/buy but blocks sells when blacklisted", async () => {
    const [owner, user] = await ethers.getSigners();

    const pixiu = await ethers.deployContract("PixiuToken");
    await pixiu.waitForDeployment();

    // Mimic "buy": anyone can faucet to themselves.
    await expect(pixiu.connect(user).faucet(user.address, ethers.parseEther("10")))
      .to.emit(pixiu, "Transfer")
      .withArgs(ethers.ZeroAddress, user.address, ethers.parseEther("10"));

    expect(await pixiu.balanceOf(user.address)).to.equal(ethers.parseEther("10"));

    // Blacklist user → transfer out should revert
    await pixiu.connect(owner).setBlacklist(user.address, true);
    await expect(
      pixiu.connect(user).transfer(owner.address, ethers.parseEther("1"))
    ).to.be.revertedWith("Sell blocked: blacklisted");
  });

  it("blocks everyone when strictMode is on", async () => {
    const [owner, user] = await ethers.getSigners();
    const pixiu = await ethers.deployContract("PixiuToken");
    await pixiu.waitForDeployment();

    await pixiu.connect(user).faucet(user.address, ethers.parseEther("1"));
    await pixiu.connect(owner).setStrictMode(true);

    await expect(
      pixiu.connect(user).transfer(owner.address, ethers.parseEther("1"))
    ).to.be.revertedWith("Sell blocked: strict");
  });

  it("allows owner to transfer when not blocked", async () => {
    const [owner, user] = await ethers.getSigners();
    const pixiu = await ethers.deployContract("PixiuToken");
    await pixiu.waitForDeployment();

    await pixiu.connect(owner).transfer(user.address, ethers.parseEther("1"));
    expect(await pixiu.balanceOf(user.address)).to.equal(ethers.parseEther("1"));
  });
});
