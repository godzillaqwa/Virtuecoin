# VirtueCoin API

Read-only blockchain API for VTC, the Wylie National Bank treasury, and
Frosted Fleet.

Endpoints:
- GET /health
- GET /api/v1/vtc
- GET /api/v1/vtc/balance/:address
- GET /api/v1/treasury
- GET /api/v1/fleet/today
- GET /api/v1/fleet/player/:address

The API reads blockchain state and does not store private keys or sign
transactions.

Environment:
- API_PORT
- API_RPC_URL
- VTC_CONTRACT_ADDRESS
- WNB_TREASURY_ADDRESS
- FLEET_CONTRACT_ADDRESS

TRON is represented only as an external reference until a separate audited
TRON integration exists.
