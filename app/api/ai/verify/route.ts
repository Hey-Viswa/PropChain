import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { ActivityLog } from "@/lib/db/models/ActivityLog";
import { aiVerifySchema } from "@/lib/validations";
import { verifyDocument } from "@/lib/services/aiService";

/**
 * POST /api/ai/verify
 * Runs the free AI verification pipeline (heuristic extraction + fraud rules +
 * confidence score) over provided OCR text (or a document URL for server OCR).
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = aiVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { text, documentUrl, formUlpin, formArea, kycName } = parsed.data;

    if (!text && !documentUrl) {
      return NextResponse.json(
        { error: "Provide either `text` or `documentUrl`" },
        { status: 400 }
      );
    }

    await connectDB();

    // Pull already-registered ULPINs for duplicate detection.
    const registered = await PropertyRecord.find({ tokenId: { $ne: null } })
      .select("ulpin")
      .lean();
    const existingUlpins = registered
      .map((r: { ulpin?: string }) => r.ulpin)
      .filter((u): u is string => !!u && u !== formUlpin);

    const result = await verifyDocument(
      { text, url: documentUrl },
      { existingUlpins, formUlpin, formArea, kycName }
    );

    await ActivityLog.create({
      clerkId: userId,
      type: "AI_SCAN",
      description: `AI verify: score=${result.overallScore} decision=${result.decision} flags=${result.fraudFlags.length}`,
      metadata: { fields: result.fields, decision: result.decision },
      flagged: result.fraudFlags.some((f) => f.severity === "high"),
      flagReason: result.fraudFlags.map((f) => f.code).join(","),
    }).catch(() => {});

    return NextResponse.json(result);
  } catch (err) {
    console.error("ai verify error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
