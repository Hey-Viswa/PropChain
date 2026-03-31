import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { KYC } from "@/lib/db/models/KYC";
import { logActivity } from "@/lib/logActivity";
import { headers } from "next/headers";

// Simulate OTP verification
// In Phase 1 any 6-digit OTP passes
function validateOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { aadhaarNumber, otp, walletAddress } =
      await req.json();

    // Validate Aadhaar format (12 digits)
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return NextResponse.json(
        { error: "Invalid Aadhaar number format" },
        { status: 400 }
      );
    }

    // Validate OTP (Phase 1 mock — any 6 digits)
    if (!validateOTP(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format" },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for") ?? "unknown";

    await connectDB();

    // Check if already verified
    const existing = await KYC.findOne({ clerkId: userId });
    if (existing?.verified) {
      return NextResponse.json(
        { error: "KYC already verified" },
        { status: 409 }
      );
    }

    // Store only last 4 digits of Aadhaar
    const aadhaarLast4 = aadhaarNumber.slice(-4);

    const kycRecord = await KYC.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId:       userId,
        walletAddress: walletAddress ?? "",
        aadhaarLast4,
        verified:      true,
        verifiedAt:    new Date(),
        submittedAt:   new Date(),
        ipAddress,
        $inc: { attempts: existing ? 1 : 0 },
      },
      { upsert: true, new: true }
    );

    await logActivity({
      clerkId:       userId,
      walletAddress: walletAddress ?? "",
      type:          "KYC_SUBMIT",
      description:   "User completed KYC verification",
      metadata: {
        aadhaarLast4,
        walletLinked: !!walletAddress,
      },
    });

    return NextResponse.json({
      success:    true,
      verified:   true,
      verifiedAt: kycRecord.verifiedAt,
    });
  } catch (err) {
    console.error("KYC submit error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}