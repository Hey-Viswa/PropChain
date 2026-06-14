import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { PropertyRecord } from "@/lib/db/models/Property";
import { Nomination } from "@/lib/db/models/Nomination";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { successionSchema } from "@/lib/validations";
import { verifyTxReceipt } from "@/lib/services/txVerify";
import { hasAnyRole } from "@/lib/auth/roles";

/**
 * GET /api/succession?tokenId=123
 * Returns the active inheritance nomination for a token (or null).
 */
export async function GET(req: NextRequest) {
  const tokenId = Number(req.nextUrl.searchParams.get("tokenId"));
  if (!Number.isInteger(tokenId) || tokenId < 0) {
    return NextResponse.json({ error: "Invalid token id" }, { status: 400 });
  }
  try {
    await connectDB();
    const record = await Nomination.findOne({ tokenId, status: "active" }).lean();
    return NextResponse.json({ tokenId, nomination: record ?? null });
  } catch (err) {
    console.error("succession GET error:", err);
    return NextResponse.json({ tokenId, nomination: null });
  }
}

/**
 * POST /api/succession  { action, tokenId, ulpin, ... }
 * - nominate / revoke: property owner only — register or clear heirs.
 * - execute: ORACLE/SUPER_ADMIN only — simulates a registrar-attested
 *   succession event, reassigning ownership to a nominated heir.
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

    const parsed = successionSchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { action, tokenId, ulpin, nominees, executeTo, note, txHash } = parsed.data;

    const property = await PropertyRecord.findOne({ tokenId });
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    const isOwner =
      property.walletAddress?.toLowerCase() === actor.walletAddress.toLowerCase();
    const txVerified = txHash ? await verifyTxReceipt(txHash) : null;

    // ── nominate ───────────────────────────────────────────────────────────
    if (action === "nominate") {
      if (!isOwner) {
        return NextResponse.json(
          { error: "Forbidden — only the owner can nominate heirs" },
          { status: 403 }
        );
      }
      if (!nominees || nominees.length === 0) {
        return NextResponse.json(
          { error: "At least one nominee is required" },
          { status: 400 }
        );
      }
      const totalPct = nominees.reduce((s, n) => s + n.sharePct, 0);
      if (totalPct !== 100) {
        return NextResponse.json(
          { error: `Nominee shares must total 100% (got ${totalPct}%)` },
          { status: 400 }
        );
      }
      // Replace any existing active nomination.
      await Nomination.updateMany(
        { tokenId, status: "active" },
        { status: "revoked" }
      );
      const record = await Nomination.create({
        tokenId,
        ulpin,
        owner: actor.walletAddress,
        nominees,
        note: note ?? "",
        status: "active",
        txHash: txHash ?? null,
      });

      await ActivityLog.create({
        clerkId: userId,
        walletAddress: actor.walletAddress,
        type: "SUCCESSION_NOMINATE",
        description: `Registered ${nominees.length} heir(s) for token ${tokenId} (${ulpin})`,
        metadata: { tokenId, ulpin, nominees, txHash },
      }).catch(() => {});

      return NextResponse.json({ success: true, nomination: record, txVerified });
    }

    // ── revoke ─────────────────────────────────────────────────────────────
    if (action === "revoke") {
      if (!isOwner) {
        return NextResponse.json(
          { error: "Forbidden — only the owner can revoke a nomination" },
          { status: 403 }
        );
      }
      const record = await Nomination.findOneAndUpdate(
        { tokenId, status: "active" },
        { status: "revoked" },
        { new: true }
      );
      if (!record) {
        return NextResponse.json({ error: "No active nomination to revoke" }, { status: 404 });
      }
      return NextResponse.json({ success: true, nomination: record, txVerified });
    }

    // ── execute (governance only) ───────────────────────────────────────────
    if (!(await hasAnyRole(userId, ["ORACLE", "SUPER_ADMIN"]))) {
      return NextResponse.json(
        { error: "Forbidden — executing a succession requires ORACLE authority" },
        { status: 403 }
      );
    }
    if (!executeTo) {
      return NextResponse.json(
        { error: "executeTo (heir wallet) is required" },
        { status: 400 }
      );
    }
    const nomination = await Nomination.findOne({ tokenId, status: "active" });
    if (!nomination) {
      return NextResponse.json({ error: "No active nomination to execute" }, { status: 404 });
    }
    const heir = nomination.nominees.find(
      (n: { wallet: string }) => n.wallet.toLowerCase() === executeTo.toLowerCase()
    );
    if (!heir) {
      return NextResponse.json(
        { error: "executeTo must be one of the registered nominee wallets" },
        { status: 400 }
      );
    }

    // Reassign ownership in the registry (PoC simulation of probate transfer).
    const previousOwner = property.walletAddress;
    property.walletAddress = executeTo.toLowerCase();
    await property.save();

    nomination.status = "executed";
    nomination.executedTo = executeTo.toLowerCase();
    nomination.executedBy = actor.walletAddress;
    nomination.executedAt = new Date();
    nomination.txHash = txHash ?? nomination.txHash;
    await nomination.save();

    await ActivityLog.create({
      clerkId: userId,
      walletAddress: actor.walletAddress,
      type: "SUCCESSION_EXECUTE",
      description: `Succession executed on token ${tokenId} (${ulpin}): ${previousOwner} → ${executeTo}`,
      metadata: { tokenId, ulpin, from: previousOwner, to: executeTo, txHash },
    }).catch(() => {});

    return NextResponse.json({ success: true, nomination, txVerified });
  } catch (err) {
    console.error("succession error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
