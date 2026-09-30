const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const owner = process.env.OWNER_ADDRESS || "0xe04cA6224d28A09aeDDE64EaF7A4392CD0e775F5";
  const initSupplyStr = process.env.INIT_SUPPLY || "2000000000";
  const decimals = 18;
  const maxSupply = hre.ethers.utils.parseUnits("2000000000", decimals);
  const initialSupply = hre.ethers.utils.parseUnits(initSupplyStr, decimals);

  if (initialSupply.gt(maxSupply)) {
    throw new Error("INIT_SUPPLY cannot exceed the 2,000,000,000 VTC maximum supply");
  }

  console.log("Deploying VirtueToken with:");
  console.log("  name: Virtue Coin");
  console.log("  symbol: VTC");
  console.log("  owner:", owner);
  console.log("  initialSupply:", initialSupply.toString());
  console.log("  maxSupply:", maxSupply.toString());

  const Virtue = await hre.ethers.getContractFactory("VirtueToken");
  const virtue = await Virtue.deploy("Virtue Coin", "VTC", initialSupply, owner);
  await virtue.deployed();

  console.log("VirtueToken deployed to:", virtue.address);

  console.log("\nTo verify on Etherscan run:");
  console.log(
    `npx hardhat verify --network ${process.env.NETWORK || "sepolia"} ${virtue.address} "Virtue Coin" "VTC" ${initialSupply.toString()} ${owner}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
