# Wylie National Bank system

## Scope

The repository now contains an on-chain treasury contract named
`WylieNationalBankTreasury`.

It is a project treasury smart contract. It is **not, by itself, a regulated
bank, deposit-taking institution, money transmitter, or fiat banking account**.

## VTC relationship

The treasury is configured around the VirtueCoin ERC-20 contract:

- Asset: VTC
- Maximum VTC supply: 2,000,000,000
- Treasury can receive VTC through ERC-20 approvals/transfers.
- Only the treasury owner can withdraw VTC.
- A separate vault address can be recorded for operational custody planning.

## Tron vault

TRON uses a separate blockchain and address system. An Ethereum/Solidity
contract cannot directly move assets held at a TRON address.

The treasury therefore stores `externalTronVault` as an operational reference.
It does **not** claim to bridge, custody, or transfer TRON assets.

A future TRON integration must use an explicit bridge/custody design and its
own deployment and security review.

## $20 VTC reference

The project's previously specified value of **$20 per VTC** is treated as an
economic reference, not an on-chain guaranteed market price.

The VTC contract does not promise that VTC can be redeemed for $20, and no
USD reserve is implied by this repository.

Enforcing a $20 redemption value would require an actual reserve, redemption
rules, oracle/accounting controls, and appropriate legal/compliance design.
