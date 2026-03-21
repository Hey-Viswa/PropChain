import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { KYCRecord } from "@/lib/db/models/KYC";
import { User } from "@/lib/db/models/User";
import { logActivity } from "@/lib/logActivity";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, aadhaarNumber } = await req.json();

    if (!walletAddress || !aadhaarNumber) {
      return NextResponse.json(
        { error: "walletAddress and aadhaarNumber are required" },
        { status: 400 }
      );
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return NextResponse.json(
        { error: "Aadhaar must be exactly 12 digits" },
        { status: 400 }
      );
    }

    await connectDB();
    const normalizedWallet = walletAddress.toLowerCase();

    const existing = await KYCRecord.findOne({
      walletAddress: normalizedWallet,
    });

    if (existing?.kycVerified) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    await KYCRecord.findOneAndUpdate(
      { walletAddress: normalizedWallet },
      {
        aadhaarLast4: aadhaarNumber.slice(-4),
        kycVerified:  true,
        verifiedAt:   new Date(),
      },
      { upsert: true, new: true }
    );

    const linkedUser = await User.findOne({
      walletAddress: normalizedWallet,
    }).select("clerkId");

    await logActivity({
      clerkId: linkedUser?.clerkId ?? `wallet:${normalizedWallet}`,
      walletAddress: normalizedWallet,
      type: "KYC_SUBMIT",
      description: "User submitted KYC verification",
      metadata: { aadhaarMasked: "XXXX-XXXX-****" },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("KYC submit error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}