# Production deployment checklist

## Build and test

```bash
npm ci
npm run compile
npm test
```

## Live deployment requirements

Configure `.env` locally and never commit it.

Required:
- DEPLOYER_PRIVATE_KEY
- RPC URL for the selected network

Optional:
- OWNER_ADDRESS
- ETHERSCAN_API_KEY

Deploy with an explicit network:

```bash
NETWORK=sepolia npm run deploy
```

For a production network, confirm the RPC endpoint and deployer wallet before signing.

## After deployment

Record the confirmed contract addresses and transaction hashes. Verify the contracts on the applicable block explorer.

Confirm:
- Virtue Coin / VTC
- 18 decimals
- maximum supply 2,000,000,000 VTC
- 20 Synchronicities = 1 VTC
- intended owner address

A GitHub commit does not itself deploy a blockchain contract.

## Contract-specific notes

WylieNationalBankTreasury is an on-chain VTC treasury contract. It is not a regulated bank or fiat deposit account. Its TRON vault field is an external reference and cannot move TRON assets.

FrostedFleetSupremacy currently records an operator-selected daily winner. It does not provide trustless randomness. A production economic game should integrate a verifiable randomness provider before treating winner selection as unpredictable.
