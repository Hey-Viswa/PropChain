/**
 * scripts/seed.ts
 *
 * Populates MongoDB with demo data so every screen shows real content during a
 * presentation — without manually minting on-chain first.
 *
 *   # use your connected MetaMask address so it shows on your dashboard:
 *   npm run seed -- 0xYourWalletAddress
 *   # or via env:
 *   SEED_WALLET=0xYourWalletAddress npm run seed
 *
 * Idempotent: re-running replaces the seeded properties for that wallet.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { PropertyRecord } from "../lib/db/models/Property";
import { Encumbrance } from "../lib/db/models/Encumbrance";
import { Dispute } from "../lib/db/models/Dispute";

const MONGODB_URI = process.env.MONGODB_URI;
const wallet = (process.argv[2] || process.env.SEED_WALLET || "").toLowerCase();

// High tokenIds so seeded display rows never collide with freshly minted
// tokens (which start at 0) during a live demo.
const SAMPLE = [
  { tokenId: 9001, ulpin: "MH0123456789", physicalAddress: "12, Shivaji Nagar, Pune", state: "Maharashtra", district: "Pune", areaSqFt: 1200, propertyType: "Residential", status: "approved" },
  { tokenId: 9002, ulpin: "MH9876543210", physicalAddress: "Bandra Kurla Complex, Mumbai", state: "Maharashtra", district: "Mumbai", areaSqFt: 5400, propertyType: "Commercial", status: "approved" },
  { tokenId: 9003, ulpin: "KA1122334455", physicalAddress: "100ft Road, Indiranagar, Bengaluru", state: "Karnataka", district: "Bengaluru", areaSqFt: 2100, propertyType: "Residential", status: "pending" },
  { tokenId: 9004, ulpin: "DL5544332211", physicalAddress: "Sector 12, Dwarka, New Delhi", state: "Delhi", district: "New Delhi", areaSqFt: 1800, propertyType: "Residential", status: "pending" },
  { tokenId: 9005, ulpin: "GJ6677889900", physicalAddress: "Satellite Road, Ahmedabad", state: "Gujarat", district: "Ahmedabad", areaSqFt: 9000, propertyType: "Agricultural", status: "rejected" },
];

async function main() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set in .env.local");
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    throw new Error("Provide a wallet address: npm run seed -- 0xYourAddress");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected. Seeding for wallet:", wallet);

  // Reset previously seeded properties for this wallet, then insert fresh.
  const ulpins = SAMPLE.map((s) => s.ulpin);
  await PropertyRecord.deleteMany({ ulpin: { $in: ulpins } });
  await Encumbrance.deleteMany({ ulpin: { $in: ulpins } });
  await Dispute.deleteMany({ ulpin: { $in: ulpins } });

  for (const s of SAMPLE) {
    await PropertyRecord.create({
      walletAddress: wallet,
      tokenId: s.tokenId,
      ulpin: s.ulpin,
      physicalAddress: s.physicalAddress,
      areaSqFt: s.areaSqFt,
      propertyType: s.propertyType,
      description: `${s.propertyType} property in ${s.district}, ${s.state}.`,
      documentUrl: "",
      status: s.status,
      mintStatus: "confirmed",
      mintedAt: new Date(),
      approvedAt: s.status === "approved" ? new Date() : null,
    });
  }

  // A Phase-2 encumbrance + dispute for the demo.
  await Encumbrance.create({
    tokenId: 9002, ulpin: "MH9876543210", lender: wallet, amount: 5000000,
    reason: "Commercial mortgage #CM-2025-014", status: "active",
  });
  await Dispute.create({
    tokenId: 9005, ulpin: "GJ6677889900", raisedBy: wallet,
    reason: "Competing ownership claim filed at sub-registrar office.", status: "open",
  });

  const counts = {
    properties: await PropertyRecord.countDocuments({ walletAddress: wallet }),
    activeLiens: await Encumbrance.countDocuments({ status: "active" }),
    openDisputes: await Dispute.countDocuments({ status: "open" }),
  };
  console.log("Seed complete:", counts);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
