const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VirtueToken", function () {
  const MAX_SUPPLY = ethers.utils.parseEther("2000000000");

  async function deploy(initialSupply, owner) {
    const Virtue = await ethers.getContractFactory("VirtueToken");
    const tokenOwner = owner || (await ethers.getSigners())[0].address;
    const virtue = await Virtue.deploy("Virtue Coin", "VTC", initialSupply, tokenOwner);
    await virtue.deployed();
    return virtue;
  }

  it("uses the canonical VTC token identity and 18 decimals", async function () {
    const [owner] = await ethers.getSigners();
    const virtue = await deploy(ethers.utils.parseEther("1000"), owner.address);

    expect(await virtue.name()).to.equal("Virtue Coin");
    expect(await virtue.symbol()).to.equal("VTC");
    expect(await virtue.decimals()).to.equal(18);
    expect(await virtue.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    expect(await virtue.SYNCHRONICITIES_PER_VTC()).to.equal(20);
  });

  it("mints the initial supply to the specified owner", async function () {
    const ownerAddress = "0xe04cA6224d28A09aeDDE64EaF7A4392CD0e775F5";
    const initialSupply = ethers.utils.parseEther("2000000000");
    const virtue = await deploy(initialSupply, ownerAddress);

    expect(await virtue.balanceOf(ownerAddress)).to.equal(initialSupply);
    expect(await virtue.totalSupply()).to.equal(initialSupply);
  });

  it("allows transfers", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const virtue = await deploy(ethers.utils.parseEther("1000"), owner.address);

    await virtue.transfer(addr1.address, ethers.utils.parseEther("100"));
    expect(await virtue.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));
  });

  it("allows owner minting only within the maximum supply", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const initialSupply = ethers.utils.parseEther("1000");
    const virtue = await deploy(initialSupply, owner.address);

    await virtue.mint(addr1.address, ethers.utils.parseEther("100"));
    expect(await virtue.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));

    await expect(
      virtue.connect(addr1).mint(addr1.address, ethers.utils.parseEther("1"))
    ).to.be.reverted;

    const remaining = MAX_SUPPLY.sub(initialSupply).sub(ethers.utils.parseEther("100"));
    await virtue.mint(owner.address, remaining);

    expect(await virtue.totalSupply()).to.equal(MAX_SUPPLY);

    await expect(
      virtue.mint(owner.address, ethers.utils.parseEther("1"))
    ).to.be.revertedWith("VirtueToken: max supply exceeded");
  });

  it("rejects an initial supply above the maximum", async function () {
    const [owner] = await ethers.getSigners();
    const Virtue = await ethers.getContractFactory("VirtueToken");

    await expect(
      Virtue.deploy(
        "Virtue Coin",
        "VTC",
        MAX_SUPPLY.add(1),
        owner.address
      )
    ).to.be.revertedWith("VirtueToken: initial supply exceeds max");
  });

  it("rejects a zero token owner", async function () {
    const Virtue = await ethers.getContractFactory("VirtueToken");

    await expect(
      Virtue.deploy("Virtue Coin", "VTC", ethers.utils.parseEther("1000"), ethers.constants.AddressZero)
    ).to.be.revertedWith("VirtueToken: owner is zero");
  });

  it("burns tokens and reduces total supply", async function () {
    const [owner] = await ethers.getSigners();
    const initialSupply = ethers.utils.parseEther("1000");
    const virtue = await deploy(initialSupply, owner.address);

    await virtue.burn(ethers.utils.parseEther("10"));

    expect(await virtue.totalSupply()).to.equal(
      initialSupply.sub(ethers.utils.parseEther("10"))
    );
  });
});
