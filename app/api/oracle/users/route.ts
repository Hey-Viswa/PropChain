import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { User } from "@/lib/db/models/User";
import { verifyOracleRole } from "@/lib/auth/verifyOracleRole";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    const isOracle = user?.walletAddress
      ? await verifyOracleRole(user.walletAddress)
      : false;

    if (!isOracle) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search") ?? "";
    const filter = url.searchParams.get("filter") ?? "all";
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = 20;

    const pipeline: any[] = [
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$clerkId",
          walletAddress: { $first: "$walletAddress" },
          lastActive: { $first: "$createdAt" },
          totalActions: { $sum: 1 },
          flaggedCount: {
            $sum: { $cond: ["$flagged", 1, 0] },
          },
          activityTypes: {
            $addToSet: "$type",
          },
        },
      },
    ];

    if (filter === "flagged") {
      pipeline.push({
        $match: { flaggedCount: { $gt: 0 } },
      });
    }

    if (filter === "active") {
      pipeline.push({
        $match: { lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      });
    }

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { _id: { $regex: search, $options: "i" } },
            { walletAddress: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { lastActive: -1 } },
      { $skip: (Math.max(page, 1) - 1) * limit },
      { $limit: limit }
    );

    const users = await ActivityLog.aggregate(pipeline);

    const enriched = await Promise.all(
      users.map(async (u) => {
        const userData = await User.findOne({ clerkId: u._id })
          .select("email role createdAt")
          .lean();
        return {
          ...u,
          userData: {
            name: userData?.email?.split("@")[0] ?? "",
            email: userData?.email,
            kycVerified: userData?.role !== "USER",
          },
        };
      })
    );

    return NextResponse.json({
      users: enriched,
      page,
      hasMore: users.length === limit,
    });
  } catch (err) {
    console.error("Oracle users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
