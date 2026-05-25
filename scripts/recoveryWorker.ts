/**
 * scripts/recoveryWorker.ts
 *
 * Standalone cron-style worker — runs every 5 minutes independently of Next.js.
 * Finds stuck PENDING_MINT / submitted properties older than 10 minutes and
 * reconciles them with the on-chain state.
 *
 * RUN: npx tsx scripts/recoveryWorker.ts
 *
 * WHY getTransactionReceipt AND NOT getTransaction:
 *   publicClient.getTransaction(txHash) returns data for PENDING txs.
 *   publicClient.getTransactionReceipt(txHash) returns null for unconfirmed txs.
 *   This is the correct method to detect "mined + succeeded" vs "not yet mined".
 *
 * ENV REQUIRED:
 *   MONGODB_URI
 *   BLOCKCHAIN_RPC_URL  (falls back to localhost:8545)
 *   NEXT_PUBLIC_CONTRACT_ADDRESS
 */
import "dotenv/config";
import mongoose from "mongoose";
import { createPublicClient, http } from "viem";
import { polygonMumbai, hardhat } from "viem/chains";

import { PropertyRecord } from "../lib/db/models/Property";
import { ActivityLog } from "../lib/db/models/ActivityLog";

// ─────────────────────────────── Config ────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI!;
const RPC_URL =
  process.env.NODE_ENV === "production"
    ? process.env.BLOCKCHAIN_RPC_URL!
    : "http://127.0.0.1:8545";
const CHAIN = process.env.NODE_ENV === "production" ? polygonMumbai : hardhat;

const INTERVAL_MS      = 5 * 60 * 1_000;  // 5 minutes
const STUCK_THRESHOLD  = 10 * 60 * 1_000; // 10 minutes old
const MAX_ATTEMPTS     = 3;               // mark MINT_FAILED after 3 failed receipt checks

// ─────────────────────────────── DB ────────────────────────────────────────
async function connectDB(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  console.log("[RecoveryWorker] MongoDB connected");
}

// ─────────────────────────────── Core logic ────────────────────────────────
async function runRecovery(): Promise<void> {
  const client = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL),
  });

  const stuckCutoff = new Date(Date.now() - STUCK_THRESHOLD);

  // Find properties that are stuck in "submitted" mintStatus
  // (the internal state when the user signed but never completed /confirm-mint)
  // and are older than the threshold.
  const stuckProperties = await PropertyRecord.find({
    mintStatus: "submitted",
    updatedAt: { $lt: stuckCutoff },
  }).lean();

  let recovered = 0;
  let failed    = 0;
  let skipped   = 0;

  for (const property of stuckProperties) {
    const id = String(property._id);

    // ── No txHash: user never signed — leave for user to retry ─────────
    if (!property.txHash) {
      console.log(
        `[RecoveryWorker] Property ${id} has no txHash — user never signed. Skipping.`
      );
      skipped++;
      continue;
    }

    // ── Fetch receipt — getTransactionReceipt returns null if not mined ─
    // NEVER use getTransaction() here — it returns data for pending txs too.
    let receipt: Awaited<
      ReturnType<typeof client.getTransactionReceipt>
    > | null = null;

    try {
      receipt = await client.getTransactionReceipt({
        hash: property.txHash as `0x${string}`,
      });
    } catch {
      // Likely "transaction not found" — treat as not mined yet
      receipt = null;
    }

    if (receipt && receipt.status === "success") {
      // ── Receipt confirmed and succeeded ─────────────────────────────
      await PropertyRecord.findByIdAndUpdate(id, {
        mintStatus: "confirmed",
        mintedAt: new Date(),
        mintError: null,
        recoveryAttempts: (property.recoveryAttempts ?? 0) + 1,
      });

      await ActivityLog.create({
        clerkId: `wallet:${property.walletAddress}`,
        type: "RECOVERY_MINT_CONFIRMED",
        description:
          `[Recovery] Confirmed stuck mint for property ${id}. ` +
          `ulpin=${property.ulpin}, txHash=${property.txHash}`,
        createdAt: new Date(),
      });

      console.log(`[RecoveryWorker] ✔ RECOVERED property ${id} (${property.ulpin})`);
      recovered++;

    } else if (receipt && receipt.status !== "success") {
      // ── Mined but REVERTED ───────────────────────────────────────────
      const newAttempts = (property.recoveryAttempts ?? 0) + 1;
      const update =
        newAttempts >= MAX_ATTEMPTS
          ? {
              mintStatus: "MINT_FAILED" as const,
              mintError: "Transaction reverted on-chain after recovery check",
              recoveryAttempts: newAttempts,
            }
          : {
              mintError: `Reverted (attempt ${newAttempts})`,
              recoveryAttempts: newAttempts,
            };

      await PropertyRecord.findByIdAndUpdate(id, update);

      if (newAttempts >= MAX_ATTEMPTS) {
        console.warn(
          `[RecoveryWorker] ✗ MINT_FAILED property ${id} — reverted (${newAttempts} attempts)`
        );
        failed++;
      } else {
        console.log(
          `[RecoveryWorker] ! Reverted (attempt ${newAttempts}/${MAX_ATTEMPTS}) — property ${id}`
        );
      }

    } else {
      // ── Receipt is null — not yet mined or tx was dropped ───────────
      const newAttempts = (property.recoveryAttempts ?? 0) + 1;
      const update =
        newAttempts >= MAX_ATTEMPTS
          ? {
              mintStatus: "MINT_FAILED" as const,
              mintError: "Transaction not found on-chain after max recovery attempts",
              recoveryAttempts: newAttempts,
            }
          : { recoveryAttempts: newAttempts };

      await PropertyRecord.findByIdAndUpdate(id, update);

      if (newAttempts >= MAX_ATTEMPTS) {
        console.warn(
          `[RecoveryWorker] ✗ MINT_FAILED property ${id} — no receipt after ${newAttempts} attempts`
        );
        failed++;
      } else {
        console.log(
          `[RecoveryWorker] ~ No receipt yet (attempt ${newAttempts}/${MAX_ATTEMPTS}) — property ${id}`
        );
      }
    }
  }

  console.log(
    `[RecoveryWorker] Recovery run complete. ` +
    `Recovered: ${recovered}, Failed: ${failed}, Skipped: ${skipped}`
  );
}

// ─────────────────────────────── Main loop ─────────────────────────────────
async function main(): Promise<void> {
  await connectDB();

  console.log(
    `[RecoveryWorker] Started. Running every ${INTERVAL_MS / 60_000} minutes. ` +
    `Stuck threshold: ${STUCK_THRESHOLD / 60_000} minutes. Max attempts: ${MAX_ATTEMPTS}.`
  );

  // Run immediately on startup, then every INTERVAL_MS
  await runRecovery().catch((err) =>
    console.error("[RecoveryWorker] Recovery run error:", err)
  );

  setInterval(async () => {
    await runRecovery().catch((err) =>
      console.error("[RecoveryWorker] Recovery run error:", err)
    );
  }, INTERVAL_MS);

  // Graceful shutdown
  process.on("SIGINT",  () => { console.log("\n[RecoveryWorker] Shutting down."); process.exit(0); });
  process.on("SIGTERM", () => { process.exit(0); });
}

main().catch((err) => {
  console.error("[RecoveryWorker] Fatal startup error:", err);
  process.exit(1);
});
