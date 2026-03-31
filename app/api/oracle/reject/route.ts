import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { User } from "@/lib/db/models/User";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { verifyOracleRole, publicClient } from "@/lib/auth/verifyOracleRole";

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

    const { recordId, reason, txHash } = await req.json();
    if (!recordId) {
      return NextResponse.json(
        { error: "recordId is required" },
        { status: 400 }
      );
    }
    if (!txHash) {
      return NextResponse.json(
        { error: "txHash is required" },
        { status: 400 }
      );
    }

    // IDEMPOTENCY CHECK
    const existing = await PropertyRecord.findById(recordId);
    if (!existing) {
      return NextResponse.json(
        { error: "Property record not found" },
        { status: 404 }
      );
    }
    if (existing.status === "rejected" || existing.status === "REJECTED") {
      return NextResponse.json({ message: "Already rejected" }, { status: 200 });
    }

    // WAIT FOR RECEIPT
    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
        confirmations: 1,
        timeout: 30_000,
      });

      if (receipt.status !== "success") {
        return NextResponse.json(
          { error: "Transaction reverted on-chain" },
          { status: 500 }
        );
      }
    } catch (receiptError) {
      console.error("Receipt verification error:", receiptError);
      return NextResponse.json(
        { error: "Failed to verify transaction receipt" },
        { status: 500 }
      );
    }

    // AFTER RECEIPT VERIFICATION: Update MongoDB
    const updated = await PropertyRecord.findByIdAndUpdate(
      recordId,
      {
        status: "rejected",
        rejectedBy: user.walletAddress,
        oracleTxHash: txHash,
        rejectedAt: new Date(),
        rejectReason: reason ?? "No reason provided",
      },
      { new: true }
    );

    // AUDIT LOG
    await ActivityLog.create({
      clerkId: userId,
      type: "ORACLE_REJECT",
      description: `Property ${recordId} rejected by oracle ${user.walletAddress}. TxHash: ${txHash}`,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Oracle reject error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
