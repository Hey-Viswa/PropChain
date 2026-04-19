import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PropertyNFTModule = buildModule("PropertyNFTModule", (m) => {
  const deployer = m.getAccount(0);
  const propertyNFT = m.contract("PropertyNFT", [deployer]);
  return { propertyNFT };
});

export default PropertyNFTModule;