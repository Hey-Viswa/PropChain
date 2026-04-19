import { connectDB } from "@/lib/db/mongoose";
import { ActivityLog, ActivityType } from "@/lib/db/models/ActivityLog";
import { headers } from "next/headers";

export async function logActivity({
  clerkId,
  walletAddress = "",
  type,
  description,
  metadata = {},
  flagged = false,
  flagReason = "",
}: {
  clerkId: string;
  walletAddress?: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  flagged?: boolean;
  flagReason?: string;
}) {
  try {
    await connectDB();

    let ipAddress = "";
    try {
      const headersList = await headers();
      ipAddress =
        headersList.get("x-forwarded-for") ??
        headersList.get("x-real-ip") ??
        "unknown";
    } catch {}

    await ActivityLog.create({
      clerkId,
      walletAddress,
      type,
      description,
      metadata,
      ipAddress,
      flagged,
      flagReason,
    });
  } catch (err) {
    // Never throw - logging should not break app
    console.error("Activity log error:", err);
  }
}
