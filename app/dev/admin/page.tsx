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
import { clearRoleCache } from "@/hooks/useAdminRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DEV_PASSWORD_KEY = "propchain_dev_auth";

interface RoleEntry {
  _id: string;
  clerkId: string;
  role: string;
  assignedAt: string;
  note: string;
}

const ROLE_COLORS: Record<string, string> = {
  ORACLE: "bg-primary/10 text-primary border-primary/20",
  BANK: "bg-secondary/10 text-secondary border-secondary/20",
  SUPER_ADMIN: "bg-error/10 text-error border-error/20",
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
      clearRoleCache();
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
      clearRoleCache();
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

  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-[#0d0c0b]">
        <p className="text-on_surface_variant dark:text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Access Denied</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-sand dark:bg-[#0d0c0b] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Card className="rounded-[32px] overflow-hidden shadow-floating border-stone/50 dark:border-white/10 dark:bg-card">
            <div className="h-1.5 bg-primary" />
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Key className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Dev Admin</h1>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground">Internal Access Only</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-error/5 rounded-2xl border border-error/10">
                <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-error/80 leading-relaxed">
                  Development restricted environment. Unauthorized usage is cryptographically logged.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground ml-1">Admin Passcode</label>
                  <div className="relative">
                    <Input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPwdError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAuth();
                      }}
                      placeholder="••••••••"
                      className="h-12 rounded-xl"
                    />
                    <button
                      onClick={() => setShowPwd((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on_surface_variant hover:text-primary p-1 transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pwdError && <p className="text-xs font-bold text-error ml-1">{pwdError}</p>}
                </div>

                <Button
                  onClick={handleAuth}
                  disabled={!password}
                  className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg"
                >
                  Authorize Session
                </Button>
              </div>
            </div>
          </Card>
          <p className="text-center text-[9px] font-black uppercase tracking-widest text-on_surface_variant/40 mt-8">
            PropChain Security V4.0
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand/30 dark:bg-[#0d0c0b] p-6 xl:p-12">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">Institutional Admin</h1>
            <p className="text-sm font-medium text-on_surface_variant dark:text-muted-foreground mt-1">Direct on-chain role allocation and node management.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary_fixed text-primary font-black px-3 py-1 text-[10px] tracking-widest border border-primary/20">DEV_MODE</Badge>
            <button
              onClick={() => fetchRoles()}
              disabled={loading}
              className="p-2 rounded-xl bg-white dark:bg-card border border-stone/50 dark:border-white/10 text-on_surface_variant dark:text-muted-foreground hover:text-primary shadow-sm transition-all"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          <div className="space-y-6">
            <Card className="rounded-[32px] overflow-hidden border-stone/50 dark:border-white/10 dark:bg-card shadow-sm">
              <CardHeader className="pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-2">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base font-bold">Node Identity</CardTitle>
                <CardDescription>Internal Clerk ID hash</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-sand/30 dark:bg-white/5 rounded-2xl border border-stone/20 dark:border-white/5 mb-4">
                  <code className="text-xs font-mono font-bold text-primary flex-1 truncate">
                    {user?.id ?? "SESSION_INVALID"}
                  </code>
                  <button
                    onClick={copyCurrentUserId}
                    className="p-2 rounded-xl hover:bg-stone/10 dark:hover:bg-white/5 text-on_surface_variant transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] font-bold text-on_surface_variant/60 dark:text-muted-foreground/40 leading-relaxed uppercase tracking-widest px-1">
                  Primary administrative identifier for on-chain role syncing.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] overflow-hidden border-stone/50 dark:border-white/10 dark:bg-card shadow-sm">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-2">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base font-bold">Role Assignment</CardTitle>
                <CardDescription>Delegate authority across network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground ml-1">Clerk User ID</label>
                  <Input
                    value={newClerkId}
                    onChange={(e) => setNewClerkId(e.target.value)}
                    placeholder="user_..."
                    className="h-11 rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground ml-1">Institutional Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["ORACLE", "BANK", "SUPER_ADMIN"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setNewRole(r)}
                        className={cn(
                          "py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                          newRole === r
                            ? "bg-primary text-white border-primary shadow-lg"
                            : "bg-sand/30 dark:bg-white/5 border-stone/20 dark:border-white/5 text-on_surface_variant dark:text-muted-foreground hover:bg-stone/10"
                        )}
                      >
                        {r === "SUPER_ADMIN" ? "ADMIN" : r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground ml-1">Audit Note</label>
                  <Input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Reference for assignment..."
                    className="h-11 rounded-xl"
                  />
                </div>

                <Button
                  onClick={handleAssign}
                  disabled={!newClerkId.trim() || !newClerkId.startsWith("user_") || submitting}
                  className="w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                >
                  {submitting ? "Finalizing..." : "Grant Authority"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[32px] overflow-hidden border-stone/50 dark:border-white/10 dark:bg-card shadow-sm h-fit">
            <CardHeader className="border-b border-stone/20 dark:border-white/5 bg-sand/20 dark:bg-white/[0.01]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
                    <Users className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Authorized Nodes</CardTitle>
                    <CardDescription>Live on-chain permissions</CardDescription>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success border border-success/20 font-black">{roles.length} Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-stone/5 dark:bg-white/5 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : roles.length === 0 ? (
                <div className="py-24 text-center">
                  <Shield className="w-12 h-12 text-on_surface_variant/20 mx-auto mb-4" />
                  <p className="text-sm font-bold text-on_surface_variant dark:text-muted-foreground opacity-40 uppercase tracking-widest">Registry Empty</p>
                </div>
              ) : (
                <div className="divide-y divide-stone/20 dark:divide-white/5">
                  {roles.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between p-6 hover:bg-sand/30 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-success ring-4 ring-success/10 shrink-0" />
                        <div className="min-w-0">
                          <code className="text-[13px] font-mono font-bold text-on_surface dark:text-[#e8eaf0] truncate block">{r.clerkId}</code>
                          {r.note && <p className="text-[10px] font-bold text-on_surface_variant dark:text-muted-foreground opacity-60 mt-1 uppercase tracking-widest">{r.note}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <Badge className={cn("px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border", ROLE_COLORS[r.role])}>
                          {r.role}
                        </Badge>
                        <button
                          onClick={() => handleRevoke(r.clerkId, r.role)}
                          className="p-2 rounded-xl text-on_surface_variant dark:text-muted-foreground hover:text-error hover:bg-error/5 transition-all border border-transparent hover:border-error/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
