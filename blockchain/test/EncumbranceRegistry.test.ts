import { expect } from "chai";
import { ethers } from "hardhat";

describe("EncumbranceRegistry", function () {
  async function deployFixture() {
    const [admin, bank, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("EncumbranceRegistry");
    const registry = await Factory.deploy(admin.address);
    return { registry, admin, bank, other };
  }

  it("grants BANK_ROLE to the deployer/admin", async () => {
    const { registry, admin } = await deployFixture();
    const BANK_ROLE = await registry.BANK_ROLE();
    expect(await registry.hasRole(BANK_ROLE, admin.address)).to.equal(true);
  });

  it("adds a lien and reports it as active", async () => {
    const { registry } = await deployFixture();
    await expect(registry.addLien(1, 500000, "Home loan #4567"))
      .to.emit(registry, "LienAdded");
    expect(await registry.hasActiveLien(1)).to.equal(true);
    const lien = await registry.getLien(1);
    expect(lien.amount).to.equal(500000n);
    expect(lien.active).to.equal(true);
    expect(await registry.lienCount(1)).to.equal(1n);
  });

  it("reverts when adding a lien while one is active", async () => {
    const { registry } = await deployFixture();
    await registry.addLien(1, 500000, "Loan A");
    await expect(registry.addLien(1, 100, "Loan B")).to.be.revertedWith(
      "Active lien exists"
    );
  });

  it("reverts on zero amount", async () => {
    const { registry } = await deployFixture();
    await expect(registry.addLien(1, 0, "Bad")).to.be.revertedWith(
      "Amount must be > 0"
    );
  });

  it("blocks non-bank wallets from adding liens", async () => {
    const { registry, other } = await deployFixture();
    await expect(
      registry.connect(other).addLien(1, 100, "x")
    ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
  });

  it("releases a lien and allows a new one afterwards", async () => {
    const { registry } = await deployFixture();
    await registry.addLien(1, 500000, "Loan A");
    await expect(registry.releaseLien(1)).to.emit(registry, "LienReleased");
    expect(await registry.hasActiveLien(1)).to.equal(false);

    await registry.addLien(1, 250000, "Loan B");
    expect(await registry.hasActiveLien(1)).to.equal(true);
    expect(await registry.lienCount(1)).to.equal(2n);
  });

  it("reverts releasing when no active lien", async () => {
    const { registry } = await deployFixture();
    await expect(registry.releaseLien(99)).to.be.revertedWith("No active lien");
  });

  it("lets admin grant BANK_ROLE to another wallet", async () => {
    const { registry, bank } = await deployFixture();
    await registry.grantBankRole(bank.address);
    await expect(registry.connect(bank).addLien(7, 1000, "Bank loan")).to.emit(
      registry,
      "LienAdded"
    );
  });
});
