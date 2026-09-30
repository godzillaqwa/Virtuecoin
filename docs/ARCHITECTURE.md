# VirtueCoin system architecture

## Layer 1 — Asset

`contracts/VirtueToken.sol`

- ERC-20 VTC
- 18 decimals
- 2,000,000,000 VTC hard maximum
- owner-only capped minting
- burn support

## Layer 2 — Treasury

`contracts/WylieNationalBankTreasury.sol`

- Wylie National Bank project treasury
- VTC deposits
- owner-controlled VTC withdrawals
- separate external TRON vault reference
- no direct TRON bridge

## Layer 3 — Game

`contracts/FrostedFleetSupremacy.sol`

- player registration
- Synchronicity accounting
- daily Supreme state
- VTC balance visibility

## Layer 4 — Off-chain services still required

The repository does not yet contain:

- a web/mobile wallet interface
- a backend/API
- a production TRON bridge
- fiat banking infrastructure
- a USD reserve
- a production randomness oracle integration
- exchange liquidity
- KYC/AML/compliance systems
- a production game frontend

Those are separate systems and should not be represented as already operational merely because their smart-contract interfaces exist.
