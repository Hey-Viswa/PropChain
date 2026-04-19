"use client";
import { useUser } from "@clerk/nextjs";
import { useWallet } from "@/hooks/useWallet";
import { useKYC } from "@/hooks/useKYC";
import {
  Wallet, Shield, AlertTriangle,
  Copy, CheckCircle, Unlink, LogOut,
  ChevronRight, Sun, Moon, Monitor,
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
import Link from "next/link";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
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

  const handleDisconnect = () => {
    disconnect();
    toast({ title: "Wallet disconnected" });
  };

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-stone dark:bg-[#2a2520] rounded-2xl" />
        ))}
      </div>
    );
  }

  const themeOptions = [
    { value: "light",  icon: Sun,     label: "Light" },
    { value: "dark",   icon: Moon,    label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  const notifItems = [
    { key: "onApproval",  label: "Property approved",    desc: "When Oracle approves your registration" },
    { key: "onTransfer",  label: "Transfer initiated",   desc: "When someone starts a transfer on your property" },
    { key: "onLien",      label: "Lien registered",      desc: "When a bank registers a lien on your property" },
    { key: "onRejection", label: "Submission rejected",  desc: "When Oracle rejects your registration" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-on_surface dark:text-[#e8e6e2] tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-[#8a8480] dark:text-[#7a7470] mt-1">
          Manage your account, wallet, and preferences.
        </p>
      </div>

      {/* ── DEV ORACLE TOGGLE (development only) ── */}
      {isDev && (
        <Card className="border-dashed border-2 border-secondary/40 dark:border-[#5c3a00]/60 bg-secondary_fixed/20 dark:bg-[#3d2800]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider border-secondary/40 text-secondary dark:text-[#f59e0b] px-1.5 py-0.5">
                    DEV
                  </Badge>
                  <p className="text-sm font-semibold text-on_surface dark:text-[#e8e6e2]">
                    Oracle Mode Toggle
                  </p>
                </div>
                <p className="text-xs text-[#8a8480] dark:text-[#7a7470]">
                  Bypass passphrase for development. Switches oracle context directly.
                </p>
              </div>
              <Switch
                checked={isOracleMode}
                onCheckedChange={(v) => {
                  if (v) {
                    setOracleMode(true);
                    toast({ title: "Oracle mode ON", description: "Dev bypass — no passphrase required." });
                  } else {
                    reset();
                    toast({ title: "Oracle mode OFF" });
                  }
                }}
              />
            </div>
            {isOracleMode && (
              <div className="mt-3 flex gap-2">
                <Link href="/oracle/queue">
                  <Button size="sm" variant="outline" className="text-xs h-7 border-secondary/30 text-secondary dark:text-[#f59e0b] hover:bg-secondary_fixed/30 gap-1.5">
                    Queue <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
                <Link href="/oracle/users">
                  <Button size="sm" variant="outline" className="text-xs h-7 border-secondary/30 text-secondary dark:text-[#f59e0b] hover:bg-secondary_fixed/30 gap-1.5">
                    Users <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
                <Link href="/oracle/analytics">
                  <Button size="sm" variant="outline" className="text-xs h-7 border-secondary/30 text-secondary dark:text-[#f59e0b] hover:bg-secondary_fixed/30 gap-1.5">
                    Analytics <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── PROFILE ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Your Clerk account identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Avatar row */}
          <div className="flex items-center gap-3 p-3 bg-sand dark:bg-[#211f1c] rounded-xl">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              : <div className="w-10 h-10 rounded-full bg-primary_fixed dark:bg-[#3D1F10] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary dark:text-[#E89874]">
                    {user?.firstName?.[0] ?? "?"}
                  </span>
                </div>
            }
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-on_surface dark:text-[#e8e6e2] truncate">
                {user?.fullName ?? "—"}
              </p>
              <p className="text-xs text-[#8a8480] dark:text-[#7a7470] truncate">
                {user?.primaryEmailAddress?.emailAddress ?? "—"}
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] flex-shrink-0 border-stone dark:border-[#2a2520] text-[#8a8480]">
              {user?.createdAt
                ? new Date(user.createdAt).getFullYear()
                : "—"}
            </Badge>
          </div>

          {/* KYC status row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-sand dark:bg-[#211f1c]">
            <div className="flex items-center gap-2.5">
              <Shield className={cn("w-4 h-4 flex-shrink-0", kycVerified ? "text-success" : "text-[#8a8480]")} />
              <div>
                <p className="text-sm font-medium text-on_surface dark:text-[#e8e6e2]">KYC Verification</p>
                <p className="text-xs text-[#8a8480] dark:text-[#7a7470]">
                  {kycVerified ? "Identity confirmed" : "Not yet verified"}
                </p>
              </div>
            </div>
            {kycVerified
              ? <Badge className="bg-success/10 text-success border-success/20 border text-[10px]">Verified</Badge>
              : <Link href="/dashboard">
                  <Button size="sm" variant="outline" className="text-xs h-7">Verify Now</Button>
                </Link>
            }
          </div>
        </CardContent>
      </Card>

      {/* ── WALLET ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Wallet</CardTitle>
          <CardDescription>Connected blockchain identity</CardDescription>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-2">
              {/* Address */}
              <div className="flex items-center gap-3 p-3 bg-sand dark:bg-[#211f1c] rounded-xl group">
                <div className="w-2 h-2 rounded-full bg-success flex-shrink-0 ring-2 ring-success/20" />
                <span className="font-mono text-xs text-on_surface dark:text-[#e8e6e2] flex-1 truncate">
                  {address}
                </span>
                <button
                  onClick={copyAddress}
                  className="p-1.5 rounded-lg hover:bg-stone dark:hover:bg-[#2a2520] transition-colors flex-shrink-0"
                >
                  {copied
                    ? <CheckCircle className="w-3.5 h-3.5 text-success" />
                    : <Copy className="w-3.5 h-3.5 text-[#8a8480]" />
                  }
                </button>
              </div>

              {/* Network + disconnect */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8a8480] dark:text-[#7a7470]">Network</span>
                  <Badge variant="outline" className="text-[10px] border-stone dark:border-[#2a2520] text-primary dark:text-[#E89874]">
                    {chain?.name ?? "Unknown"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-xs h-7 text-error hover:bg-error_container gap-1.5 px-2"
                >
                  <Unlink className="w-3 h-3" />
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-sand dark:bg-[#211f1c] rounded-xl">
              <div className="w-2 h-2 rounded-full bg-error flex-shrink-0 ring-2 ring-error/20" />
              <div className="flex-1">
                <p className="text-sm text-on_surface dark:text-[#e8e6e2]">No wallet connected</p>
                <p className="text-xs text-[#8a8480] dark:text-[#7a7470] mt-0.5">Connect from the dashboard to manage properties</p>
              </div>
              <Wallet className="w-4 h-4 text-[#8a8480] flex-shrink-0" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── NOTIFICATIONS ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Choose what updates you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          {notifItems.map((item, i) => (
            <div key={item.key}>
              {i > 0 && <Separator className="mx-5 w-auto" />}
              <div className="flex items-center justify-between px-5 py-3.5 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-on_surface dark:text-[#e8e6e2]">{item.label}</p>
                  <p className="text-xs text-[#8a8480] dark:text-[#7a7470] mt-0.5">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(val) =>
                    setNotifications((prev) => ({ ...prev, [item.key]: val }))
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── APPEARANCE ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Choose your preferred display mode</CardDescription>
        </CardHeader>
        <CardContent>
          {mounted && (
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, icon: Icon, label }) => {
                const active = resolvedTheme === value || (value === "system" && theme === "system");
                return (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                      "flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all text-sm",
                      active
                        ? "border-primary bg-primary_fixed dark:bg-[#3D1F10] dark:border-[#E89874]"
                        : "border-transparent bg-sand dark:bg-[#211f1c] hover:bg-stone dark:hover:bg-[#2a2520]"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", active ? "text-primary dark:text-[#E89874]" : "text-[#8a8480] dark:text-[#7a7470]")} />
                    <span className={cn("text-xs font-medium", active ? "text-primary dark:text-[#E89874]" : "text-[#8a8480] dark:text-[#7a7470]")}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── DANGER ZONE ── */}
      <Card className="border-error_container dark:border-[#3d1010]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-error" />
            <CardTitle className="text-base text-error">Danger Zone</CardTitle>
          </div>
          <CardDescription>Irreversible actions — proceed carefully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-on_surface dark:text-[#e8e6e2]">Sign out of all devices</p>
              <p className="text-xs text-[#8a8480] dark:text-[#7a7470] mt-0.5">Ends all active sessions immediately</p>
            </div>
            <Button variant="outline" size="sm" className="border-error/30 text-error hover:bg-error_container gap-1.5 flex-shrink-0">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out All
            </Button>
          </div>
          <Separator className="mx-5 w-auto" />
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-on_surface dark:text-[#e8e6e2]">Unlink wallet</p>
              <p className="text-xs text-[#8a8480] dark:text-[#7a7470] mt-0.5">Removes wallet association from your profile</p>
            </div>
            <Button size="sm" onClick={handleDisconnect} className="bg-error text-white hover:bg-error/90 gap-1.5 flex-shrink-0">
              <Unlink className="w-3.5 h-3.5" />
              Unlink Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
