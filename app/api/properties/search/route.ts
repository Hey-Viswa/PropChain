import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { searchQuerySchema } from "@/lib/validations";

/**
 * GET /api/properties/search
 * Public registry search by ULPIN / address (q), status, or owner wallet.
 * Returns only public, on-chain-backed fields.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = searchQuerySchema.safeParse({
      q: url.searchParams.get("q") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      owner: url.searchParams.get("owner") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { q, status, owner, limit } = parsed.data;

    await connectDB();

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (owner) filter.walletAddress = owner.toLowerCase();
    if (q) {
      const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { ulpin: { $regex: safe, $options: "i" } },
        { physicalAddress: { $regex: safe, $options: "i" } },
      ];
    }

    const results = await PropertyRecord.find(filter)
      .select(
        "tokenId ulpin physicalAddress propertyType areaSqFt status walletAddress createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(limit ?? 50)
      .lean();

    return NextResponse.json({ count: results.length, results });
  } catch (err) {
    console.error("search error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
