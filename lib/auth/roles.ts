import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { AdminRole } from "@/lib/db/models/AdminRole";

export type AppRole = "USER" | "BANK" | "ORACLE" | "SUPER_ADMIN";

/**
 * Resolve the effective role set for a Clerk user.
 *
 * The app has two role stores: the legacy `User.role` field and the
 * authoritative `AdminRole` collection that the dev-admin panel writes to and
 * that `useAdminRole()` / `/api/user/roles` read from. Nothing ever writes
 * `User.role` (it stays "USER"), so endpoints that gate on it alone would
 * always 403. Always resolve roles through this helper so both stores agree.
 */
export async function getEffectiveRoles(clerkId: string): Promise<Set<AppRole>> {
  await connectDB();
  const [user, adminRoles] = await Promise.all([
    User.findOne({ clerkId }).select("role"),
    AdminRole.find({ clerkId, active: true }).select("role"),
  ]);

  const roles = new Set<AppRole>(["USER"]);
  if (user?.role && user.role !== "USER") roles.add(user.role as AppRole);
  for (const r of adminRoles) roles.add(r.role as AppRole);
  return roles;
}

/** True when the user holds at least one of the `allowed` roles. */
export async function hasAnyRole(
  clerkId: string,
  allowed: AppRole[]
): Promise<boolean> {
  const roles = await getEffectiveRoles(clerkId);
  return allowed.some((r) => roles.has(r));
}
