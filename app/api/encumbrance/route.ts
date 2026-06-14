import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { PropertyRecord } from "@/lib/db/models/Property";
import { Encumbrance } from "@/lib/db/models/Encumbrance";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { encumbranceSchema } from "@/lib/validations";
import { notifyLienChange } from "@/lib/services/emailService";
import { verifyTxReceipt } from "@/lib/services/txVerify";

/**
 * POST /api/encumbrance  { action: "add" | "release", tokenId, ulpin, ... }
 * Records a bank lien (encumbrance) against a property. BANK/ORACLE/SUPER_ADMIN
 * only. Mirrors the on-chain EncumbranceRegistry state into MongoDB and
 * notifies the property owner.
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
    if (!["BANK", "ORACLE", "SUPER_ADMIN"].includes(actor.role)) {
      return NextResponse.json(
        { error: "Forbidden — requires BANK or ORACLE role" },
        { status: 403 }
      );
    }

    const parsed = encumbranceSchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { action, tokenId, ulpin, amount, reason, txHash } = parsed.data;

    const property = await PropertyRecord.findOne({ tokenId });
    const txVerified = txHash ? await verifyTxReceipt(txHash) : null;

    if (action === "add") {
      if (!amount) {
        return NextResponse.json(
          { error: "amount is required to add a lien" },
          { status: 400 }
        );
      }
      const existing = await Encumbrance.findOne({ tokenId, status: "active" });
      if (existing) {
        return NextResponse.json(
          { error: "An active lien already exists for this property" },
          { status: 409 }
        );
      }
      const lien = await Encumbrance.create({
        tokenId,
        ulpin,
        lender: actor.walletAddress,
        amount,
        reason: reason ?? "",
        status: "active",
        txHashAdd: txHash ?? null,
      });

      await ActivityLog.create({
        clerkId: userId,
        walletAddress: actor.walletAddress,
        type: "LIEN_ADDED",
        description: `Lien added on token ${tokenId} (${ulpin}) for ${amount}`,
        metadata: { tokenId, ulpin, amount, txHash },
      }).catch(() => {});

      await maybeNotifyOwner(property?.walletAddress, ulpin, "added", amount);

      return NextResponse.json({ success: true, lien, txVerified });
    }

    // action === "release"
    const lien = await Encumbrance.findOneAndUpdate(
      { tokenId, status: "active" },
      { status: "released", releasedAt: new Date(), txHashRelease: txHash ?? null },
      { new: true }
    );
    if (!lien) {
      return NextResponse.json(
        { error: "No active lien to release" },
        { status: 404 }
      );
    }

    await ActivityLog.create({
      clerkId: userId,
      walletAddress: actor.walletAddress,
      type: "LIEN_RELEASED",
      description: `Lien released on token ${tokenId} (${ulpin})`,
      metadata: { tokenId, ulpin, txHash },
    }).catch(() => {});

    await maybeNotifyOwner(property?.walletAddress, ulpin, "released");

    return NextResponse.json({ success: true, lien, txVerified });
  } catch (err) {
    console.error("encumbrance error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function maybeNotifyOwner(
  ownerWallet: string | undefined,
  ulpin: string,
  changeAction: "added" | "released",
  amount?: number
) {
  try {
    if (!ownerWallet) return;
    const owner = await User.findOne({ walletAddress: ownerWallet.toLowerCase() });
    if (owner?.email) {
      await notifyLienChange({ to: owner.email, ulpin, action: changeAction, amount });
    }
  } catch {
    /* best-effort */
  }
}
