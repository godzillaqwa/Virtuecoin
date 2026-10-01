# Deployment manifests

`scripts/deploy-all.js` generates a network-specific deployment manifest.

A repository commit does not deploy contracts to a blockchain. Live deployment requires a funded deployer wallet, a valid RPC endpoint, and execution against the intended network.

Do not commit private keys or populated `.env` files.
