"use client";
import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Trash2,
  Plus,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Database,
  Key,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const DEV_PASSWORD_KEY = "propchain_dev_auth";

interface RoleEntry {
  _id: string;
  clerkId: string;
  role: string;
  assignedAt: string;
  note: string;
}

const ROLE_COLORS: Record<string, string> = {
  ORACLE: "bg-primary_fixed text-primary",
  BANK: "bg-secondary_fixed text-secondary",
  SUPER_ADMIN: "bg-error_container text-error",
};

export default function DevAdminPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [roles, setRoles] = useState<RoleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [newClerkId, setNewClerkId] = useState("");
  const [newRole, setNewRole] = useState<"ORACLE" | "BANK" | "SUPER_ADMIN">("ORACLE");
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check if already authed in session
  useEffect(() => {
    const saved = sessionStorage.getItem(DEV_PASSWORD_KEY);
    if (saved) {
      setAuthed(true);
      fetchRoles(saved);
    }
  }, []);

  const handleAuth = () => {
    if (!password) return;
    setPwdError("");
    // Store in session (not localStorage - cleared on tab close)
    sessionStorage.setItem(DEV_PASSWORD_KEY, password);
    setAuthed(true);
    fetchRoles(password);
  };

  const fetchRoles = async (pwd?: string) => {
    const p = pwd ?? sessionStorage.getItem(DEV_PASSWORD_KEY) ?? "";
    setLoading(true);
    try {
      const res = await fetch("/api/dev/roles", {
        headers: { "x-dev-admin-password": p },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(DEV_PASSWORD_KEY);
        setAuthed(false);
        setPwdError("Incorrect password");
        return;
      }
      const data = await res.json();
      setRoles(data.roles ?? []);
    } catch {
      toast({
        title: "Error",
        description: "Could not fetch roles from database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!newClerkId.trim()) return;
    setSubmitting(true);
    const p = sessionStorage.getItem(DEV_PASSWORD_KEY) ?? "";
    try {
      const res = await fetch("/api/dev/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-dev-admin-password": p,
        },
        body: JSON.stringify({
          clerkId: newClerkId.trim(),
          role: newRole,
          note: newNote.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Role assigned",
        description: `${newRole} role given to ${newClerkId.slice(0, 12)}...`,
      });
      setNewClerkId("");
      setNewNote("");
      fetchRoles();
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (clerkId: string, role: string) => {
    const p = sessionStorage.getItem(DEV_PASSWORD_KEY) ?? "";
    try {
      await fetch("/api/dev/roles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-dev-admin-password": p,
        },
        body: JSON.stringify({ clerkId, role }),
      });
      toast({
        title: "Role revoked",
        description: `${role} removed from ${clerkId.slice(0, 12)}...`,
      });
      fetchRoles();
    } catch {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not revoke role.",
      });
    }
  };

  const copyCurrentUserId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    toast({
      title: "Copied",
      description: "Your Clerk user ID copied.",
    });
  };

  // Block in production
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on_surface_variant">Not found.</p>
      </div>
    );
  }

  // Password gate
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-[#161b27] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
            <div className="h-1 bg-gradient-to-r from-primary to-primary_container" />
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a2d4d] flex items-center justify-center">
                  <Key className="w-5 h-5 text-[#6b9eff]" />
                </div>
                <div>
                  <h1 className="text-title-md font-bold text-[#e8eaf0]">Dev Admin Panel</h1>
                  <p className="text-label-sm text-[#9ba3b8]">PropChain role management</p>
                </div>
              </div>

              {/* Warning banner */}
              <div className="flex items-start gap-2.5 p-3 bg-[#2d0a0a] rounded-xl">
                <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                <p className="text-label-sm text-error/80">
                  Development only. This panel does not exist in production.
                </p>
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <label className="text-label-sm font-medium text-[#9ba3b8]">Admin Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPwdError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAuth();
                    }}
                    placeholder="Enter dev admin password"
                    className="w-full bg-[#1c2333] rounded-lg px-4 py-3 pr-12 text-[#e8eaf0] border-0 border-b-2 border-[#2a3347] focus:border-[#6b9eff] focus:outline-none font-mono text-sm placeholder:text-[#9ba3b8]/40 transition-colors"
                  />
                  <button
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba3b8] p-1"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pwdError && <p className="text-label-sm text-error">{pwdError}</p>}
              </div>

              <button
                onClick={handleAuth}
                disabled={!password}
                className="w-full bg-primary text-white rounded-md py-2.5 text-body-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enter Admin Panel
              </button>
            </div>
          </div>

          {/* Env hint */}
          <p className="text-center text-[10px] text-[#6b7280] mt-4">
            Password set in DEV_ADMIN_PASSWORD in .env.local
          </p>
        </div>
      </div>
    );
  }

  // Main Admin Panel
  return (
    <div className="min-h-screen bg-[#0f1117] p-6 xl:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-headline-md font-bold text-[#e8eaf0]">Dev Admin Panel</h1>
            <p className="text-body-md text-[#9ba3b8] mt-1">Assign and manage user roles in PropChain</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-label-sm font-medium text-[#6b9eff] bg-[#1a2d4d] rounded-full px-3 py-1">
              DEV MODE
            </span>
            <button
              onClick={() => fetchRoles()}
              disabled={loading}
              className="p-2 rounded-lg bg-[#1c2333] text-[#9ba3b8] hover:text-[#e8eaf0] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Your User ID card */}
        <div className="bg-[#161b27] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]" />
          <div className="p-5 xl:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#1c2a4a] flex items-center justify-center">
                <Database className="w-4 h-4 text-[#6b9eff]" />
              </div>
              <p className="text-title-md font-semibold text-[#e8eaf0]">Your Clerk User ID</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#1c2333] rounded-xl">
              <code className="text-sm font-mono text-[#6b9eff] flex-1 truncate">
                {user?.id ?? "Not signed in"}
              </code>
              <button
                onClick={copyCurrentUserId}
                className="p-1.5 rounded-md hover:bg-[#222b3d] text-[#9ba3b8] transition-colors flex-shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-label-sm text-[#9ba3b8] mt-2">
              Copy this ID and paste it below to assign yourself a role.
            </p>
          </div>
        </div>

        {/* Assign Role Card */}
        <div className="bg-[#161b27] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary to-primary_container" />
          <div className="p-5 xl:p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#1a2d4d] flex items-center justify-center">
                <Plus className="w-4 h-4 text-[#6b9eff]" />
              </div>
              <p className="text-title-md font-semibold text-[#e8eaf0]">Assign Role</p>
            </div>

            {/* Clerk ID input */}
            <div className="space-y-1.5">
              <label className="text-label-sm font-medium text-[#9ba3b8]">Clerk User ID</label>
              <input
                type="text"
                value={newClerkId}
                onChange={(e) => setNewClerkId(e.target.value)}
                placeholder="user_2abc123xyz..."
                className="w-full bg-[#1c2333] rounded-lg px-4 py-3 text-[#e8eaf0] border-0 border-b-2 border-[#2a3347] focus:border-[#6b9eff] focus:outline-none font-mono text-sm placeholder:text-[#9ba3b8]/40 transition-colors"
              />
              {newClerkId && !newClerkId.startsWith("user_") && (
                <p className="text-label-sm text-error">Must start with user_</p>
              )}
            </div>

            {/* Role selector */}
            <div className="space-y-1.5">
              <label className="text-label-sm font-medium text-[#9ba3b8]">Role</label>
              <div className="flex gap-2">
                {(["ORACLE", "BANK", "SUPER_ADMIN"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setNewRole(r)}
                    className={`flex-1 py-2 px-3 rounded-lg text-label-sm font-medium transition-all ${
                      newRole === r
                        ? r === "ORACLE"
                          ? "bg-[#1a2d4d] text-[#6b9eff] ring-1 ring-[#6b9eff]/40"
                          : r === "BANK"
                          ? "bg-[#2a1a00] text-[#ffddb4] ring-1 ring-[#835500]/40"
                          : "bg-[#2d0a0a] text-error ring-1 ring-error/40"
                        : "bg-[#1c2333] text-[#9ba3b8] hover:bg-[#222b3d]"
                    }`}
                  >
                    {r === "SUPER_ADMIN" ? "SUPER ADMIN" : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Note input */}
            <div className="space-y-1.5">
              <label className="text-label-sm font-medium text-[#9ba3b8]">
                Note
                <span className="text-[#9ba3b8]/50 ml-1">(optional)</span>
              </label>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Main oracle account"
                className="w-full bg-[#1c2333] rounded-lg px-4 py-3 text-[#e8eaf0] border-0 border-b-2 border-[#2a3347] focus:border-[#6b9eff] focus:outline-none text-sm placeholder:text-[#9ba3b8]/40 transition-colors"
              />
            </div>

            <button
              onClick={handleAssign}
              disabled={!newClerkId.trim() || !newClerkId.startsWith("user_") || submitting}
              className="w-full bg-primary text-white rounded-md py-2.5 text-body-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Assigning..." : `Assign ${newRole} Role`}
            </button>
          </div>
        </div>

        {/* Current Roles Card */}
        <div className="bg-[#161b27] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-success to-success/50" />
          <div className="p-5 xl:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0a2e1a] flex items-center justify-center">
                  <Users className="w-4 h-4 text-success" />
                </div>
                <p className="text-title-md font-semibold text-[#e8eaf0]">Assigned Roles</p>
              </div>
              <span className="rounded-full px-2.5 py-1 text-label-sm font-medium bg-[#0a2e1a] text-success">
                {roles.length} active
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-16 bg-[#1c2333] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : roles.length === 0 ? (
              <div className="py-10 text-center bg-[#1c2333] rounded-xl border-2 border-dashed border-[#2a3347]">
                <Shield className="w-8 h-8 text-[#9ba3b8]/30 mx-auto mb-2" />
                <p className="text-body-md text-[#9ba3b8]">No roles assigned yet</p>
                <p className="text-label-sm text-[#9ba3b8]/60 mt-1">
                  Use the form above to assign your first role
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {roles.map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between p-4 bg-[#1c2333] rounded-xl hover:bg-[#222b3d] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-success flex-shrink-0 ring-4 ring-success/20" />
                      <div className="min-w-0">
                        <code className="text-sm font-mono text-[#e8eaf0] truncate block">{r.clerkId}</code>
                        {r.note && <p className="text-[10px] text-[#9ba3b8] mt-0.5">{r.note}</p>}
                        <p className="text-[10px] text-[#9ba3b8]/60 mt-0.5">
                          {new Date(r.assignedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-label-sm font-bold ${
                          ROLE_COLORS[r.role] ?? "bg-[#1c2333] text-[#9ba3b8]"
                        }`}
                      >
                        {r.role}
                      </span>
                      <button
                        onClick={() => handleRevoke(r.clerkId, r.role)}
                        className="p-1.5 rounded-lg text-[#9ba3b8] hover:text-error hover:bg-[#2d0a0a] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#6b7280] pb-4">
          This panel only exists in development. All role data is stored in MongoDB. Changes take effect immediately.
        </p>
      </div>
    </div>
  );
}
