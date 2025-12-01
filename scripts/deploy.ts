import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const pixiu = await ethers.deployContract("PixiuToken");
  await pixiu.waitForDeployment();

  console.log("PixiuToken deployed to:", await pixiu.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
