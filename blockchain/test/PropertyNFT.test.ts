import { expect } from "chai";
import { ethers } from "hardhat";

describe("PropertyNFT", function () {
  async function deployFixture() {
    const [admin, user1, user2] = await ethers.getSigners();
    const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    const contract = await PropertyNFT.deploy(admin.address);
    return { contract, admin, user1, user2 };
  }

  it("Should deploy with correct name and symbol", async () => {
    const { contract } = await deployFixture();
    expect(await contract.name()).to.equal("PropChain Property");
    expect(await contract.symbol()).to.equal("PROP");
  });

  it("Should verify KYC for a wallet", async () => {
    const { contract, user1 } = await deployFixture();
    await contract.verifyKYC(user1.address);
    expect(await contract.kycVerified(user1.address)).to.equal(true);
  });

  it("Should mint a property after KYC", async () => {
    const { contract, admin, user1 } = await deployFixture();
    await contract.verifyKYC(user1.address);
    const tx = await contract.connect(user1).mintProperty(
      "MH0123456789", "QmHash123", "12 Shivaji Nagar Pune", 1200
    );
    const receipt = await tx.wait();
    expect(await contract.ownerOf(0)).to.equal(user1.address);
    expect(await contract.ulpinExists("MH0123456789")).to.equal(true);
  });

  it("Should reject mint without KYC", async () => {
    const { contract, user1 } = await deployFixture();
    await expect(
      contract.connect(user1).mintProperty(
        "MH0123456789", "QmHash123", "12 Shivaji Nagar Pune", 1200
      )
    ).to.be.revertedWith("KYC not verified");
  });

  it("Should reject duplicate ULPIN", async () => {
    const { contract, user1 } = await deployFixture();
    await contract.verifyKYC(user1.address);
    await contract.connect(user1).mintProperty(
      "MH0123456789", "QmHash1", "Address 1", 1000
    );
    await expect(
      contract.connect(user1).mintProperty(
        "MH0123456789", "QmHash2", "Address 2", 1000
      )
    ).to.be.revertedWith("ULPIN already registered");
  });

  it("Should allow oracle to approve property", async () => {
    const { contract, user1 } = await deployFixture();
    await contract.verifyKYC(user1.address);
    await contract.connect(user1).mintProperty(
      "MH0123456789", "QmHash123", "12 Pune", 1200
    );
    await contract.approveProperty(0);
    const property = await contract.getProperty(0);
    expect(property.isApproved).to.equal(true);
  });

  it("Should transfer property between KYC verified wallets", async () => {
    const { contract, user1, user2 } = await deployFixture();
    await contract.verifyKYC(user1.address);
    await contract.verifyKYC(user2.address);
    await contract.connect(user1).mintProperty(
      "MH0123456789", "QmHash123", "12 Pune", 1200
    );
    await contract.approveProperty(0);
    await contract.connect(user1).transferProperty(0, user2.address);
    expect(await contract.ownerOf(0)).to.equal(user2.address);
  });
});