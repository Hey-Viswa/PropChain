import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { AdminRole } from "@/lib/db/models/AdminRole";

// Block in production
if (process.env.NODE_ENV === "production") {
  console.warn("Dev routes blocked in production");
}

function isDev() {
  return process.env.NODE_ENV !== "production";
}

function checkDevAuth(req: NextRequest): boolean {
  const auth = req.headers.get("x-dev-admin-password");
  return auth === process.env.DEV_ADMIN_PASSWORD;
}

// GET - list all roles
export async function GET(req: NextRequest) {
  if (!isDev()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!checkDevAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const roles = await AdminRole.find({ active: true }).sort({ assignedAt: -1 });

  return NextResponse.json({ roles });
}

// POST - assign a role
export async function POST(req: NextRequest) {
  if (!isDev()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!checkDevAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clerkId, role, note } = await req.json();

  if (!clerkId || !role) {
    return NextResponse.json(
      { error: "clerkId and role are required" },
      { status: 400 }
    );
  }

  if (!clerkId.startsWith("user_")) {
    return NextResponse.json(
      { error: "Invalid Clerk user ID format. Must start with user_" },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await AdminRole.findOne({
    clerkId,
    role,
    active: true,
  });

  if (existing) {
    return NextResponse.json(
      { error: "This user already has this role" },
      { status: 409 }
    );
  }

  const newRole = await AdminRole.create({
    clerkId,
    role,
    note: note ?? "",
    assignedBy: "dev_admin",
    assignedAt: new Date(),
    active: true,
  });

  return NextResponse.json({ success: true, role: newRole }, { status: 201 });
}

// DELETE - remove a role
export async function DELETE(req: NextRequest) {
  if (!isDev()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!checkDevAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clerkId, role } = await req.json();

  await connectDB();

  await AdminRole.findOneAndUpdate({ clerkId, role }, { active: false });

  return NextResponse.json({ success: true });
}
