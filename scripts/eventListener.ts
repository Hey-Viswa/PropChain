/**
 * scripts/eventListener.ts
 *
 * Standalone process — runs independently of Next.js.
 * Watches PropertyNFT.sol events and syncs MongoDB in real-time.
 * This eliminates reliance on the client calling /confirm-mint.
 *
 * RUN: npx tsx scripts/eventListener.ts
 *
 * ENV REQUIRED (server-only, loaded from .env.local via dotenv):
 *   MONGODB_URI
 *   BLOCKCHAIN_RPC_URL   (or falls back to localhost:8545 in dev)
 *   NEXT_PUBLIC_CONTRACT_ADDRESS
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import {
  createPublicClient,
  http,
  Log,
  decodeEventLog,
  type Abi,
} from "viem";
import { polygonMumbai, hardhat } from "viem/chains";

// ── Load shared models (Next.js path alias won't work in raw tsx — use relative paths)
import { PropertyRecord } from "../lib/db/models/Property";
import { ActivityLog } from "../lib/db/models/ActivityLog";
import { PROPERTY_NFT_ABI, PROPERTY_NFT_ADDRESS } from "../lib/contracts/PropertyNFT.abi";

// ─────────────────────────────── Config ────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI!;
const RPC_URL =
  process.env.NODE_ENV === "production"
    ? process.env.BLOCKCHAIN_RPC_URL!
    : "http://127.0.0.1:8545";
const CHAIN = process.env.NODE_ENV === "production" ? polygonMumbai : hardhat;

const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_BACKOFF_MS = 5_000;
const MAX_BACKOFF_MS = 60_000;

// ─────────────────────────────── DB ────────────────────────────────────────
async function connectDB(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  console.log("[EventListener] MongoDB connected");
}

// ─────────────────────────────── Helpers ───────────────────────────────────
function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function backoffMs(attempt: number): number {
  return Math.min(BASE_BACKOFF_MS * Math.pow(2, attempt), MAX_BACKOFF_MS);
}

// ─────────────────────────────── Event handlers ────────────────────────────

/**
 * PropertyRegistered(tokenId, ulpin, owner, timestamp)
 * The contract event emitted by mintProperty(). Equivalent to "MintedProperty"
 * in the request spec — named PropertyRegistered in the actual ABI.
 */
async function handlePropertyRegistered(log: Log): Promise<void> {
  try {
    const decoded = decodeEventLog({
      abi: PROPERTY_NFT_ABI as Abi,
      data: log.data,
      topics: log.topics,
      strict: false,
    });
    if (decoded.eventName !== "PropertyRegistered") return;

    const args = decoded.args as unknown as {
      tokenId: bigint;
      ulpin: string;
      owner: `0x${string}`;
      timestamp: bigint;
    };

    const tokenId = Number(args.tokenId);
    const ulpin = args.ulpin;

    const updated = await PropertyRecord.findOneAndUpdate(
      { ulpin: ulpin.toUpperCase() },
      {
        tokenId,
        mintStatus: "confirmed",
        mintedAt: new Date(),
        mintError: null,
      },
      { new: true }
    );

    if (!updated) {
      console.warn(
        `[EventListener] PropertyRegistered: No record found for ulpin=${ulpin}`
      );
      return;
    }

    await ActivityLog.create({
      clerkId: `wallet:${args.owner}`,
      type: "EVENT_SYNC_MINTED",
      description: `[EventSync] PropertyRegistered: tokenId=${tokenId}, ulpin=${ulpin}, owner=${args.owner}`,
      createdAt: new Date(),
    });

    console.log(`[EventListener] ✔ PropertyRegistered synced: tokenId=${tokenId} ulpin=${ulpin}`);
  } catch (err) {
    console.error("[EventListener] handlePropertyRegistered error:", err);
  }
}

/**
 * PropertyApproved(tokenId, oracle)
 */
