import { ethers } from "ethers";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const RPC_URL = "http://127.0.0.1:8545";
const APP_URL = "http://localhost:3000";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const MONGODB_URI = process.env.MONGODB_URI || "";

const artifactPath = path.resolve(
  __dirname,
  "../artifacts/contracts/PropertyNFT.sol/PropertyNFT.json"
);

async function runTests() {
  console.log("════════════════════════════════════════");
  console.log("TEST SUITE — PropChain Integration Tests");
  console.log("════════════════════════════════════════\n");

  let total = 0, passed = 0, failed = 0;
  const failures: { name: string; reason: string }[] = [];

  function reportPass(name: string) {
    console.log(`  ✅ ${name} — passed`);
    total++;
    passed++;
  }

  function reportFail(name: string, reason: string) {
    console.log(`  ❌ ${name} — FAILED: ${reason}`);
    total++;
    failed++;
    failures.push({ name, reason });
  }

  // SETUP
  if (!fs.existsSync(artifactPath)) {
    console.error(`Artifact not found at ${artifactPath}`);
    process.exit(1);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const signers = await provider.listAccounts();
  if (signers.length < 5) {
    console.error("Not enough accounts on local Hardhat node.");
    process.exit(1);
  }

  // Create standard ethers signers
  const account0 = await provider.getSigner(signers[0].address);
  const account1 = await provider.getSigner(signers[1].address);
  const account2 = await provider.getSigner(signers[2].address);
  const account3 = await provider.getSigner(signers[3].address);
  const account4 = await provider.getSigner(signers[4].address);

  const adminContract = new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, account0);
  const userContract = new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, account1);
  const oracleContract = new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, account2);
  const user2Contract = new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, account3);

  let mintedTokenId: bigint | null = null;
  const ULPIN_1 = "MH2024001234";
  const ULPIN_2 = "MH2024001235";

  // BLOCK 1 — CONTRACT SANITY
  console.log("════════════════════════════════════════\nBLOCK 1 — CONTRACT SANITY\n════════════════════════════════════════");
  
  try {
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code && code !== "0x") reportPass("TEST 1.1: Contract is deployed");
    else reportFail("TEST 1.1: Contract is deployed", "Bytecode is empty at address");
  } catch (e: any) { reportFail("TEST 1.1: Contract is deployed", e.message.substring(0, 100)); }

  try {
    const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const hasAdmin = await adminContract.hasRole(DEFAULT_ADMIN_ROLE, signers[0].address);
    if (hasAdmin) reportPass("TEST 1.2: Deployer holds DEFAULT_ADMIN_ROLE");
    else reportFail("TEST 1.2: Deployer holds DEFAULT_ADMIN_ROLE", "Admin role not found for account[0]");
  } catch (e: any) { reportFail("TEST 1.2: Deployer holds DEFAULT_ADMIN_ROLE", e.message.substring(0, 100)); }

  try {
    const ORACLE_ROLE = ethers.id("ORACLE_ROLE");
    const hasOracle = await adminContract.hasRole(ORACLE_ROLE, signers[2].address);
    if (!hasOracle) reportPass("TEST 1.3: No wallet has ORACLE_ROLE yet");
    else reportFail("TEST 1.3: No wallet has ORACLE_ROLE yet", "Account[2] surprisingly already has oracle role");
  } catch (e: any) { reportFail("TEST 1.3: No wallet has ORACLE_ROLE yet", e.message.substring(0, 100)); }

  try {
    const tx = await userContract.mintProperty(ULPIN_1, "QmTestHash123", "123 Test Street Mumbai", 1500);
    const receipt = await tx.wait();
    
    // Find PropertyRegistered event to get tokenId
    const propertyRegisteredEvent = receipt.logs
      .map((log: any) => {
        try { return userContract.interface.parseLog(log); } catch (e) { return null; }
      })
      .find((e: any) => e?.name === "PropertyRegistered");

    if (propertyRegisteredEvent && receipt.status === 1) {
      mintedTokenId = propertyRegisteredEvent.args.tokenId;
      reportPass("TEST 1.4: Mint a property directly on contract");
      console.log(`    tokenId minted = ${mintedTokenId}`);
      reportPass("TEST 1.5: PropertyRegistered event was emitted");
    } else {
      reportFail("TEST 1.4: Mint a property directly on contract", "Tx failed or event not found");
      reportFail("TEST 1.5: PropertyRegistered event was emitted", "Event not found");
    }
  } catch (e: any) {
    reportFail("TEST 1.4: Mint a property directly on contract", e.message.substring(0, 100));
    reportFail("TEST 1.5: PropertyRegistered event was emitted", e.message.substring(0, 100));
  }

  // BLOCK 2 — ORACLE ROLE MANAGEMENT
  console.log("\n════════════════════════════════════════\nBLOCK 2 — ORACLE ROLE MANAGEMENT\n════════════════════════════════════════");
  
  try {
    const ORACLE_ROLE = ethers.id("ORACLE_ROLE");
    const tx = await adminContract.grantRole(ORACLE_ROLE, signers[2].address);
    const receipt = await tx.wait();
    if (receipt.status === 1) reportPass("TEST 2.1: grantRole gives ORACLE_ROLE to account[2]");
    else reportFail("TEST 2.1: grantRole gives ORACLE_ROLE to account[2]", "Tx failed");
  } catch (e: any) { reportFail("TEST 2.1: grantRole gives ORACLE_ROLE to account[2]", e.message.substring(0, 100)); }

  try {
    const ORACLE_ROLE = ethers.id("ORACLE_ROLE");
    const hasOracle = await adminContract.hasRole(ORACLE_ROLE, signers[2].address);
    if (hasOracle) reportPass("TEST 2.2: hasRole confirms account[2] is now Oracle");
    else reportFail("TEST 2.2: hasRole confirms account[2] is now Oracle", "Account[2] is missing oracle role");
  } catch (e: any) { reportFail("TEST 2.2: hasRole confirms account[2] is now Oracle", e.message.substring(0, 100)); }

  try {
    const ORACLE_ROLE = ethers.id("ORACLE_ROLE");
    await userContract.grantRole(ORACLE_ROLE, signers[3].address);
    reportFail("TEST 2.3: Non-admin cannot grant ORACLE_ROLE", "Tx succeeded (security hole)");
  } catch (e: any) { 
    if (e.message.includes("revert")) reportPass("TEST 2.3: Non-admin cannot grant ORACLE_ROLE");
    else reportFail("TEST 2.3: Non-admin cannot grant ORACLE_ROLE", e.message.substring(0, 100)); 
  }

  try {
    if (mintedTokenId !== null) {
      const tx = await oracleContract.approveProperty(mintedTokenId);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        reportPass("TEST 2.4: approveProperty works when called by Oracle");
        console.log(`    PropertyApproved event emitted: ${mintedTokenId}`);
      } else reportFail("TEST 2.4: approveProperty works when called by Oracle", "Tx failed");
    } else reportFail("TEST 2.4: approveProperty works when called by Oracle", "Skipped due to TEST 1.4 failure");
  } catch (e: any) { reportFail("TEST 2.4: approveProperty works when called by Oracle", e.message.substring(0, 100)); }


  // BLOCK 3 — ACCESS CONTROL
  console.log("\n════════════════════════════════════════\nBLOCK 3 — ACCESS CONTROL\n════════════════════════════════════════");

  try {
    const txMint = await userContract.mintProperty(ULPIN_2, "QmTestHash456", "456 Test Street Mumbai", 2000);
    const receiptMint = await txMint.wait();
    const event = receiptMint.logs
      .map((log: any) => {
        try { return userContract.interface.parseLog(log); } catch (e) { return null; }
      })
      .find((e: any) => e?.name === "PropertyRegistered");

    const newTokenId = event?.args?.tokenId;
    if (newTokenId !== undefined) {
      // Try approve with non-oracle
      await userContract.approveProperty(newTokenId);
      reportFail("TEST 3.1: Non-oracle cannot approve property", "Tx succeeded (security hole)");
    } else {
      reportFail("TEST 3.1: Non-oracle cannot approve property", "Minting 2nd property failed");
    }
  } catch (e: any) { 
    if (e.message.includes("revert")) reportPass("TEST 3.1: Non-oracle cannot approve property");
    else reportFail("TEST 3.1: Non-oracle cannot approve property", e.message.substring(0, 100));
  }

  // transferProperty tests
  try {
    if (mintedTokenId !== null) {
      // account1 transfers to account3
      const tx = await userContract.transferProperty(mintedTokenId, signers[3].address);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        reportPass("TEST 3.2: Owner can transfer property");
        console.log("    OwnershipTransfer event emitted");
      } else reportFail("TEST 3.2: Owner can transfer property", "Tx failed");
    } else reportFail("TEST 3.2: Owner can transfer property", "Skipped due to TEST 1.4 failure");
  } catch (e: any) { reportFail("TEST 3.2: Owner can transfer property", e.message.substring(0, 100)); }

  try {
    if (mintedTokenId !== null) {
      // admin (not owner) tries to transfer
      await adminContract.transferProperty(mintedTokenId, signers[4].address);
      reportFail("TEST 3.3: Non-owner cannot transfer", "Tx succeeded (security hole)");
    } else reportFail("TEST 3.3: Non-owner cannot transfer", "Skipped due to TEST 1.4 failure");
  } catch (e: any) { 
    if (e.message.includes("revert") || e.message.includes("does not exist") || e.message.includes("Not the owner")) reportPass("TEST 3.3: Non-owner cannot transfer");
    else reportFail("TEST 3.3: Non-owner cannot transfer", e.message.substring(0, 100));
  }


  // BLOCK 4 — API ROUTES
  console.log("\n════════════════════════════════════════\nBLOCK 4 — API ROUTES\n════════════════════════════════════════");
  
  try {
    const res = await fetch(`${APP_URL}/api/health`).catch(() => fetch(`${APP_URL}`));
    if (res && res.status) reportPass("TEST 4.1: Health check — app is reachable");
    else reportFail("TEST 4.1: Health check — app is reachable", "Fetch failed");
  } catch (e: any) { reportFail("TEST 4.1: Health check — app is reachable", e.message.substring(0, 100)); }

  try {
    const res = await fetch(`${APP_URL}/api/oracle/verify-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase: "wrongpassword123" })
    });
    if (res.status === 401 || res.status === 403 || res.status === 400) reportPass("TEST 4.2: Oracle verify-access rejects wrong passphrase");
    else reportFail("TEST 4.2: Oracle verify-access rejects wrong passphrase", `Expected 401/403/400, got ${res.status}`);
  } catch (e: any) { reportFail("TEST 4.2: Oracle verify-access rejects wrong passphrase", e.message.substring(0, 100)); }

  try {
    let got429 = false;
    for (let i = 0; i < 6; i++) {
        const res = await fetch(`${APP_URL}/api/oracle/verify-access`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passphrase: "wrongpassword123" })
        });
        if (res.status === 429) got429 = true;
    }
    if (got429) reportPass("TEST 4.3: Rate limiting triggers on oracle verify-access");
    else reportFail("TEST 4.3: Rate limiting triggers on oracle verify-access", "No 429 received after 6 requests");
  } catch (e: any) { reportFail("TEST 4.3: Rate limiting triggers on oracle verify-access", e.message.substring(0, 100)); }

  try {
    const res = await fetch(`${APP_URL}/api/properties/owner`);
    if (res.status === 401 || res.status === 403 || res.status === 400 || res.status === 307) reportPass("TEST 4.4: Properties endpoint requires auth");
    else reportFail("TEST 4.4: Properties endpoint requires auth", `Expected 401/403/400/307, got ${res.status}`);
  } catch (e: any) { reportFail("TEST 4.4: Properties endpoint requires auth", e.message.substring(0, 100)); }


  // BLOCK 5 — EVENT LISTENER SYNC
  console.log("\n════════════════════════════════════════\nBLOCK 5 — EVENT LISTENER SYNC\n════════════════════════════════════════");
  
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      const propertySchema = new mongoose.Schema({}, { strict: false });
      const Property = mongoose.models.PropertyRecord || mongoose.model('PropertyRecord', propertySchema, 'propertyrecords');
      console.log(`    MongoDB collection: propertyrecords, field name: ulpin (lowercase in schema)`);

      // Wait a few seconds for an event listener that might be syncing blocks
      await new Promise(r => setTimeout(r, 2000));

      const pMinted = await Property.findOne({ ulpin: ULPIN_1 });
      if (pMinted) {
          console.log(`    MongoDB status = ${pMinted.status || pMinted.get('status')}`);
          if (pMinted.status === "minted" || pMinted.status === "confirmed" || pMinted.status === "approved" || pMinted.get('status')) {
              reportPass("TEST 5.1: MongoDB has the minted property from TEST 1.4");
          } else {
              reportFail("TEST 5.1: MongoDB has the minted property from TEST 1.4", `Status is unconfirmed: ${pMinted.status}`);
          }
      } else {
          reportFail("TEST 5.1: MongoDB has the minted property from TEST 1.4", "Not found in MongoDB");
      }

      // Check approval status
      const pApproved = await Property.findOne({ ulpin: ULPIN_1 });
      if (pApproved) {
        console.log(`    MongoDB status after approval = ${pApproved.status || pApproved.get('status')}`);
        if ((pApproved.status || pApproved.get('status')) === "approved" || (pApproved.status || pApproved.get('status')) === "transferred") {
          reportPass("TEST 5.2: MongoDB has the approved property from TEST 2.4");
        } else {
          reportFail("TEST 5.2: MongoDB has the approved property from TEST 2.4", `Status is not approved: ${pApproved.status || pApproved.get('status')}`);
        }
      } else {
        reportFail("TEST 5.2: MongoDB has the approved property from TEST 2.4", "Not found in MongoDB");
      }
      
      await mongoose.disconnect();
    } catch (e: any) {
      reportFail("TEST 5.1: MongoDB has the minted property from TEST 1.4", e.message.substring(0, 100));
      reportFail("TEST 5.2: MongoDB has the approved property from TEST 2.4", e.message.substring(0, 100));
    }
  } else {
    reportFail("TEST 5.1", "MONGODB_URI not found in .env.local");
    reportFail("TEST 5.2", "MONGODB_URI not found in .env.local");
  }

  console.log("\n════════════════════════════════════════\nFINAL REPORT\n════════════════════════════════════════");
  console.log(`  Total: ${total}`);
  console.log(`  Passed: ${passed} ✅`);
  console.log(`  Failed: ${failed} ❌\n`);

  if (failed > 0) {
    failures.forEach(f => {
      console.log(`    ❌ ${f.name}\n       Reason: ${f.reason}`);
    });
    process.exit(1);
  } else {
    console.log("  All systems operational. PropChain backend is working correctly.");
    process.exit(0);
  }
}

runTests().catch(console.error);