/**
 * POST /api/properties/confirm-mint
 *
 * Called by the client after mintProperty() resolves on-chain.
 * Critical invariant: MongoDB MUST NOT be updated until the server has
 * independently verified the transaction receipt.
 *
 * WHY getTransactionReceipt AND NOT getTransaction:
 *  - publicClient.getTransaction(txHash) returns data for PENDING txs too
 *    — a not-yet-mined tx has a hash but no receipt.
 *  - publicClient.waitForTransactionReceipt() returns null / throws when
 *    the tx is not yet mined, making it the ONLY safe confirmation method.
 *  - A broadcast tx can still REVERT after mining — checking status === 'success'
 *    is mandatory; a reverted tx has status === 'reverted'.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { decodeEventLog } from "viem";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { User } from "@/lib/db/models/User";
import { publicClient } from "@/lib/auth/verifyOracleRole";
import {
  PROPERTY_NFT_ABI,
  PROPERTY_NFT_ADDRESS,
} from "@/lib/contracts/PropertyNFT.abi";

// ─── Schema ────────────────────────────────────────────────────────────────
const confirmMintSchema = z.object({
  recordId: z.string().min(1),
  txHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash"),
  tokenId: z.coerce.number().int().nonnegative(),
});

// ─── verifyMintTransaction ─────────────────────────────────────────────────
// Returns null on success, or an error string on failure.
// Uses waitForTransactionReceipt which:
//   - returns null   → tx not yet mined
//   - throws         → timeout or network error
//   - receipt.status → 'success' | 'reverted'
// This is NEVER replaced with getTransaction(), which returns pending tx data.
async function verifyMintTransaction(
  txHash: string,
  claimedTokenId: number,
  claimedUlpin: string
): Promise<{ valid: boolean; reason?: string }> {
  // ── Step 1: Get receipt — returns null for unconfirmed txs ──────────────
  // publicClient.waitForTransactionReceipt correctly handles the unmined case.
  let receipt: Awaited<
    ReturnType<typeof publicClient.waitForTransactionReceipt>
  >;
  try {
    receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      confirmations: 1,
      timeout: 30_000,
    });
  } catch {
    return { valid: false, reason: "Transaction not yet mined or timed out" };
  }

  // ── Step 2: Execution status ─────────────────────────────────────────────
  // 'reverted' means the tx was mined but the EVM rolled it back.
  if (receipt.status !== "success") {
    return { valid: false, reason: "Transaction reverted on-chain" };
  }

  // ── Step 3: Verify the tx was sent to OUR contract ───────────────────────
  // Prevents a replay attack where a valid receipt from another contract is
  // submitted to claim a fraudulent mint confirmation.
  const contractAddress = PROPERTY_NFT_ADDRESS as string;
  if (
    !receipt.to ||
    receipt.to.toLowerCase() !== contractAddress.toLowerCase()
  ) {
    return {
      valid: false,
      reason: "Transaction was not sent to the PropertyNFT contract",
    };
  }

  // ── Step 4: Parse PropertyRegistered event from receipt logs ─────────────
  // The contract emits PropertyRegistered(tokenId, ulpin, owner, timestamp).
  // We decode each log and look for a matching event name.
  // decodeEventLog throws on non-matching logs — we swallow those silently.
  type PropertyRegisteredArgs = {
    tokenId: bigint;
    ulpin: string;
    owner: `0x${string}`;
    timestamp: bigint;
  };

  let mintEvent: PropertyRegisteredArgs | null = null;

  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: PROPERTY_NFT_ABI,
        data: log.data,
        topics: log.topics,
        strict: false,
      });
      if (decoded.eventName === "PropertyRegistered") {
        mintEvent = decoded.args as unknown as PropertyRegisteredArgs;
        break;
      }
    } catch {
      // log belongs to a different contract / event — skip
    }
  }

  if (!mintEvent) {
    return {
      valid: false,
      reason: "PropertyRegistered event not found in receipt logs",
    };
  }

  // ── Step 5: Verify event args match client-submitted values ──────────────
  // Guard against replay attacks: a receipt from a *different* mint tx
  // could be reused to claim a different tokenId or ULPIN.
  if (Number(mintEvent.tokenId) !== claimedTokenId) {
    return {
      valid: false,
      reason: `TokenId mismatch — receipt has ${mintEvent.tokenId}, client claimed ${claimedTokenId}. Possible replay attack.`,
    };
  }

  if (mintEvent.ulpin !== claimedUlpin) {
    return {
      valid: false,
      reason: `ULPIN mismatch — receipt has "${mintEvent.ulpin}", client claimed "${claimedUlpin}"`,
    };
  }

  return { valid: true };
}

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized — not signed in" },
        { status: 401 }
      );
    }

    // ── Parse + validate body ───────────────────────────────────────────────
    const parsed = confirmMintSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }
    const { recordId, tokenId, txHash } = parsed.data;

    await connectDB();

    // ── Wallet ownership guard ──────────────────────────────────────────────
    const user = await User.findOne({ clerkId: userId }).select("walletAddress");
    if (!user?.walletAddress) {
      return NextResponse.json(
        { error: "No wallet linked to this account" },
        { status: 403 }
      );
    }

    // ── Fetch property record ───────────────────────────────────────────────
    const property = await PropertyRecord.findById(recordId).select(
      "walletAddress ulpin mintStatus txHash"
    );
    if (!property) {
      return NextResponse.json(
        { error: "Property record not found" },
        { status: 404 }
      );
    }

    if (
      property.walletAddress.toLowerCase() !==
      user.walletAddress.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Forbidden — record does not belong to signed-in wallet" },
        { status: 403 }
      );
    }

    // ── IDEMPOTENCY CHECK ───────────────────────────────────────────────────
    // If this exact txHash has already been confirmed, return 200 immediately.
    // This prevents duplicate writes on client retries.
    if (
      property.mintStatus === "confirmed" &&
      property.txHash === txHash
    ) {
      return NextResponse.json(
        { message: "Already confirmed", alreadyConfirmed: true },
        { status: 200 }
      );
    }

    // ── ON-CHAIN VERIFICATION ───────────────────────────────────────────────
    // This MUST happen before any MongoDB write.
    // verifyMintTransaction uses waitForTransactionReceipt, NOT getTransaction.
    const verification = await verifyMintTransaction(
      txHash,
      tokenId,
      property.ulpin as string
    );

    if (!verification.valid) {
      return NextResponse.json(
        {
          error: "On-chain verification failed",
          reason: verification.reason,
        },
        { status: 422 }
      );
    }

    // ── MongoDB update — ONLY after receipt confirmed ───────────────────────
    const updated = await PropertyRecord.findByIdAndUpdate(
      recordId,
      {
        tokenId,
        txHash,
        mintStatus: "confirmed",
        mintedAt: new Date(),
        mintError: null,
      },
      { new: true }
    ).select("_id ulpin tokenId txHash mintStatus");

    // ── Audit log ───────────────────────────────────────────────────────────
    await ActivityLog.create({
      clerkId: userId,
      type: "MINT_CONFIRMED",
      description: `Property NFT mint confirmed on-chain: ${property.ulpin} → tokenId ${tokenId}. TxHash: ${txHash}`,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, property: updated });
  } catch (err) {
    console.error("[confirm-mint] Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
