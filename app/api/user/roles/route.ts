import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { AdminRole } from "@/lib/db/models/AdminRole";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ roles: [] });
  }

  await connectDB();

  const userRoles = await AdminRole.find({
    clerkId: userId,
    active: true,
  }).select("role");

  const roles = userRoles.map((r) => r.role);

  return NextResponse.json({ roles });
}
