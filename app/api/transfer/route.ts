import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { decodeEventLog, isAddress } from "viem";
import { publicClient } from "@/lib/auth/verifyOracleRole";
import {
  PROPERTY_NFT_ABI,
  PROPERTY_NFT_ADDRESS,
} from "@/lib/contracts/PropertyNFT.abi";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { User } from "@/lib/db/models/User";
import { ActivityLog } from "@/lib/db/models/ActivityLog";

const transferSchema = z.object({
  tokenId: z.coerce.number().int().nonnegative(),
  toWallet: z.string().refine((value) => isAddress(value), {
    message: "Invalid recipient wallet address",
  }),
  txHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash"),
});

type TransferEventArgs = {
  tokenId: bigint;
  from: `0x${string}`;
  to: `0x${string}`;
};

async function verifyTransferTransaction(params: {
  txHash: `0x${string}`;
  tokenId: number;
  toWallet: string;
  currentOwnerWallet: string;
}): Promise<{ valid: boolean; reason?: string }> {
  const { txHash, tokenId, toWallet, currentOwnerWallet } = params;

  let receipt: Awaited<
    ReturnType<typeof publicClient.waitForTransactionReceipt>
  >;

  try {
    receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 1,
      timeout: 30_000,
    });
  } catch {
    return { valid: false, reason: "Transaction not yet mined or timed out" };
  }

  if (!receipt) {
    return { valid: false, reason: "Transaction receipt not found" };
  }

  if (receipt.status !== "success") {
    return { valid: false, reason: "Transaction reverted on-chain" };
  }

  const contractAddress = PROPERTY_NFT_ADDRESS.toLowerCase();
  if (!receipt.to || receipt.to.toLowerCase() !== contractAddress) {
    return {
      valid: false,
      reason: "Transaction was not sent to the PropertyNFT contract",
    };
  }

  let transferEvent: TransferEventArgs | null = null;

  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== contractAddress) {
      continue;
    }

    try {
      const decoded = decodeEventLog({
        abi: PROPERTY_NFT_ABI,
        data: log.data,
        topics: log.topics,
        strict: false,
      });

      if (decoded.eventName === "Transfer") {
        transferEvent = decoded.args as unknown as TransferEventArgs;
        break;
      }
    } catch {
      // Ignore non-matching logs.
    }
  }

  if (!transferEvent) {
    return {
      valid: false,
      reason: "Transfer event not found in receipt logs",
    };
  }

  if (Number(transferEvent.tokenId) !== tokenId) {
    return {
      valid: false,
      reason: "TokenId mismatch in transfer event",
    };
  }

  if (transferEvent.to.toLowerCase() !== toWallet) {
    return {
      valid: false,
      reason: "Recipient wallet mismatch in transfer event",
    };
  }

  if (transferEvent.from.toLowerCase() !== currentOwnerWallet) {
    return {
      valid: false,
      reason: "Sender wallet mismatch in transfer event",
    };
  }

  return { valid: true };
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = transferSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const tokenId = parsed.data.tokenId;
    const toWallet = parsed.data.toWallet.toLowerCase();
    const txHash = parsed.data.txHash.toLowerCase();

    await connectDB();

    const alreadyProcessed = await PropertyRecord.collection.findOne(
      { transferTxHash: txHash },
      { projection: { _id: 1 } }
    );
    if (alreadyProcessed) {
      return NextResponse.json(
        { success: true, alreadyProcessed: true },
        { status: 200 }
      );
    }

    const user = await User.findOne({ clerkId: userId }).select("walletAddress");
    if (!user?.walletAddress) {
      return NextResponse.json(
        { error: "Forbidden: user does not own this property" },
        { status: 403 }
      );
    }

    const property = await PropertyRecord.findOne({ tokenId }).select("walletAddress tokenId");
    if (!property?.walletAddress) {
      return NextResponse.json(
        { error: "Invalid tokenId" },
        { status: 400 }
      );
    }

    const currentOwnerWallet = property.walletAddress.toLowerCase();
    const userWallet = user.walletAddress.toLowerCase();

    if (userWallet !== currentOwnerWallet) {
      return NextResponse.json(
        { error: "Forbidden: user does not own this property" },
        { status: 403 }
      );
    }

    const verification = await verifyTransferTransaction({
      txHash: txHash as `0x${string}`,
      tokenId,
      toWallet,
      currentOwnerWallet,
    });

    if (!verification.valid) {
      return NextResponse.json(
        {
          error: "Blockchain verification failed",
          reason: verification.reason,
        },
        { status: 500 }
      );
    }

    await PropertyRecord.findOneAndUpdate(
      { tokenId },
      {
        walletAddress: toWallet,
        transferTxHash: txHash,
        updatedAt: new Date(),
      },
      { strict: false }
    );

    await ActivityLog.create({
      clerkId: userId,
      walletAddress: userWallet,
      type: "TRANSFER_COMPLETE",
      description: `Property transfer confirmed on-chain: tokenId ${tokenId} from ${currentOwnerWallet} to ${toWallet}. TxHash: ${txHash}`,
      metadata: {
        tokenId,
        from: currentOwnerWallet,
        to: toWallet,
        txHash,
      },
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[transfer] Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
