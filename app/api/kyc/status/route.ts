import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { KYC } from "@/lib/db/models/KYC";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { verified: false }
      );
    }

    await connectDB();

    const kycRecord = await KYC.findOne(
      { clerkId: userId }
    ).select("verified verifiedAt aadhaarLast4 walletAddress");

    return NextResponse.json({
      verified:      kycRecord?.verified ?? false,
      verifiedAt:    kycRecord?.verifiedAt ?? null,
      aadhaarLast4:  kycRecord?.aadhaarLast4 ?? null,
      walletAddress: kycRecord?.walletAddress ?? null,
    });
  } catch (err) {
    console.error("KYC status error:", err);
    return NextResponse.json({ verified: false });
  }
}