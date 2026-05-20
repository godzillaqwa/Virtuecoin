require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

const { DEPLOYER_PRIVATE_KEY, SEPOLIA_RPC_URL, MAINNET_RPC_URL, POLYGON_RPC_URL, BSC_RPC_URL } = process.env;

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.19" }
    ]
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : []
    },
    mainnet: {
      url: MAINNET_RPC_URL || "",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : []
    },
    polygon: {
      url: POLYGON_RPC_URL || "",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : []
    },
    bsc: {
      url: BSC_RPC_URL || "",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  }
};
