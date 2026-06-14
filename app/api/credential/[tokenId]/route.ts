import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { issueCredential, verifyCredential } from "@/lib/services/credentialService";

/**
 * GET /api/credential/[tokenId]
 * Issues a W3C Verifiable Credential (simulation) for a registered property's
 * ownership and returns it alongside a self-verification result. Public read.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId: raw } = await params;
  const tokenId = Number(raw);
  if (!Number.isInteger(tokenId) || tokenId < 0) {
    return NextResponse.json({ error: "Invalid token id" }, { status: 400 });
  }

  try {
    await connectDB();
    const property = await PropertyRecord.findOne({ tokenId }).lean<{
      tokenId: number;
      ulpin: string;
      walletAddress: string;
      physicalAddress: string;
      areaSqFt: number;
      propertyType: string;
      status: string;
      createdAt?: Date;
    } | null>();

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    if (property.status !== "approved") {
      return NextResponse.json(
        { error: "A certificate can only be issued for an oracle-approved property" },
        { status: 409 }
      );
    }

    const credential = issueCredential({
      tokenId: property.tokenId,
      ulpin: property.ulpin,
      owner: property.walletAddress,
      physicalAddress: property.physicalAddress,
      areaSqFt: property.areaSqFt,
      propertyType: property.propertyType,
      status: property.status,
      registeredAt: property.createdAt ? new Date(property.createdAt).toISOString() : null,
      chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 31337),
    });

    const verification = verifyCredential(credential);
    return NextResponse.json({ credential, verification });
  } catch (err) {
    console.error("credential error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
