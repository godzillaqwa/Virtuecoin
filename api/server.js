const express = require("express");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
const port = Number(process.env.API_PORT || 3000);
const rpcUrl = process.env.API_RPC_URL || process.env.SEPOLIA_RPC_URL;

if (!rpcUrl) throw new Error("Set API_RPC_URL or SEPOLIA_RPC_URL");
if (!process.env.VTC_CONTRACT_ADDRESS) throw new Error("Set VTC_CONTRACT_ADDRESS");

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const vtc = new ethers.Contract(process.env.VTC_CONTRACT_ADDRESS, [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function SYNCHRONICITIES_PER_VTC() view returns (uint256)"
], provider);

const treasury = process.env.WNB_TREASURY_ADDRESS
  ? new ethers.Contract(process.env.WNB_TREASURY_ADDRESS, [
      "function treasuryBalance() view returns (uint256)",
      "function externalTronVault() view returns (string)"
    ], provider)
  : null;

const fleet = process.env.FLEET_CONTRACT_ADDRESS
  ? new ethers.Contract(process.env.FLEET_CONTRACT_ADDRESS, [
      "function currentDay() view returns (uint256)",
      "function dailySupreme(uint256) view returns (address)",
      "function players(address) view returns (bool registered, uint256 synchronicities)",
      "function isSupremeToday(address) view returns (bool)"
    ], provider)
  : null;

app.get("/health", async (_req, res) => {
  res.json({ ok: true, network: await provider.getNetwork() });
});

app.get("/api/v1/vtc", async (_req, res) => {
  const [name, symbol, decimals, totalSupply, maxSupply, ratio] = await Promise.all([
    vtc.name(), vtc.symbol(), vtc.decimals(), vtc.totalSupply(),
    vtc.MAX_SUPPLY(), vtc.SYNCHRONICITIES_PER_VTC()
  ]);
  res.json({
    name, symbol, decimals,
    totalSupply: totalSupply.toString(),
    totalSupplyVTC: ethers.utils.formatUnits(totalSupply, decimals),
    maxSupply: maxSupply.toString(),
    maxSupplyVTC: ethers.utils.formatUnits(maxSupply, decimals),
    synchronicitiesPerVTC: ratio.toString()
  });
});

app.get("/api/v1/vtc/balance/:address", async (req, res) => {
  const address = ethers.utils.getAddress(req.params.address);
  const [balance, decimals] = await Promise.all([vtc.balanceOf(address), vtc.decimals()]);
  res.json({
    address,
    balance: balance.toString(),
    balanceVTC: ethers.utils.formatUnits(balance, decimals)
  });
});

app.get("/api/v1/treasury", async (_req, res) => {
  if (!treasury) return res.status(503).json({ error: "WNB_TREASURY_ADDRESS is not configured" });
  const [balance, tronVault] = await Promise.all([
    treasury.treasuryBalance(), treasury.externalTronVault()
  ]);
  res.json({
    vtcBalance: balance.toString(),
    vtcBalanceVTC: ethers.utils.formatEther(balance),
    externalTronVault: tronVault,
    note: "TRON vault reference only; this API does not custody or bridge TRON assets."
  });
});

app.get("/api/v1/fleet/today", async (_req, res) => {
  if (!fleet) return res.status(503).json({ error: "FLEET_CONTRACT_ADDRESS is not configured" });
  const day = await fleet.currentDay();
  res.json({ day: day.toString(), supreme: await fleet.dailySupreme(day) });
});

app.get("/api/v1/fleet/player/:address", async (req, res) => {
  if (!fleet) return res.status(503).json({ error: "FLEET_CONTRACT_ADDRESS is not configured" });
  const address = ethers.utils.getAddress(req.params.address);
  const [player, supremeToday] = await Promise.all([
    fleet.players(address), fleet.isSupremeToday(address)
  ]);
  res.json({
    address,
    registered: player.registered,
    synchronicities: player.synchronicities.toString(),
    supremeToday
  });
});

app.listen(port, () => console.log("VirtueCoin API listening on port " + port));
