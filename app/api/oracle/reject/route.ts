import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { PropertyRecord } from "@/lib/db/models/Property";

export async function POST(req: NextRequest) {
  try {
    const { recordId, reason } = await req.json();
    await connectDB();
    await PropertyRecord.findByIdAndUpdate(recordId, {
      status: "rejected",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
