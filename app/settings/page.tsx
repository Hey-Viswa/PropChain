"use client";

import { useUser } from "@clerk/nextjs";
import { useWallet } from "@/hooks/useWallet";
import { useKYC } from "@/hooks/useKYC";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import {
  Wallet, Shield, AlertTriangle,
  Copy, CheckCircle, Unlink, LogOut,
  ChevronRight, Sun, Moon, Monitor,
  Bell, Globe, User, Fingerprint
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/utils";

const isDev = process.env.NODE_ENV === "development";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { address, isConnected, disconnect, chain } = useWallet();
  const { kycVerified } = useKYC();
  const { toast } = useToast();
  const { setTheme, theme, resolvedTheme, mounted } = useTheme();
  const { isOracleMode, setOracleMode, reset } = useOracleAccessStore();

  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    onApproval:  true,
    onTransfer:  true,
    onLien:      false,
    onRejection: true,
  });

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({ title: "Copied", description: "Wallet address copied." });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-stone dark:bg-[#2a2520] rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-stone dark:bg-[#2a2520] rounded-xl" />
          <div className="md:col-span-2 h-64 bg-stone dark:bg-[#2a2520] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your institutional identity, security, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: PROFILE & THEME */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Identity</CardTitle>
              <CardDescription>Verified Clerk profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center p-6 bg-muted/30 rounded-2xl border border-border">
                <div className="relative">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-[#1a1916] shadow-sm" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary_fixed flex items-center justify-center border-4 border-white dark:border-[#1a1916]">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  {kycVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-success text-white p-1.5 rounded-full border-2 border-white dark:border-[#1a1916]">
                      <ShieldCheckIcon size={12} />
                    </div>
                  )}
                </div>
                <h3 className="mt-4 font-bold text-lg">{user?.fullName || "PropChain User"}</h3>
                <p className="text-xs text-on_surface_variant truncate w-full">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-2.5">
                    <Fingerprint className="w-4 h-4 text-on_surface_variant dark:text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">KYC Status</span>
                  </div>
                  {kycVerified ? (
                    <Badge className="bg-success/10 text-success border-success/10 px-3 py-1 font-bold tracking-wider">Verified</Badge>
                  ) : (
                    <Button size="xs" variant="outline" className="h-7 px-3 text-[10px] font-bold uppercase tracking-widest rounded-xl">Verify</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold">Appearance</CardTitle>
              <CardDescription>Global interface theme</CardDescription>
            </CardHeader>
            <CardContent>
              {mounted && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "light", i: Sun },
                    { v: "dark", i: Moon },
                    { v: "system", i: Monitor }
                  ].map(({ v, i: Icon }) => (
                    <button
                      key={v}
                      onClick={() => setTheme(v)}
                      className={cn(
                        "flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all",
                        resolvedTheme === v || (v === "system" && theme === "system")
                          ? "border-primary bg-primary_fixed/30 dark:bg-primary/20"
                          : "border-transparent bg-sand dark:bg-white/5 hover:bg-stone/50"
                      )}
                    >
                      <Icon size={16} className={cn(resolvedTheme === v ? "text-primary" : "text-on_surface_variant dark:text-muted-foreground")} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">{v}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COL: WALLET & SECURITY */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Institutional Wallet</CardTitle>
                  <CardDescription>Connected blockchain identity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
                      <span className="font-mono text-sm truncate">{address}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={copyAddress} className="shrink-0 ml-2">
                      {copied ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-on_surface_variant">Network</span>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{chain?.name || "Mainnet"}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => disconnect()} className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10 uppercase tracking-wider">
                      <Unlink className="w-3.5 h-3.5 mr-1.5" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-sand/30 dark:bg-white/5 rounded-2xl border-2 border-dashed border-stone">
                  <p className="text-sm text-on_surface_variant">No wallet connected</p>
                  <Button className="mt-4 h-10 px-6 uppercase text-xs font-bold tracking-wider">Connect Wallet</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-base">Notifications</CardTitle>
                  <CardDescription>Asset activity alerts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 p-0">
              {[
                { k: "onApproval",  l: "Verification Updates", d: "When properties are approved or rejected" },
                { k: "onTransfer",  l: "Ownership Transfers",  d: "When tokens are sent or received" },
                { k: "onLien",      l: "Compliance Events",    d: "Lien registrations and legal actions" }
              ].map((n, i) => (
                <div key={n.k}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-bold">{n.l}</p>
                      <p className="text-xs text-on_surface_variant mt-0.5">{n.d}</p>
                    </div>
                    <Switch 
                      checked={notifications[n.k as keyof typeof notifications]} 
                      onCheckedChange={(v) => setNotifications(p => ({...p, [n.k]: v}))}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5 dark:bg-destructive/10 rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <CardTitle className="text-base font-bold">Security Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">Revoke Sessions</p>
                  <p className="text-xs text-on_surface_variant dark:text-muted-foreground mt-0.5">Sign out of all authorized devices</p>
                </div>
                <Button variant="outline" size="sm" className="h-9 px-5 border-destructive/30 text-destructive hover:bg-destructive/10 font-bold uppercase tracking-widest text-[10px] rounded-xl">
                  Sign Out All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

function ShieldCheckIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>;
}