async function handlePropertyApproved(log: Log): Promise<void> {
  try {
    const decoded = decodeEventLog({
      abi: PROPERTY_NFT_ABI as Abi,
      data: log.data,
      topics: log.topics,
      strict: false,
    });
    if (decoded.eventName !== "PropertyApproved") return;

    const args = decoded.args as unknown as { tokenId: bigint; oracle: `0x${string}` };
    const tokenId = Number(args.tokenId);

    const updated = await PropertyRecord.findOneAndUpdate(
      { tokenId },
      { status: "approved", approvedBy: args.oracle, approvedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      console.warn(`[EventListener] PropertyApproved: No record for tokenId=${tokenId}`);
      return;
    }

    await ActivityLog.create({
      clerkId: `wallet:${args.oracle}`,
      type: "EVENT_SYNC_APPROVED",
      description: `[EventSync] PropertyApproved: tokenId=${tokenId}, oracle=${args.oracle}`,
      createdAt: new Date(),
    });

    console.log(`[EventListener] ✔ PropertyApproved synced: tokenId=${tokenId}`);
  } catch (err) {
    console.error("[EventListener] handlePropertyApproved error:", err);
  }
}

/**
 * PropertyRejected(tokenId, oracle, reason)
 */
async function handlePropertyRejected(log: Log): Promise<void> {
  try {
    const decoded = decodeEventLog({
      abi: PROPERTY_NFT_ABI as Abi,
      data: log.data,
      topics: log.topics,
      strict: false,
    });
    if (decoded.eventName !== "PropertyRejected") return;

    const args = decoded.args as unknown as {
      tokenId: bigint;
      oracle: `0x${string}`;
      reason: string;
    };
    const tokenId = Number(args.tokenId);

    const updated = await PropertyRecord.findOneAndUpdate(
      { tokenId },
      {
        status: "rejected",
        rejectedBy: args.oracle,
        rejectedAt: new Date(),
        rejectReason: args.reason ?? "Rejected on-chain",
      },
      { new: true }
    );

    if (!updated) {
      console.warn(`[EventListener] PropertyRejected: No record for tokenId=${tokenId}`);
      return;
    }

    await ActivityLog.create({
      clerkId: `wallet:${args.oracle}`,
      type: "EVENT_SYNC_REJECTED",
      description: `[EventSync] PropertyRejected: tokenId=${tokenId}, reason="${args.reason}"`,
      createdAt: new Date(),
    });

    console.log(`[EventListener] ✔ PropertyRejected synced: tokenId=${tokenId}`);
  } catch (err) {
    console.error("[EventListener] handlePropertyRejected error:", err);
  }
}

/**
 * OwnershipTransferInitiated(tokenId, from, to) — closest to TransferCompleted in the ABI.
 * The ABI has this event; adapt once TransferCompleted is added to the contract.
 */
async function handleTransfer(log: Log): Promise<void> {
  try {
    const decoded = decodeEventLog({
      abi: PROPERTY_NFT_ABI as Abi,
      data: log.data,
      topics: log.topics,
      strict: false,
    });
    if (decoded.eventName !== "OwnershipTransferInitiated") return;

    const args = decoded.args as unknown as {
      tokenId: bigint;
      from: `0x${string}`;
      to: `0x${string}`;
    };
    const tokenId = Number(args.tokenId);

    await PropertyRecord.findOneAndUpdate(
      { tokenId },
      { walletAddress: args.to.toLowerCase() },
      { new: true }
    );

    await ActivityLog.create({
      clerkId: `wallet:${args.from}`,
      type: "EVENT_SYNC_TRANSFER",
      description: `[EventSync] OwnershipTransferInitiated: tokenId=${tokenId}, from=${args.from}, to=${args.to}`,
      createdAt: new Date(),
    });

    console.log(`[EventListener] ✔ OwnershipTransferInitiated synced: tokenId=${tokenId} → ${args.to}`);
  } catch (err) {
    console.error("[EventListener] handleTransfer error:", err);
  }
}

// ─────────────────────────────── Subscription ──────────────────────────────
type UnwatchFn = () => void;

function subscribeToEvents(
  client: ReturnType<typeof createPublicClient>
): UnwatchFn[] {
  const contractAddress = PROPERTY_NFT_ADDRESS as `0x${string}`;

  // Each watchContractEvent call returns an unsubscribe function.
  const unwatchers: UnwatchFn[] = [
    client.watchContractEvent({
      address: contractAddress,
      abi: PROPERTY_NFT_ABI as Abi,
      eventName: "PropertyRegistered",
      onLogs: (logs) => logs.forEach(handlePropertyRegistered),
      onError: (err) => console.error("[EventListener] PropertyRegistered watch error:", err),
    }),
    client.watchContractEvent({
      address: contractAddress,
      abi: PROPERTY_NFT_ABI as Abi,
      eventName: "PropertyApproved",
      onLogs: (logs) => logs.forEach(handlePropertyApproved),
      onError: (err) => console.error("[EventListener] PropertyApproved watch error:", err),
    }),
    client.watchContractEvent({
      address: contractAddress,
      abi: PROPERTY_NFT_ABI as Abi,
      eventName: "PropertyRejected",
      onLogs: (logs) => logs.forEach(handlePropertyRejected),
      onError: (err) => console.error("[EventListener] PropertyRejected watch error:", err),
    }),
    client.watchContractEvent({
      address: contractAddress,
      abi: PROPERTY_NFT_ABI as Abi,
      eventName: "OwnershipTransferInitiated",
      onLogs: (logs) => logs.forEach(handleTransfer),
      onError: (err) => console.error("[EventListener] OwnershipTransferInitiated watch error:", err),
    }),
  ];

  return unwatchers;
}

// ─────────────────────────────── Main loop ─────────────────────────────────
async function main(): Promise<void> {
  await connectDB();

  let attempt = 0;

  async function connect(): Promise<void> {
    if (attempt >= MAX_RECONNECT_ATTEMPTS) {
      console.error(
        `[EventListener] Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Exiting.`
      );
      process.exit(1);
    }

    if (attempt > 0) {
      const wait = backoffMs(attempt - 1);
      console.log(`[EventListener] Reconnecting in ${wait / 1000}s (attempt ${attempt})...`);
      await delay(wait);
    }

    attempt++;

    try {
      const client = createPublicClient({
        chain: CHAIN,
        transport: http(RPC_URL),
      });

      // Verify connectivity before subscribing
      await client.getBlockNumber();

      const unwatchers = subscribeToEvents(client);

      console.log(
        `[EventListener] EventListenerService running. Watching PropertyNFT at ${PROPERTY_NFT_ADDRESS}`
      );

      // Reset attempt counter on clean connection
      attempt = 0;

      // Keep process alive; on transport error viem calls onError per watcher.
      // For WebSocket providers this would auto-reconnect; for HTTP polling
      // we rely on error events to trigger manual reconnect.
      // Poll every 60s as a heartbeat to detect silent disconnects.
      const heartbeat = setInterval(async () => {
        try {
          await client.getBlockNumber();
        } catch (err) {
          console.error("[EventListener] Heartbeat failed — reconnecting:", err);
          clearInterval(heartbeat);
          unwatchers.forEach((u) => u());
          void connect();
        }
      }, 60_000);

      // Graceful shutdown
      process.once("SIGINT", () => {
        console.log("\n[EventListener] SIGINT received — shutting down.");
        clearInterval(heartbeat);
        unwatchers.forEach((u) => u());
        process.exit(0);
      });
      process.once("SIGTERM", () => {
        clearInterval(heartbeat);
        unwatchers.forEach((u) => u());
        process.exit(0);
      });
    } catch (err) {
      console.error(`[EventListener] Connection failed (attempt ${attempt}):`, err);
      void connect();
    }
  }

  await connect();
}

main().catch((err) => {
  console.error("[EventListener] Fatal startup error:", err);
  process.exit(1);
});
