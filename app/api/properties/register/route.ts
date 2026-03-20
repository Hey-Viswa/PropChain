import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { KYCRecord } from "@/lib/db/models/KYC";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, ulpin, physicalAddress,
            areaSqFt, propertyType, description, documentUrl } = body;

    if (!walletAddress || !ulpin || !physicalAddress || !areaSqFt) {
      return NextResponse.json(
        { error: "Required fields missing" }, { status: 400 }
      );
    }

    await connectDB();

    // Verify KYC
    const kyc = await KYCRecord.findOne({
      walletAddress: walletAddress.toLowerCase(),
      kycVerified: true,
    });
    if (!kyc) {
      return NextResponse.json(
        { error: "KYC not verified" }, { status: 403 }
      );
    }

    // Check ULPIN uniqueness in MongoDB
    const existing = await PropertyRecord.findOne({ ulpin });
    if (existing) {
      return NextResponse.json(
        { error: "ULPIN already registered" }, { status: 409 }
      );
    }

    // Save pending record
    const record = await PropertyRecord.create({
      walletAddress: walletAddress.toLowerCase(),
      ulpin,
      physicalAddress,
      areaSqFt: Number(areaSqFt),
      propertyType,
      description: description ?? "",
      documentUrl:  documentUrl ?? "",
      status: "pending",
    });

    return NextResponse.json({ success: true, id: record._id });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}