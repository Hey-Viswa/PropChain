import { NextRequest, NextResponse } from "next/server";
import { getPropertyHistory } from "@/lib/services/historyService";

/**
 * GET /api/properties/[id]/history
 * On-chain event timeline for a token id (registry, ownership, encumbrance,
 * dispute). Reads chain logs directly via viem (free; no The Graph).
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
    const events = await getPropertyHistory(tokenId);
    return NextResponse.json({ tokenId, count: events.length, events });
  } catch (err) {
    // RPC unavailable / misconfigured — return an empty timeline rather than 500.
    console.error("history error:", err);
    return NextResponse.json({
      tokenId,
      count: 0,
      events: [],
      note: "On-chain history unavailable (check BLOCKCHAIN_RPC_URL and contract addresses).",
    });
  }
}
