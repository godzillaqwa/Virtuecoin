.PHONY: setup deps build test deploy verify clean reset start-over

# Defaults
NETWORK ?= sepolia

setup:
	npm install

build:
	npm run compile

test:
	npm run test

deploy:
	@echo "Deploying to $(NETWORK) (ensure DEPLOYER_PRIVATE_KEY and RPC URL are set in .env)"
	node -e "require('dotenv').config(); process.env.NETWORK='$(NETWORK)'; require('child_process').spawnSync('npx', ['hardhat','run','scripts/deploy.js','--network','$(NETWORK)'], {stdio:'inherit'});"

verify:
	@echo "Verify on Etherscan: pass ADDRESS and NETWORK. Example: make verify ADDRESS=0x... NETWORK=sepolia"
	@npx hardhat verify --network $(NETWORK) $(ADDRESS) "Virtue Coin" "VIRT" $(CALLDATA)

clean:
	rm -rf cache artifacts node_modules

start-over: clean
	@echo "Start over: remove build artifacts. To remove the old Scilla contract manually delete contracts/virtue_coin.scilla if desired."

reset: start-over
	@echo "Reset complete"
