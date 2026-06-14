import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { Encumbrance } from "@/lib/db/models/Encumbrance";
import { Dispute } from "@/lib/db/models/Dispute";

/**
 * GET /api/analytics/public
 * Public, no-auth aggregate stats for the registry dashboard.
 */
export async function GET() {
  try {
    await connectDB();

    const [byStatus, total, minted, activeLiens, openDisputes, byType] =
      await Promise.all([
        PropertyRecord.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        PropertyRecord.countDocuments({}),
        PropertyRecord.countDocuments({ tokenId: { $ne: null } }),
        Encumbrance.countDocuments({ status: "active" }),
        Dispute.countDocuments({ status: "open" }),
        PropertyRecord.aggregate([
          { $group: { _id: "$propertyType", count: { $sum: 1 } } },
        ]),
      ]);

    const statusCounts: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    for (const s of byStatus) {
      if (s._id) statusCounts[s._id] = s.count;
    }

    const typeCounts: Record<string, number> = {};
    for (const t of byType) {
      if (t._id) typeCounts[t._id] = t.count;
    }

    return NextResponse.json({
      totalProperties: total,
      minted,
      ...statusCounts,
      activeLiens,
      openDisputes,
      byType: typeCounts,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("public analytics error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
