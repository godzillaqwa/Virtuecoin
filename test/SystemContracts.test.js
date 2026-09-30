const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VirtueCoin system contracts", function () {
  async function deployToken(owner) {
    const Virtue = await ethers.getContractFactory("VirtueToken");
    const token = await Virtue.deploy(
      "Virtue Coin",
      "VTC",
      ethers.utils.parseEther("1000"),
      owner.address
    );
    await token.deployed();
    return token;
  }

  it("WNB treasury accepts and withdraws VTC", async function () {
    const [owner, depositor, recipient] = await ethers.getSigners();
    const token = await deployToken(owner);

    const Treasury = await ethers.getContractFactory("WylieNationalBankTreasury");
    const treasury = await Treasury.deploy(token.address, owner.address);
    await treasury.deployed();

    const amount = ethers.utils.parseEther("100");
    await token.transfer(depositor.address, amount);
    await token.connect(depositor).approve(treasury.address, amount);
    await treasury.connect(depositor).depositVTC(amount);

    expect(await treasury.treasuryBalance()).to.equal(amount);

    await treasury.withdrawVTC(recipient.address, ethers.utils.parseEther("40"));
    expect(await token.balanceOf(recipient.address)).to.equal(ethers.utils.parseEther("40"));
    expect(await treasury.treasuryBalance()).to.equal(ethers.utils.parseEther("60"));
  });

  it("WNB records a separate external Tron vault reference", async function () {
    const [owner] = await ethers.getSigners();
    const token = await deployToken(owner);

    const Treasury = await ethers.getContractFactory("WylieNationalBankTreasury");
    const treasury = await Treasury.deploy(token.address, owner.address);
    await treasury.deployed();

    const tronReference = "TRON_VAULT_ADDRESS_PENDING";
    await treasury.setExternalTronVault(tronReference);

    expect(await treasury.externalTronVault()).to.equal(tronReference);
  });

  it("Frosted Fleet records players and daily supremacy", async function () {
    const [owner, player] = await ethers.getSigners();
    const token = await deployToken(owner);

    const Fleet = await ethers.getContractFactory("FrostedFleetSupremacy");
    const fleet = await Fleet.deploy(token.address, owner.address);
    await fleet.deployed();

    await fleet.connect(player).register();
    await fleet.setSynchronicities(player.address, 200);

    expect((await fleet.players(player.address)).registered).to.equal(true);
    expect((await fleet.players(player.address)).synchronicities).to.equal(200);
    expect(await fleet.synchronicitiesFromWholeVTC(10)).to.equal(200);

    const day = await fleet.currentDay();
    await fleet.selectDailySupreme(day, player.address, 12345);

    expect(await fleet.dailySupreme(day)).to.equal(player.address);
    expect(await fleet.isSupremeToday(player.address)).to.equal(true);
  });
});
