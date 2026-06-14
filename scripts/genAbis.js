/**
 * scripts/genAbis.js
 *
 * Regenerates the typed ABI modules under lib/contracts/ from the compiled
 * Hardhat artifacts. Run after changing/compiling contracts:
 *
 *   cd blockchain && npx hardhat compile && cd ..
 *   node scripts/genAbis.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ARTIFACTS = path.join(ROOT, "blockchain", "artifacts", "contracts");
const OUT_DIR = path.join(ROOT, "lib", "contracts");

const TARGETS = [
  ["PropertyNFT", "PROPERTY_NFT", "NEXT_PUBLIC_CONTRACT_ADDRESS"],
  ["EncumbranceRegistry", "ENCUMBRANCE_REGISTRY", "NEXT_PUBLIC_ENCUMBRANCE_ADDRESS"],
  ["DisputeRegistry", "DISPUTE_REGISTRY", "NEXT_PUBLIC_DISPUTE_ADDRESS"],
  ["FractionalOwnership", "FRACTIONAL_OWNERSHIP", "NEXT_PUBLIC_FRACTIONAL_ADDRESS"],
];

for (const [name, prefix, env] of TARGETS) {
  const artPath = path.join(ARTIFACTS, `${name}.sol`, `${name}.json`);
  if (!fs.existsSync(artPath)) {
    console.warn(`skip ${name}: artifact not found (${artPath})`);
    continue;
  }
  const art = JSON.parse(fs.readFileSync(artPath, "utf8"));
  const abi = JSON.stringify(art.abi, null, 2);
  const out =
`// AUTO-GENERATED from blockchain/artifacts/contracts/${name}.sol/${name}.json
// Regenerate with: node scripts/genAbis.js
export const ${prefix}_ABI = ${abi} as const;

export const ${prefix}_ADDRESS = (process.env.${env} ?? "") as \`0x\${string}\`;
`;
  fs.writeFileSync(path.join(OUT_DIR, `${name}.abi.ts`), out);
  console.log(`wrote lib/contracts/${name}.abi.ts (${art.abi.length} abi entries)`);
}
