import { expect } from "chai";
import { ethers } from "hardhat";

describe("PropChainOracle", function () {
  async function deployFixture() {
    const [admin, oracle, bank, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("PropChainOracle");
    const registry = await Factory.deploy(admin.address);
    return { registry, admin, oracle, bank, other };
  }

  it("grants admin + ORACLE_ROLE to the deployer/admin", async () => {
    const { registry, admin } = await deployFixture();
    const ADMIN = await registry.DEFAULT_ADMIN_ROLE();
    expect(await registry.hasRole(ADMIN, admin.address)).to.equal(true);
    expect(await registry.isOracle(admin.address)).to.equal(true);
  });

  it("reverts when deployed with the zero admin", async () => {
    const Factory = await ethers.getContractFactory("PropChainOracle");
    await expect(Factory.deploy(ethers.ZeroAddress)).to.be.revertedWith(
      "Invalid admin"
    );
  });

  it("lets admin grant and revoke ORACLE_ROLE", async () => {
    const { registry, oracle } = await deployFixture();
    await expect(registry.grantOracle(oracle.address)).to.emit(
      registry,
      "OracleGranted"
    );
    expect(await registry.isOracle(oracle.address)).to.equal(true);

    await expect(registry.revokeOracle(oracle.address)).to.emit(
      registry,
      "OracleRevoked"
    );
    expect(await registry.isOracle(oracle.address)).to.equal(false);
  });

  it("lets admin grant and revoke BANK_ROLE", async () => {
    const { registry, bank } = await deployFixture();
    await expect(registry.grantBank(bank.address)).to.emit(
      registry,
      "BankGranted"
    );
    expect(await registry.isBank(bank.address)).to.equal(true);

    await expect(registry.revokeBank(bank.address)).to.emit(
      registry,
      "BankRevoked"
    );
    expect(await registry.isBank(bank.address)).to.equal(false);
  });

  it("blocks non-admins from granting roles", async () => {
    const { registry, other, bank } = await deployFixture();
    await expect(
      registry.connect(other).grantOracle(bank.address)
    ).to.be.revertedWithCustomError(
      registry,
      "AccessControlUnauthorizedAccount"
    );
  });

  it("rejects granting roles to the zero address", async () => {
    const { registry } = await deployFixture();
    await expect(registry.grantBank(ethers.ZeroAddress)).to.be.revertedWith(
      "Invalid account"
    );
  });
});
