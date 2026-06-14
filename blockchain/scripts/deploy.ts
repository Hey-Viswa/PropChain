/**
 * blockchain/scripts/deploy.ts
 *
 * Deploys the PropChain core + Phase 2 registry contracts and writes the
 * resulting addresses to ../deployments/<network>.json.
 *
 *   cd blockchain
 *   npx hardhat run scripts/deploy.ts --network amoy
 *
 * FractionalOwnership is deployed per-property (it needs the NFT address plus a
 * token name/symbol), so it is created on demand via scripts/fractionalize.ts
 * rather than in this global deploy.
 */
import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Network :", network.name);
  console.log("Deployer:", deployer.address);

  const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
  const propertyNFT = await PropertyNFT.deploy(deployer.address);
  await propertyNFT.waitForDeployment();
  const propertyNFTAddress = await propertyNFT.getAddress();
  console.log("PropertyNFT        ->", propertyNFTAddress);

  const EncumbranceRegistry = await ethers.getContractFactory("EncumbranceRegistry");
  const encumbrance = await EncumbranceRegistry.deploy(deployer.address);
  await encumbrance.waitForDeployment();
  const encumbranceAddress = await encumbrance.getAddress();
  console.log("EncumbranceRegistry ->", encumbranceAddress);

  const DisputeRegistry = await ethers.getContractFactory("DisputeRegistry");
  const dispute = await DisputeRegistry.deploy(deployer.address);
  await dispute.waitForDeployment();
  const disputeAddress = await dispute.getAddress();
  console.log("DisputeRegistry     ->", disputeAddress);

  const PropChainOracle = await ethers.getContractFactory("PropChainOracle");
  const oracle = await PropChainOracle.deploy(deployer.address);
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("PropChainOracle     ->", oracleAddress);

  const deployment = {
    network: network.name,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      PropertyNFT: propertyNFTAddress,
      EncumbranceRegistry: encumbranceAddress,
      DisputeRegistry: disputeAddress,
      PropChainOracle: oracleAddress,
    },
    env: {
      NEXT_PUBLIC_CONTRACT_ADDRESS: propertyNFTAddress,
      NEXT_PUBLIC_ENCUMBRANCE_ADDRESS: encumbranceAddress,
      NEXT_PUBLIC_DISPUTE_ADDRESS: disputeAddress,
      NEXT_PUBLIC_ORACLE_REGISTRY_ADDRESS: oracleAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });
  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name}.json`),
    JSON.stringify(deployment, null, 2)
  );

  console.log(`\nSaved deployments/${network.name}.json`);
  console.log("\nAdd these to .env.local:");
  for (const [k, v] of Object.entries(deployment.env)) console.log(`${k}=${v}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
