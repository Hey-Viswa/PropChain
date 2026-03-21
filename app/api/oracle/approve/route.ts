import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { User } from "@/lib/db/models/User";
import { verifyOracleRole } from "@/lib/auth/verifyOracleRole";
import { logActivity } from "@/lib/logActivity";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized — not signed in" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user?.walletAddress) {
      return NextResponse.json(
        { error: "No wallet linked to this account" },
        { status: 403 }
      );
    }

    const isOracle = await verifyOracleRole(user.walletAddress);
    if (!isOracle) {
      return NextResponse.json(
        { error: "Forbidden — wallet does not have ORACLE_ROLE" },
        { status: 403 }
      );
    }

    const { recordId } = await req.json();
    if (!recordId) {
      return NextResponse.json(
        { error: "recordId is required" },
        { status: 400 }
      );
    }

    const updated = await PropertyRecord.findByIdAndUpdate(
      recordId,
      {
        status: "approved",
        approvedBy: user.walletAddress,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Property record not found" },
        { status: 404 }
      );
    }

    const targetWallet = updated.walletAddress ?? "";
    const targetUser = targetWallet
      ? await User.findOne({ walletAddress: targetWallet.toLowerCase() }).select("clerkId")
      : null;

    await logActivity({
      clerkId: targetUser?.clerkId ?? `wallet:${targetWallet || "unknown"}`,
      walletAddress: targetWallet,
      type: "ORACLE_APPROVE",
      description: "Property approved by Oracle",
      metadata: {
        tokenId: updated.tokenId ?? null,
        oracleWallet: user.walletAddress,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Oracle approve error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
