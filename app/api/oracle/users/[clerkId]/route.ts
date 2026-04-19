import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { User } from "@/lib/db/models/User";
import { verifyOracleRole } from "@/lib/auth/verifyOracleRole";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const oracle = await User.findOne({ clerkId: userId });
    const isOracle = oracle?.walletAddress
      ? await verifyOracleRole(oracle.walletAddress)
      : false;

    if (!isOracle) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { clerkId } = await params;

    const userData = await User.findOne({ clerkId }).lean();

    const logs = await ActivityLog.find({ clerkId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const stats = await ActivityLog.aggregate([
      { $match: { clerkId } },
      {
        $group: {
          _id: null,
          totalActions: { $sum: 1 },
          flaggedCount: {
            $sum: { $cond: ["$flagged", 1, 0] },
          },
          firstSeen: { $min: "$createdAt" },
          lastSeen: { $max: "$createdAt" },
          actionBreakdown: {
            $push: "$type",
          },
        },
      },
    ]);

    return NextResponse.json({
      user: userData,
      logs,
      stats:
        stats[0] ?? {
          totalActions: 0,
          flaggedCount: 0,
        },
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
