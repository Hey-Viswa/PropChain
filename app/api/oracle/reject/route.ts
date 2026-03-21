import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { User } from "@/lib/db/models/User";
import { verifyOracleRole } from "@/lib/auth/verifyOracleRole";

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

    const { recordId, reason } = await req.json();
    if (!recordId) {
      return NextResponse.json(
        { error: "recordId is required" },
        { status: 400 }
      );
    }

    const updated = await PropertyRecord.findByIdAndUpdate(
      recordId,
      {
        status: "rejected",
        rejectedBy: user.walletAddress,
        rejectedAt: new Date(),
        rejectReason: reason ?? "No reason provided",
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Property record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Oracle reject error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
