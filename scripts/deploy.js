const hre = require("hardhat");
require('dotenv').config();

async function main() {
  const owner = process.env.OWNER_ADDRESS || '0xe04cA6224d28A09aeDDE64EaF7A4392CD0e775F5';
  const initSupplyStr = process.env.INIT_SUPPLY || '1000000';
  const decimals = 18;
  const initialSupply = hre.ethers.utils.parseUnits(initSupplyStr, decimals);

  console.log("Deploying VirtueToken with:");
  console.log("  owner:", owner);
  console.log("  initialSupply:", initialSupply.toString());

  const Virtue = await hre.ethers.getContractFactory("VirtueToken");
  const virtue = await Virtue.deploy("Virtue Coin", "VIRT", initialSupply, owner);
  await virtue.deployed();

  console.log("VirtueToken deployed to:", virtue.address);

  // Output a command for verification
  console.log("\nTo verify on Etherscan run:");
  console.log(`npx hardhat verify --network ${process.env.NETWORK || 'sepolia'} ${virtue.address} "Virtue Coin" "VIRT" ${initialSupply.toString()} ${owner}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
