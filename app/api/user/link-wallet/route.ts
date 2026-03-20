import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { walletAddress } = await req.json();
  if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  await connectDB();

  // Check wallet not already linked to another user
  const existing = await User.findOne({
    walletAddress: walletAddress.toLowerCase(),
    clerkId: { $ne: userId },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Wallet already linked to another account" },
      { status: 409 }
    );
  }

  await User.findOneAndUpdate(
    { clerkId: userId },
    { walletAddress: walletAddress.toLowerCase() },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true });
}