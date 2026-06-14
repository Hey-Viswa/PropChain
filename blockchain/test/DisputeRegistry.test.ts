import { expect } from "chai";
import { ethers } from "hardhat";

describe("DisputeRegistry", function () {
  async function deployFixture() {
    const [admin, citizen, resolver] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("DisputeRegistry");
    const registry = await Factory.deploy(admin.address);
    return { registry, admin, citizen, resolver };
  }

  it("lets any wallet raise a dispute", async () => {
    const { registry, citizen } = await deployFixture();
    await expect(
      registry.connect(citizen).raiseDispute(1, "Competing ownership claim")
    ).to.emit(registry, "DisputeRaised");
    expect(await registry.isDisputed(1)).to.equal(true);
    expect(await registry.disputeCount(1)).to.equal(1n);
    const d = await registry.getDispute(1);
    expect(d.raisedBy).to.equal(citizen.address);
    expect(d.resolved).to.equal(false);
  });

  it("reverts when raising over an active dispute", async () => {
    const { registry } = await deployFixture();
    await registry.raiseDispute(1, "First");
    await expect(registry.raiseDispute(1, "Second")).to.be.revertedWith(
      "Active dispute exists"
    );
  });

  it("reverts on an empty reason", async () => {
    const { registry } = await deployFixture();
    await expect(registry.raiseDispute(1, "")).to.be.revertedWith(
      "Reason required"
    );
  });

  it("lets a resolver resolve a dispute", async () => {
    const { registry, citizen } = await deployFixture();
    await registry.connect(citizen).raiseDispute(1, "Claim");
    await expect(registry.resolveDispute(1, "Dismissed after verification")).to.emit(
      registry,
      "DisputeResolved"
    );
    expect(await registry.isDisputed(1)).to.equal(false);
    const d = await registry.getDispute(1);
    expect(d.resolved).to.equal(true);
    expect(d.resolution).to.equal("Dismissed after verification");
  });

  it("blocks non-resolvers from resolving", async () => {
    const { registry, citizen } = await deployFixture();
    await registry.connect(citizen).raiseDispute(1, "Claim");
    await expect(
      registry.connect(citizen).resolveDispute(1, "nope")
    ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
  });

  it("reverts resolving when there is no active dispute", async () => {
    const { registry } = await deployFixture();
    await expect(registry.resolveDispute(5, "x")).to.be.revertedWith(
      "No active dispute"
    );
  });

  it("allows a new dispute after resolution", async () => {
    const { registry, citizen } = await deployFixture();
    await registry.connect(citizen).raiseDispute(1, "First");
    await registry.resolveDispute(1, "Resolved");
    await registry.connect(citizen).raiseDispute(1, "Second");
    expect(await registry.isDisputed(1)).to.equal(true);
    expect(await registry.disputeCount(1)).to.equal(2n);
  });
});
