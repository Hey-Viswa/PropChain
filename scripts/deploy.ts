import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const { ethers, network } = hre;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying PropertyNFT...");
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name);

  const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
  const contract = await PropertyNFT.deploy(deployer.address);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("PropertyNFT deployed to:", address);

  const deployment = {
    PropertyNFT: address,
    deployedAt: new Date().toISOString(),
    network: network.name,
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name}.json`),
    JSON.stringify(deployment, null, 2)
  );

  console.log(`Deployment saved to deployments/${network.name}.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
