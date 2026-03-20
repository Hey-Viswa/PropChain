import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";

export async function GET() {
  await connectDB();
  const pending = await PropertyRecord.find({ status: "pending" })
    .sort({ createdAt: -1 });
  return NextResponse.json({ properties: pending });
}
