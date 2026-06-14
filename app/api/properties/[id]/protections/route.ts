import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Encumbrance } from "@/lib/db/models/Encumbrance";
import { Dispute } from "@/lib/db/models/Dispute";

/**
 * GET /api/properties/[id]/protections
 * Returns the active lien + open dispute (if any) for a token id.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tokenId = Number(id);
  if (!Number.isInteger(tokenId) || tokenId < 0) {
    return NextResponse.json({ error: "Invalid token id" }, { status: 400 });
  }
  try {
    await connectDB();
    const [encumbrance, dispute] = await Promise.all([
      Encumbrance.findOne({ tokenId, status: "active" }).lean(),
      Dispute.findOne({ tokenId, status: "open" }).lean(),
    ]);
    return NextResponse.json({ tokenId, encumbrance, dispute });
  } catch (err) {
    console.error("protections error:", err);
    return NextResponse.json({ tokenId, encumbrance: null, dispute: null });
  }
}
