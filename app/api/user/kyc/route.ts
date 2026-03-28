import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { KYC } from "@/lib/db/models/KYC";
import { User } from "@/lib/db/models/User";
import { logActivity } from "@/lib/logActivity";
import { headers } from "next/headers";

// GET /api/user/kyc — return KYC status for the authenticated user
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const record = await KYC.findOne({ clerkId: userId }).lean();

    if (!record) {
      return NextResponse.json({ verified: false, submitted: false });
    }

    return NextResponse.json({
      verified:      record.verified,
      submitted:     true,
      submittedAt:   record.submittedAt,
      verifiedAt:    record.verifiedAt,
      walletAddress: record.walletAddress,
      attempts:      record.attempts,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch KYC status" }, { status: 500 });
  }
}

// POST /api/user/kyc — submit KYC data
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { aadhaarLast4?: string; walletAddress?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { aadhaarLast4, walletAddress = "" } = body;

  if (!aadhaarLast4 || !/^\d{4}$/.test(aadhaarLast4)) {
    return NextResponse.json(
      { error: "aadhaarLast4 must be exactly 4 digits" },
      { status: 422 }
    );
  }

  try {
    await connectDB();

    // Get IP for audit
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for") ??
      headersList.get("x-real-ip") ??
      "unknown";

    // Upsert KYC record (allow re-submission, increment attempts)
    const existing = await KYC.findOne({ clerkId: userId });

    if (existing) {
      existing.aadhaarLast4  = aadhaarLast4;
      existing.walletAddress = walletAddress.toLowerCase();
      existing.ipAddress     = ipAddress;
      existing.attempts      = existing.attempts + 1;
      await existing.save();
    } else {
      await KYC.create({
        clerkId: userId,
        aadhaarLast4,
        walletAddress: walletAddress.toLowerCase(),
        ipAddress,
      });

      // Ensure User record exists
      await User.findOneAndUpdate(
        { clerkId: userId },
        { $setOnInsert: { clerkId: userId, email: "", walletAddress: walletAddress.toLowerCase() || null } },
        { upsert: true }
      );
    }

    // Fire-and-forget activity log
    logActivity({
      clerkId:       userId,
      walletAddress: walletAddress.toLowerCase(),
      type:          "KYC_SUBMIT",
      description:   "KYC submission received",
    });

    return NextResponse.json({ success: true, message: "KYC submitted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to process KYC submission" }, { status: 500 });
  }
}
