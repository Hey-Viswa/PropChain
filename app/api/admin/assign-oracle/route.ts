import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createWalletClient,
  createPublicClient,
  http,
  keccak256,
  toBytes,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai, hardhat } from "viem/chains";
import { connectDB } from "@/lib/db/mongoose";
import { AdminRole } from "@/lib/db/models/AdminRole";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { User } from "@/lib/db/models/User";
import {
  PROPERTY_NFT_ABI,
  PROPERTY_NFT_ADDRESS,
} from "@/lib/contracts/PropertyNFT.abi";

// ─── Chain config (mirrors verifyOracleRole.ts) ────────────────────────────
const chain =
  process.env.NODE_ENV === "production" ? polygonMumbai : hardhat;

const rpcUrl =
  process.env.NODE_ENV === "production"
    ? process.env.BLOCKCHAIN_RPC_URL          // server-only, never NEXT_PUBLIC_
    : "http://127.0.0.1:8545";

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // ── GUARD 1: Clerk session ───────────────────────────────────────────
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized — not signed in" },
        { status: 401 }
      );
    }

    await connectDB();

    // ── GUARD 2: Caller must be SUPER_ADMIN in MongoDB ───────────────────
    // MongoDB AdminRole is used ONLY as a cache for UI display — but for
    // SUPER_ADMIN gating this is acceptable since we do not expose an
    // on-chain SUPER_ADMIN role; the real authority is DEFAULT_ADMIN_ROLE
    // on the contract, which is what ADMIN_WALLET_PRIVATE_KEY holds.
    const callerRole = await AdminRole.findOne({
      clerkId: userId,
      role: "SUPER_ADMIN",
      active: true,
    });
    if (!callerRole) {
      return NextResponse.json(
        { error: "Forbidden — SUPER_ADMIN role required" },
        { status: 403 }
      );
    }

    // ── Parse body ───────────────────────────────────────────────────────
    const body = await req.json();
    const { targetClerkId, targetWallet } = body as {
      targetClerkId?: string;
      targetWallet?: string;
    };

    if (!targetClerkId || typeof targetClerkId !== "string") {
      return NextResponse.json(
        { error: "targetClerkId is required" },
        { status: 400 }
      );
    }

    // ── GUARD 3: Validate Ethereum address ───────────────────────────────
    if (!targetWallet || !ETH_ADDRESS_REGEX.test(targetWallet)) {
      return NextResponse.json(
        { error: "targetWallet must be a valid Ethereum address (0x...)" },
        { status: 400 }
      );
    }

    // ── GUARD 4: Check on-chain — already has ORACLE_ROLE? ───────────────
    // Always read from the chain — MongoDB is never authoritative for roles.
    const ORACLE_ROLE = keccak256(toBytes("ORACLE_ROLE"));

    const publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });

    const alreadyOracle = await publicClient.readContract({
      address: PROPERTY_NFT_ADDRESS as `0x${string}`,
      abi: PROPERTY_NFT_ABI,
      functionName: "hasRole",
      args: [ORACLE_ROLE, targetWallet as `0x${string}`],
    });

    if (alreadyOracle) {
      return NextResponse.json(
        { error: "Wallet already holds ORACLE_ROLE on-chain" },
        { status: 409 }
      );
    }

    // ── ENV validation ───────────────────────────────────────────────────
    const adminPrivateKey = process.env.ADMIN_WALLET_PRIVATE_KEY;
    if (!adminPrivateKey) {
      console.error("[assign-oracle] ADMIN_WALLET_PRIVATE_KEY is not set");
      return NextResponse.json(
        { error: "Server misconfiguration — admin key not available" },
        { status: 500 }
      );
    }

    // ── STEP 2: Call grantRole on-chain ──────────────────────────────────
    // ON-CHAIN FIRST: we never touch MongoDB until the receipt is confirmed.
    // This is the only source of truth for role authority.
    const rawKey = adminPrivateKey.startsWith("0x")
      ? adminPrivateKey
      : `0x${adminPrivateKey}`;
    const account = privateKeyToAccount(rawKey as `0x${string}`);

    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(rpcUrl),
    });

    let txHash: `0x${string}`;
    try {
      txHash = await walletClient.writeContract({
        address: PROPERTY_NFT_ADDRESS as `0x${string}`,
        abi: PROPERTY_NFT_ABI,
        functionName: "grantRole",
        args: [ORACLE_ROLE, targetWallet as `0x${string}`],
      });
    } catch (txErr) {
      console.error("[assign-oracle] grantRole tx failed:", txErr);
      return NextResponse.json(
        { error: "grantRole transaction failed — role NOT granted" },
        { status: 500 }
      );
    }

    // ── STEP 3: Wait for confirmed receipt ───────────────────────────────
    // NEVER update MongoDB on txHash alone — a broadcast tx can still revert.
    let receipt: Awaited<
      ReturnType<typeof publicClient.waitForTransactionReceipt>
    >;
    try {
      receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
        timeout: 30_000,
      });
    } catch (receiptErr) {
      console.error("[assign-oracle] Receipt wait failed:", receiptErr);
      // tx may have timed out or network error — do NOT write to MongoDB
      return NextResponse.json(
        {
          error:
            "Receipt confirmation timed out — role may or may not be granted on-chain. Do NOT retry blindly.",
          txHash,
        },
        { status: 500 }
      );
    }

    if (receipt.status !== "success") {
      return NextResponse.json(
        {
          error: "grantRole transaction reverted on-chain — role NOT granted",
          txHash,
        },
        { status: 500 }
      );
    }

    // ── STEP 4: On-chain confirmed → write MongoDB cache ─────────────────
    // If MongoDB fails here the role IS still granted on-chain (chain is truth).
    // We log the error and return 200 with a warning rather than 500.
    let dbWarning: string | undefined;
    try {
      await AdminRole.create({
        clerkId: targetClerkId,
        role: "ORACLE",
        walletAddress: targetWallet,
        active: true,
        assignedBy: userId,
        assignedAt: new Date(),
      });
    } catch (dbErr) {
      console.error(
        "[assign-oracle] MongoDB write failed after on-chain grant:",
        dbErr
      );
      dbWarning =
        "Oracle role was granted on-chain but MongoDB cache write failed. " +
        "Re-sync the DB record manually.";
    }

    // ── STEP 5: Audit log ────────────────────────────────────────────────
    try {
      await ActivityLog.create({
        clerkId: userId,
        type: "ORACLE_ROLE_GRANTED",
        description:
          `ORACLE_ROLE granted on-chain to wallet ${targetWallet} ` +
          `(clerkId: ${targetClerkId}) by admin ${userId}. TxHash: ${txHash}`,
        createdAt: new Date(),
      });
    } catch (auditErr) {
      // Logging must never crash the route
      console.error("[assign-oracle] ActivityLog write failed:", auditErr);
    }

    // ── STEP 6: Return 200 ───────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        txHash,
        ...(dbWarning ? { warning: dbWarning } : {}),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[assign-oracle] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
