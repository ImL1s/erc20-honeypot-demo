import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("");

  // Deploy all scam contracts
  const contracts = [
    "PixiuToken",
    "HiddenFeeToken",
    "TradingSwitchToken",
    "MaxTxToken",
    "CooldownToken"
  ];

  const addresses: Record<string, string> = {};

  for (const contractName of contracts) {
    console.log(`Deploying ${contractName}...`);
    const contract = await ethers.deployContract(contractName);
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    addresses[contractName] = address;
    console.log(`  ✓ ${contractName} deployed to: ${address}`);
  }

  console.log("");
  console.log("=".repeat(60));
  console.log("All contracts deployed successfully!");
  console.log("=".repeat(60));
  console.log("");
  console.log("Add these to your .env file:");
  console.log("");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${addresses["PixiuToken"]}`);
  console.log(`NEXT_PUBLIC_HIDDEN_FEE_ADDRESS=${addresses["HiddenFeeToken"]}`);
  console.log(`NEXT_PUBLIC_TRADING_SWITCH_ADDRESS=${addresses["TradingSwitchToken"]}`);
  console.log(`NEXT_PUBLIC_MAX_TX_ADDRESS=${addresses["MaxTxToken"]}`);
  console.log(`NEXT_PUBLIC_COOLDOWN_ADDRESS=${addresses["CooldownToken"]}`);
  console.log("");
  console.log("Etherscan verification commands:");
  console.log("");
  for (const [name, addr] of Object.entries(addresses)) {
    console.log(`npx hardhat verify --network sepolia ${addr}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
