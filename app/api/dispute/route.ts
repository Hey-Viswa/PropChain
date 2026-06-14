import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { PropertyRecord } from "@/lib/db/models/Property";
import { Dispute } from "@/lib/db/models/Dispute";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { disputeSchema } from "@/lib/validations";
import { notifyDispute } from "@/lib/services/emailService";
import { verifyTxReceipt } from "@/lib/services/txVerify";

/**
 * POST /api/dispute  { action: "raise" | "resolve", tokenId, ulpin, ... }
 * - raise:   any authenticated wallet may flag a property.
 * - resolve: ORACLE/SUPER_ADMIN only.
 * Mirrors the on-chain DisputeRegistry into MongoDB and notifies the owner.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const actor = await User.findOne({ clerkId: userId });
    if (!actor?.walletAddress) {
      return NextResponse.json({ error: "No wallet linked" }, { status: 403 });
    }

    const parsed = disputeSchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { action, tokenId, ulpin, reason, resolution, txHash } = parsed.data;

    const property = await PropertyRecord.findOne({ tokenId });
    const txVerified = txHash ? await verifyTxReceipt(txHash) : null;

    if (action === "raise") {
      if (!reason) {
        return NextResponse.json(
          { error: "reason is required to raise a dispute" },
          { status: 400 }
        );
      }
      const open = await Dispute.findOne({ tokenId, status: "open" });
      if (open) {
        return NextResponse.json(
          { error: "An open dispute already exists for this property" },
          { status: 409 }
        );
      }
      const dispute = await Dispute.create({
        tokenId,
        ulpin,
        raisedBy: actor.walletAddress,
        reason,
        status: "open",
        txHashRaise: txHash ?? null,
      });

      await ActivityLog.create({
        clerkId: userId,
        walletAddress: actor.walletAddress,
        type: "FRAUD_FLAG",
        description: `Dispute raised on token ${tokenId} (${ulpin})`,
        metadata: { tokenId, ulpin, reason, txHash },
        flagged: true,
        flagReason: "DISPUTE_RAISED",
      }).catch(() => {});

      await maybeNotifyOwner(property?.walletAddress, ulpin, "raised", reason);

      return NextResponse.json({ success: true, dispute, txVerified });
    }

    // action === "resolve" — oracle only
    if (!["ORACLE", "SUPER_ADMIN"].includes(actor.role)) {
      return NextResponse.json(
        { error: "Forbidden — resolving requires ORACLE role" },
        { status: 403 }
      );
    }
    if (!resolution) {
      return NextResponse.json(
        { error: "resolution is required to resolve a dispute" },
        { status: 400 }
      );
    }
    const dispute = await Dispute.findOneAndUpdate(
      { tokenId, status: "open" },
      {
        status: "resolved",
        resolution,
        resolvedBy: actor.walletAddress,
        resolvedAt: new Date(),
        txHashResolve: txHash ?? null,
      },
      { new: true }
    );
    if (!dispute) {
      return NextResponse.json(
        { error: "No open dispute to resolve" },
        { status: 404 }
      );
    }

    await ActivityLog.create({
      clerkId: userId,
      walletAddress: actor.walletAddress,
      type: "FRAUD_FLAG",
      description: `Dispute resolved on token ${tokenId} (${ulpin})`,
      metadata: { tokenId, ulpin, resolution, txHash },
    }).catch(() => {});

    await maybeNotifyOwner(property?.walletAddress, ulpin, "resolved", resolution);

    return NextResponse.json({ success: true, dispute, txVerified });
  } catch (err) {
    console.error("dispute error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function maybeNotifyOwner(
  ownerWallet: string | undefined,
  ulpin: string,
  changeAction: "raised" | "resolved",
  detail: string
) {
  try {
    if (!ownerWallet) return;
    const owner = await User.findOne({ walletAddress: ownerWallet.toLowerCase() });
    if (owner?.email) {
      await notifyDispute({ to: owner.email, ulpin, action: changeAction, detail });
    }
  } catch {
    /* best-effort */
  }
}
