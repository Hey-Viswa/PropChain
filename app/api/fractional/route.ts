import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { PropertyRecord } from "@/lib/db/models/Property";
import { Fractionalization } from "@/lib/db/models/Fractionalization";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { fractionalSchema } from "@/lib/validations";
import { verifyTxReceipt } from "@/lib/services/txVerify";
import { hasAnyRole } from "@/lib/auth/roles";

/**
 * GET /api/fractional?tokenId=123
 * Returns the active fractionalization record for a token (or null).
 */
export async function GET(req: NextRequest) {
  const tokenId = Number(req.nextUrl.searchParams.get("tokenId"));
  if (!Number.isInteger(tokenId) || tokenId < 0) {
    return NextResponse.json({ error: "Invalid token id" }, { status: 400 });
  }
  try {
    await connectDB();
    const record = await Fractionalization.findOne({
      tokenId,
      status: "active",
    }).lean();
    return NextResponse.json({ tokenId, fractionalization: record ?? null });
  } catch (err) {
    console.error("fractional GET error:", err);
    return NextResponse.json({ tokenId, fractionalization: null });
  }
}

/**
 * POST /api/fractional  { action: "fractionalize" | "redeem", tokenId, ulpin, ... }
 * Mirrors the on-chain FractionalOwnership vault state into MongoDB. The
 * property owner (or an ORACLE/SUPER_ADMIN) may fractionalize or redeem.
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

    const parsed = fractionalSchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { action, tokenId, ulpin, totalShares, shareName, shareSymbol, vaultAddress, txHash } =
      parsed.data;

    const property = await PropertyRecord.findOne({ tokenId });
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Only the on-chain owner (or governance) may change the vault state.
    const isOwner =
      property.walletAddress?.toLowerCase() === actor.walletAddress.toLowerCase();
    const isGov = await hasAnyRole(userId, ["ORACLE", "SUPER_ADMIN"]);
    if (!isOwner && !isGov) {
      return NextResponse.json(
        { error: "Forbidden — only the property owner can fractionalize it" },
        { status: 403 }
      );
    }
    if (property.status !== "approved") {
      return NextResponse.json(
        { error: "Property must be approved by an oracle before fractionalizing" },
        { status: 409 }
      );
    }

    const txVerified = txHash ? await verifyTxReceipt(txHash) : null;

    if (action === "fractionalize") {
      if (!totalShares || !shareName || !shareSymbol) {
        return NextResponse.json(
          { error: "totalShares, shareName and shareSymbol are required" },
          { status: 400 }
        );
      }
      const existing = await Fractionalization.findOne({ tokenId, status: "active" });
      if (existing) {
        return NextResponse.json(
          { error: "This property is already fractionalized" },
          { status: 409 }
        );
      }
      const record = await Fractionalization.create({
        tokenId,
        ulpin,
        owner: actor.walletAddress,
        vaultAddress: vaultAddress ?? null,
        shareName,
        shareSymbol,
        totalShares,
        status: "active",
        txHashFractionalize: txHash ?? null,
      });

      await ActivityLog.create({
        clerkId: userId,
        walletAddress: actor.walletAddress,
        type: "FRACTIONALIZE",
        description: `Property ${tokenId} (${ulpin}) split into ${totalShares} ${shareSymbol} shares`,
        metadata: { tokenId, ulpin, totalShares, shareSymbol, vaultAddress, txHash },
      }).catch(() => {});

      return NextResponse.json({ success: true, fractionalization: record, txVerified });
    }

    // action === "redeem"
    const record = await Fractionalization.findOneAndUpdate(
      { tokenId, status: "active" },
      { status: "redeemed", redeemedAt: new Date(), txHashRedeem: txHash ?? null },
      { new: true }
    );
    if (!record) {
      return NextResponse.json(
        { error: "No active fractionalization to redeem" },
        { status: 404 }
      );
    }

    await ActivityLog.create({
      clerkId: userId,
      walletAddress: actor.walletAddress,
      type: "FRACTIONAL_REDEEM",
      description: `Property ${tokenId} (${ulpin}) shares redeemed; NFT reassembled`,
      metadata: { tokenId, ulpin, txHash },
    }).catch(() => {});

    return NextResponse.json({ success: true, fractionalization: record, txVerified });
  } catch (err) {
    console.error("fractional error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
