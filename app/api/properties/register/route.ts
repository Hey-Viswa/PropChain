import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";
import { KYCService } from "@/lib/services/KYCService";
import { User } from "@/lib/db/models/User";
import { headers } from "next/headers";
import { createPropertyWithLogCompensating } from "@/lib/db/transactions";
import { rateLimit } from "@/lib/rateLimit";

const registerPropertySchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  ulpin: z.string().regex(/^[A-Z]{2}\d{10}$/, "Invalid ULPIN format"),
  physicalAddress: z.string().min(10).max(300),
  areaSqFt: z.coerce.number().positive(),
  propertyType: z.enum(["Residential", "Commercial", "Agricultural"]),
  description: z.string().max(1000).optional(),
  documentUrl: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized — not signed in" },
        { status: 401 }
      );
    }

    const { allowed, resetIn } = rateLimit(userId, 10);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, {
        status: 429,
        headers: { 'Retry-After': resetIn.toString() }
      });
    }

    const parsed = registerPropertySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const {
      walletAddress,
      ulpin,
      physicalAddress,
      areaSqFt,
      propertyType,
      description,
      documentUrl,
    } = parsed.data;

    await connectDB();
    const normalizedWallet = walletAddress.toLowerCase();
    const normalizedUlpin = ulpin.toUpperCase();

    const user = await User.findOne({ clerkId: userId }).select("walletAddress");
    if (!user?.walletAddress) {
      return NextResponse.json(
        { error: "No wallet linked to this account" },
        { status: 403 }
      );
    }
    if (user.walletAddress.toLowerCase() !== normalizedWallet) {
      return NextResponse.json(
        { error: "Wallet does not match signed-in user" },
        { status: 403 }
      );
    }

    const isVerified = await KYCService.isVerified(userId);
    if (!isVerified) {
      return NextResponse.json(
        { error: "KYC required" },
        { status: 403 }
      );
    }

    const existing = await PropertyRecord.findOne({ ulpin: normalizedUlpin }).select("_id");
    if (existing) {
      return NextResponse.json(
        { error: "ULPIN already registered" },
        { status: 409 }
      );
    }

    // IP for audit log
    let ipAddress = "unknown";
    try {
      const hdrs = await headers();
      ipAddress = hdrs.get("x-forwarded-for") ?? hdrs.get("x-real-ip") ?? "unknown";
    } catch {}

    const record = await createPropertyWithLogCompensating(
      {
        walletAddress: normalizedWallet,
        ulpin: normalizedUlpin,
        physicalAddress,
        areaSqFt: Number(areaSqFt),
        propertyType,
        description: description ?? "",
        documentUrl: documentUrl ?? "",
        status: "pending",
        mintStatus: "idle",
      },
      {
        clerkId: userId,
        walletAddress: normalizedWallet,
        type: "PROPERTY_REGISTER",
        description: `Property registration submitted: ${normalizedUlpin}`,
        ipAddress,
        metadata: {
          ulpin: normalizedUlpin,
          address: physicalAddress,
          area: Number(areaSqFt),
          propertyType,
        },
      }
    );

    return NextResponse.json({
      success: true,
      id: record._id,
      ulpin: record.ulpin,
      mintStatus: record.mintStatus,
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
