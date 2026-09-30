const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const owner = process.env.OWNER_ADDRESS || deployer.address;
  const initSupplyStr = process.env.INIT_SUPPLY || "2000000000";
  const initialSupply = hre.ethers.utils.parseUnits(initSupplyStr, 18);
  const maxSupply = hre.ethers.utils.parseUnits("2000000000", 18);

  if (initialSupply.gt(maxSupply)) {
    throw new Error("INIT_SUPPLY exceeds the 2,000,000,000 VTC maximum");
  }

  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("Owner:", owner);

  const Virtue = await hre.ethers.getContractFactory("VirtueToken");
  const vtc = await Virtue.deploy("Virtue Coin", "VTC", initialSupply, owner);
  await vtc.deployed();

  const Treasury = await hre.ethers.getContractFactory("WylieNationalBankTreasury");
  const treasury = await Treasury.deploy(vtc.address, owner);
  await treasury.deployed();

  const Fleet = await hre.ethers.getContractFactory("FrostedFleetSupremacy");
  const fleet = await Fleet.deploy(vtc.address, owner);
  await fleet.deployed();

  const deployment = {
    network: hre.network.name,
    deployer: deployer.address,
    owner,
    contracts: {
      VirtueToken: vtc.address,
      WylieNationalBankTreasury: treasury.address,
      FrostedFleetSupremacy: fleet.address
    },
    token: {
      name: "Virtue Coin",
      symbol: "VTC",
      decimals: 18,
      initialSupplyVTC: initSupplyStr,
      maxSupplyVTC: "2000000000",
      synchronicitiesPerVTC: 20
    },
    deployedAt: new Date().toISOString()
  };

  const outputDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, hre.network.name + ".json");
  fs.writeFileSync(outputPath, JSON.stringify(deployment, null, 2) + "\n");

  console.log("\nDeployment complete:");
  console.log(JSON.stringify(deployment, null, 2));
  console.log("\nDeployment manifest:", outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
