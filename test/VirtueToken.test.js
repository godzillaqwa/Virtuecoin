const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VirtueToken", function () {
  it("mints initial supply to the specified owner", async function () {
    const ownerAddress = '0xe04cA6224d28A09aeDDE64EaF7A4392CD0e775F5';
    const Virtue = await ethers.getContractFactory("VirtueToken");
    const initialSupply = ethers.utils.parseEther("1000000");
    const virtue = await Virtue.deploy("Virtue Coin", "VIRT", initialSupply, ownerAddress);
    await virtue.deployed();

    const balance = await virtue.balanceOf(ownerAddress);
    expect(balance).to.equal(initialSupply);
  });

  it("allows transfers", async function () {
    const [deployer, addr1] = await ethers.getSigners();
    const owner = deployer.address;

    const Virtue = await ethers.getContractFactory("VirtueToken");
    const initialSupply = ethers.utils.parseEther("1000");
    const virtue = await Virtue.deploy("Virtue Coin", "VIRT", initialSupply, owner);
    await virtue.deployed();

    await virtue.transfer(addr1.address, ethers.utils.parseEther("100"));
    expect(await virtue.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));
  });

  it("only owner can mint", async function () {
    const [deployer, addr1] = await ethers.getSigners();

    const Virtue = await ethers.getContractFactory("VirtueToken");
    const initialSupply = ethers.utils.parseEther("1000");
    const virtue = await Virtue.deploy("Virtue Coin", "VIRT", initialSupply, deployer.address);
    await virtue.deployed();

    // owner mints
    await virtue.mint(addr1.address, ethers.utils.parseEther("100"));
    expect(await virtue.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));

    // non-owner cannot mint
    await expect(virtue.connect(addr1).mint(addr1.address, ethers.utils.parseEther("1"))).to.be.reverted;
  });

  it("burns tokens", async function () {
    const [deployer] = await ethers.getSigners();
    const Virtue = await ethers.getContractFactory("VirtueToken");
    const initialSupply = ethers.utils.parseEther("1000");
    const virtue = await Virtue.deploy("Virtue Coin", "VIRT", initialSupply, deployer.address);
    await virtue.deployed();

    await virtue.transfer(deployer.address, ethers.utils.parseEther("0"));
    // burn some tokens from deployer
    await virtue.burn(ethers.utils.parseEther("10"));
    // total supply reduced
    // Note: ERC20 doesn't expose totalSupply change verification easily here beyond checking balance reduce
    expect(await virtue.totalSupply()).to.equal(initialSupply.sub(ethers.utils.parseEther("10")));
  });
});
