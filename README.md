# VirtueCoin Hardhat + Solidity setup

This repository now contains a Solidity ERC-20 implementation (VirtueToken) and a Hardhat-based workflow.

Quick steps:

1. Install dependencies
   cp .env.example .env
   # Fill in .env with your DEPLOYER_PRIVATE_KEY, RPC URLs and ETHERSCAN_API_KEY
   make setup

2. Run tests (local)
   make test

3. Compile
   make build

4. Deploy (example to sepolia)
   make deploy NETWORK=sepolia
   # or directly:
   # npx hardhat run scripts/deploy.js --network sepolia

5. Verify on Etherscan (after deploy)
   npx hardhat verify --network sepolia <DEPLOYED_ADDRESS> "Virtue Coin" "VIRT" <INITIAL_SUPPLY> <OWNER_ADDRESS>

Notes:
- The contract constructor is: VirtueToken(string name, string symbol, uint256 initialSupply, address tokenOwner)
- initialSupply should be passed as raw integer in wei (e.g. use the number printed by deploy script or use ethers.utils.parseUnits)
- Do NOT commit your private keys. Use .env (this repo includes .env.example only).
