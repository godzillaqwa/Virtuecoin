# Frosted Fleet

The repository now contains the initial on-chain state layer for the Frosted
Fleet game.

## Current mechanics

- Players can register.
- Gameplay can record a player's Synchronicity balance.
- 20 Synchronicities represent 1 VTC in the game's denomination.
- The contract can record one daily Supreme player.
- The selected player is associated with a day number and an auditable seed.
- The game contract does not mint VTC.
- The game contract does not hold player VTC.

## Randomness

The current contract intentionally uses an owner-published seed for the daily
selection record. That is **not equivalent to trustless randomness**.

Before production gameplay relies on randomized rewards or winner selection,
replace this mechanism with a verifiable randomness provider such as VRF and
test the complete economic/game flow.

## Relationship to VTC

VTC remains the canonical ERC-20 asset. Frosted Fleet is an application layer
that reads VTC balances and maintains game-specific state.
