# VirtueCoin

VirtueCoin is an ERC-20 token implemented in Solidity with a Hardhat deployment and testing workflow.

## Canonical token rules

- **Name:** Virtue Coin
- **Symbol:** VTC
- **Decimals:** 18
- **Maximum supply:** 2,000,000,000 VTC
- **Synchronicities:** 20 Synchronicities = 1 VTC
- **Burning:** Supported; burned tokens reduce total supply.
- **Minting:** Owner-only and capped. Total supply can never exceed 2,000,000,000 VTC.
- **Owner:** Set at deployment.

The 2-billion value is a hard contract-level maximum. The owner cannot mint above it.

### Synchronicities

Synchronicities are the project's named subdivision of VTC:

- 1 VTC = 20 Synchronicities
- 1 Synchronicity = 0.05 VTC

The ERC-20 contract continues to use the standard 18-decimal base unit. Synchronicities are a protocol denomination, not a separate ERC-20 token.

## Repository structure

```
contracts/
├── VirtueToken.sol       # Active Solidity ERC-20 implementation
└── virtue_coin.scilla    # Preserved Scilla implementation

scripts/
└── deploy.js             # Hardhat deployment

test/
└── VirtueToken.test.js   # Solidity contract tests
```

## Setup

```bash
cp .env.example .env
make setup
```

Fill in `DEPLOYER_PRIVATE_KEY`, the desired RPC URL, and `ETHERSCAN_API_KEY` as appropriate. Never commit private keys.

## Test

```bash
make test
```

## Compile

```bash
make build
```

## Deploy

The default deployment configuration uses the full 2,000,000,000 VTC supply:

```bash
make deploy NETWORK=sepolia
```

You may set a lower `INIT_SUPPLY` in `.env` for a staged deployment. It cannot exceed the contract's 2-billion maximum.

## Verify

After deployment:

```bash
npx hardhat verify --network sepolia <DEPLOYED_ADDRESS> "Virtue Coin" "VTC" <INITIAL_SUPPLY_RAW> <OWNER_ADDRESS>
```

## Networks

Hardhat is configured for:

- local Hardhat
- Sepolia
- Ethereum Mainnet
- Polygon
- BSC

The repository currently does not include an active Scilla compiler/deployment pipeline. The Scilla contract is preserved for reference and future Zilliqa work.
