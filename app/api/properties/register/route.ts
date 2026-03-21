import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { KYCRecord } from "@/lib/db/models/KYC";
import { User } from "@/lib/db/models/User";
import { logActivity } from "@/lib/logActivity";

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
    const normalizedWallet = walletAddress.toLowerCase();

    // Verify KYC
    const kyc = await KYCRecord.findOne({
      walletAddress: normalizedWallet,
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
      walletAddress: normalizedWallet,
      ulpin,
      physicalAddress,
      areaSqFt: Number(areaSqFt),
      propertyType,
      description: description ?? "",
      documentUrl:  documentUrl ?? "",
      status: "pending",
    });

    const linkedUser = await User.findOne({
      walletAddress: normalizedWallet,
    }).select("clerkId");

    await logActivity({
      clerkId: linkedUser?.clerkId ?? `wallet:${normalizedWallet}`,
      walletAddress: normalizedWallet,
      type: "PROPERTY_REGISTER",
      description: `Property registration submitted: ${ulpin}`,
      metadata: {
        ulpin,
        address: physicalAddress,
        area: Number(areaSqFt),
      },
    });

    return NextResponse.json({ success: true, id: record._id });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}