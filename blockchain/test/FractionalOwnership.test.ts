import { expect } from "chai";
import { ethers } from "hardhat";

describe("FractionalOwnership", function () {
  async function deployFixture() {
    const [admin, owner, buyer] = await ethers.getSigners();

    // Deploy the core PropertyNFT and mint a token to `owner`.
    const NFT = await ethers.getContractFactory("PropertyNFT");
    const nft = await NFT.deploy(admin.address);
    await nft.verifyKYC(owner.address);
    await nft
      .connect(owner)
      .mintProperty("MH0123456789", "QmHash", "12 Pune", 1200);
    const tokenId = 0;

    // Deploy a fractional vault backed by that NFT contract.
    const Vault = await ethers.getContractFactory("FractionalOwnership");
    const vault = await Vault.deploy(
      await nft.getAddress(),
      "Fractional MH0123456789",
      "fPROP0"
    );

    return { nft, vault, admin, owner, buyer, tokenId };
  }

  it("fractionalizes an owned NFT into ERC-20 shares", async () => {
    const { nft, vault, owner, tokenId } = await deployFixture();

    await nft.connect(owner).approve(await vault.getAddress(), tokenId);
    await expect(
      vault.connect(owner).fractionalize(tokenId, 1000)
    ).to.emit(vault, "Fractionalized");

    expect(await nft.ownerOf(tokenId)).to.equal(await vault.getAddress());
    expect(await vault.balanceOf(owner.address)).to.equal(1000n);
    expect(await vault.totalSupply()).to.equal(1000n);
    expect(await vault.fractionalized()).to.equal(true);
    expect(await vault.underlyingTokenId()).to.equal(0n);
  });

  it("reverts fractionalizing a token the caller doesn't own", async () => {
    const { vault, buyer, tokenId } = await deployFixture();
    await expect(
      vault.connect(buyer).fractionalize(tokenId, 1000)
    ).to.be.revertedWith("Not token owner");
  });

  it("reverts a second fractionalize on the same vault", async () => {
    const { nft, vault, owner, tokenId } = await deployFixture();
    await nft.connect(owner).approve(await vault.getAddress(), tokenId);
    await vault.connect(owner).fractionalize(tokenId, 1000);
    await expect(
      vault.connect(owner).fractionalize(tokenId, 500)
    ).to.be.revertedWith("Already fractionalized");
  });

  it("blocks redemption unless the caller holds 100% of shares", async () => {
    const { nft, vault, owner, buyer, tokenId } = await deployFixture();
    await nft.connect(owner).approve(await vault.getAddress(), tokenId);
    await vault.connect(owner).fractionalize(tokenId, 1000);

    // Sell 40% to buyer — now neither party holds 100%.
    await vault.connect(owner).transfer(buyer.address, 400);
    await expect(vault.connect(owner).redeem()).to.be.revertedWith(
      "Need all shares"
    );
  });

  it("redeems the NFT when 100% of shares are reassembled", async () => {
    const { nft, vault, owner, buyer, tokenId } = await deployFixture();
    await nft.connect(owner).approve(await vault.getAddress(), tokenId);
    await vault.connect(owner).fractionalize(tokenId, 1000);

    await vault.connect(owner).transfer(buyer.address, 400);
    await vault.connect(buyer).transfer(owner.address, 400); // owner back to 100%

    await expect(vault.connect(owner).redeem()).to.emit(vault, "Redeemed");
    expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
    expect(await vault.totalSupply()).to.equal(0n);
    expect(await vault.fractionalized()).to.equal(false);
  });
});
