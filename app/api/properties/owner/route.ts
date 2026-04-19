import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) {
    return NextResponse.json({ error: "wallet required" }, { status: 400 });
  }
  await connectDB();
  const properties = await PropertyRecord.find({
    walletAddress: wallet.toLowerCase(),
  }).sort({ createdAt: -1 });

  return NextResponse.json({ properties });
}