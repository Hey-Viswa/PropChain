import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { KYCRecord } from "@/lib/db/models/KYC";

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

    const existing = await KYCRecord.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    if (existing?.kycVerified) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    await KYCRecord.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      {
        aadhaarLast4: aadhaarNumber.slice(-4),
        kycVerified:  true,
        verifiedAt:   new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("KYC submit error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}