import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { KYCRecord } from "@/lib/db/models/KYC";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json({ error: "wallet param required" }, { status: 400 });
  }

  await connectDB();
  const record = await KYCRecord.findOne({ walletAddress: wallet.toLowerCase() });

  return NextResponse.json({
    kycVerified: record?.kycVerified ?? false,
    verifiedAt:  record?.verifiedAt ?? null,
  });
}