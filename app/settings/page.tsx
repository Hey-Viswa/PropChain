"use client";
import { useUser } from "@clerk/nextjs";
import { useWallet } from "@/hooks/useWallet";
import { useKYC } from "@/hooks/useKYC";
import {
  User, Wallet, Shield, Bell,
  AlertTriangle, Copy, CheckCircle,
  Unlink, LogOut, ChevronRight,
  ExternalLink, Sun, Moon, Monitor,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const {
    address, isConnected, disconnect, chain,
  } = useWallet();
  const { kycVerified } = useKYC();
  const { toast } = useToast();
  const { isDark, setTheme, theme, resolvedTheme, mounted } = useTheme();

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
    toast({
      title: "Copied",
      description: "Wallet address copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  if (!isLoaded) {
    return (
      <div className="max-w-3xl xl:max-w-4xl mx-auto
                      space-y-6 animate-shimmer">
        {[...Array(4)].map((_, i) => (
          <div key={i}
               className="bg-surface_container_lowest dark:bg-[#131820]
                          rounded-2xl overflow-hidden">
            <div className="h-1 bg-surface_container_high" />
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl
                                bg-surface_container dark:bg-[#1c2333]" />
                <div className="space-y-2">
                  <div className="h-5 w-32
                                  bg-surface_container dark:bg-[#1c2333] rounded" />
                  <div className="h-3 w-48
                                  bg-surface_container dark:bg-[#1c2333] rounded" />
                </div>
              </div>
              <div className="h-20 bg-surface_container dark:bg-[#1c2333]
                              rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl xl:max-w-4xl mx-auto space-y-6">

      {/* PAGE HEADER */}
      <div className="mb-10">
        <h1 className="text-headline-md font-semibold
                       text-on_surface dark:text-[#e8eaf0] tracking-tight mb-1">
          Account Settings
        </h1>
        <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">
          Manage your identity, wallet, and preferences
        </p>
      </div>

      {/* ── CARD 1: PROFILE ── */}
      <section className="bg-surface_container_lowest dark:bg-[#131820]
                          rounded-2xl overflow-hidden
                          shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="h-1 bg-gradient-to-r
                        from-primary to-primary_container" />
        <div className="p-8">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl
                            bg-primary_fixed
                            flex items-center justify-center
                            flex-shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-title-md font-bold
                              text-on_surface dark:text-[#e8eaf0]">
                Profile
              </h2>
              <p className="text-label-sm
                             text-on_surface_variant dark:text-[#9ba3b8]">
                Your Clerk account identity
              </p>
            </div>
          </div>

          {/* Avatar + name row */}
          <div className="flex items-center gap-4 mb-6
                          p-4 bg-surface_container_low dark:bg-[#161b27]
                          rounded-xl">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full
                           object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-title-md font-semibold
                             text-on_surface dark:text-[#e8eaf0] truncate">
                {user?.fullName ?? "—"}
              </p>
              <p className="text-body-md
                             text-on_surface_variant dark:text-[#9ba3b8] truncate">
                {user?.primaryEmailAddress
                  ?.emailAddress ?? "—"}
              </p>
            </div>
          </div>

          {/* Info tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2
                          gap-4">
            <div className="p-4 bg-surface_container_low dark:bg-[#161b27]
                            rounded-xl">
              <p className="text-[10px] uppercase
                             tracking-wider
                             text-on_surface_variant dark:text-[#9ba3b8]
                             font-bold mb-1">
                Member Since
              </p>
              <p className="text-body-md font-medium
                             text-on_surface dark:text-[#e8eaf0]">
                {user?.createdAt
                  ? new Date(user.createdAt)
                      .toLocaleDateString("en-IN", {
                        day:   "numeric",
                        month: "long",
                        year:  "numeric",
                      })
                  : "—"}
              </p>
            </div>
            <div className="p-4 bg-surface_container_low dark:bg-[#161b27]
                            rounded-xl">
              <p className="text-[10px] uppercase
                             tracking-wider
                             text-on_surface_variant dark:text-[#9ba3b8]
                             font-bold mb-1">
                User ID
              </p>
              <p className="text-body-md font-medium
                             text-on_surface dark:text-[#e8eaf0] font-mono
                             truncate">
                {user?.id
                  ? `${user.id.slice(0, 14)}...`
                  : "—"}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── CARD 2: WALLET ── */}
      <section className="bg-surface_container_lowest dark:bg-[#131820]
                          rounded-2xl overflow-hidden
                          shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="h-1 bg-gradient-to-r
                        from-success to-success/50" />
        <div className="p-8">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl
                            bg-success_container
                            flex items-center justify-center
                            flex-shrink-0">
              <Wallet className="w-6 h-6 text-success" />
            </div>
            <div>
              <h2 className="text-title-md font-bold
                              text-on_surface dark:text-[#e8eaf0]">
                Wallet
              </h2>
              <p className="text-label-sm
                             text-on_surface_variant dark:text-[#9ba3b8]">
                Connected blockchain identity
              </p>
            </div>
          </div>

          {isConnected ? (
            <div className="space-y-4">

              {/* Address tile */}
              <div className="flex items-center gap-3
                              p-4 bg-surface_container_low dark:bg-[#161b27]
                              rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full
                                bg-success flex-shrink-0
                                ring-4 ring-success/20" />
                <span className="font-mono text-body-md
                                  text-on_surface dark:text-[#e8eaf0] flex-1
                                  truncate">
                  {address}
                </span>
                <button
                  onClick={copyAddress}
                  className="p-2 rounded-lg flex-shrink-0
                             hover:bg-surface_container dark:hover:bg-[#1c2333] dark:bg-[#1c2333]
                             transition-colors">
                  {copied
                    ? <CheckCircle className="w-4 h-4
                                              text-success" />
                    : <Copy className="w-4 h-4
                                       text-on_surface_variant dark:text-[#9ba3b8]" />
                  }
                </button>
              </div>

              {/* Network + disconnect row */}
              <div className="flex items-center
                              justify-between
                              p-4 rounded-xl
                              hover:bg-surface_container_low dark:hover:bg-[#161b27] dark:bg-[#161b27]
                              transition-colors">
                <div className="flex items-center gap-2">
                  <p className="text-label-sm
                                 text-on_surface_variant dark:text-[#9ba3b8]">
                    Network
                  </p>
                  <span className="rounded-full px-3 py-1
                                    text-label-sm font-medium
                                    bg-primary_fixed
                                    text-primary">
                    {chain?.name ?? "Unknown"}
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-1.5
                             text-label-sm font-medium
                             text-on_surface_variant dark:text-[#9ba3b8]
                             hover:text-error
                             transition-colors">
                  <Unlink className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-3
                            p-4 bg-surface_container_low dark:bg-[#161b27]
                            rounded-xl">
              <div className="w-2.5 h-2.5 rounded-full
                              bg-error flex-shrink-0
                              ring-4 ring-error/20" />
              <p className="text-body-md
                             text-on_surface_variant dark:text-[#9ba3b8]">
                No wallet connected
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ── CARD 3: KYC VERIFICATION ── */}
      <section className="bg-surface_container_lowest dark:bg-[#131820]
                          rounded-2xl overflow-hidden
                          shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className={`h-1 bg-gradient-to-r ${
          kycVerified
            ? "from-success to-success/50"
            : "from-secondary to-secondary/50"
        }`} />
        <div className="p-8">

          <div className="flex items-center
                          justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl
                              flex items-center justify-center
                              flex-shrink-0 ${
                                kycVerified
                                  ? "bg-success_container"
                                  : "bg-secondary_fixed"
                              }`}>
                <Shield className={`w-6 h-6 ${
                  kycVerified
                    ? "text-success"
                    : "text-secondary"
                }`} />
              </div>
              <div>
                <h2 className="text-title-md font-bold
                                text-on_surface dark:text-[#e8eaf0]">
                  KYC Verification
                </h2>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8]">
                  Identity verification status
                </p>
              </div>
            </div>
            {kycVerified ? (
              <span className="rounded-full px-3 py-1
                                text-label-sm font-bold
                                bg-success_container
                                text-success flex-shrink-0">
                ✓ Verified
              </span>
            ) : (
              <span className="rounded-full px-3 py-1
                                text-label-sm font-bold
                                bg-secondary_fixed
                                text-on_secondary_fixed
                                flex-shrink-0">
                Pending
              </span>
            )}
          </div>

          {kycVerified ? (
            <div className="grid grid-cols-1 sm:grid-cols-2
                            gap-4">
              <div className="p-4 bg-surface_container_low dark:bg-[#161b27]
                              rounded-xl">
                <p className="text-[10px] uppercase
                               tracking-wider
                               text-on_surface_variant dark:text-[#9ba3b8]
                               font-bold mb-1">
                  Aadhaar (masked)
                </p>
                <p className="text-body-md font-medium
                               text-on_surface dark:text-[#e8eaf0] font-mono">
                  XXXX-XXXX-****
                </p>
              </div>
              <div className="p-4 bg-surface_container_low dark:bg-[#161b27]
                              rounded-xl">
                <p className="text-[10px] uppercase
                               tracking-wider
                               text-on_surface_variant dark:text-[#9ba3b8]
                               font-bold mb-1">
                  Verified On
                </p>
                <p className="text-body-md font-medium
                               text-on_surface dark:text-[#e8eaf0]">
                  {new Date().toLocaleDateString("en-IN", {
                    day:   "numeric",
                    month: "long",
                    year:  "numeric",
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center
                            justify-between
                            p-4 bg-secondary_fixed/30
                            rounded-xl">
              <p className="text-body-md
                             text-on_surface_variant dark:text-[#9ba3b8]">
                Complete identity verification to
                register properties
              </p>
              <Link href="/dashboard">
                <Button variant="default" size="sm">
                  Verify Now
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ── CARD 4: NOTIFICATIONS ── */}
      <section className="bg-surface_container_lowest dark:bg-[#131820]
                          rounded-2xl overflow-hidden
                          shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="h-1 bg-gradient-to-r
                        from-secondary to-secondary/50" />
        <div className="p-8">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl
                            bg-secondary_fixed
                            flex items-center justify-center
                            flex-shrink-0">
              <Bell className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-title-md font-bold
                              text-on_surface dark:text-[#e8eaf0]">
                Notification Preferences
              </h2>
              <p className="text-label-sm
                             text-on_surface_variant dark:text-[#9ba3b8]">
                Choose what updates you receive
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              {
                key:   "onApproval",
                label: "Property approved",
                desc:  "When Oracle approves your registration",
              },
              {
                key:   "onTransfer",
                label: "Transfer initiated",
                desc:  "When someone starts a transfer on your property",
              },
              {
                key:   "onLien",
                label: "Lien registered",
                desc:  "When a bank registers a lien on your property",
              },
              {
                key:   "onRejection",
                label: "Submission rejected",
                desc:  "When Oracle rejects your registration",
              },
            ].map((item) => (
              <div key={item.key}
                   className="flex items-center
                              justify-between p-4
                              rounded-xl
                              hover:bg-surface_container_low dark:hover:bg-[#161b27] dark:bg-[#161b27]
                              transition-colors gap-4">
                <div className="min-w-0">
                  <p className="text-body-md font-semibold
                                 text-on_surface dark:text-[#e8eaf0]">
                    {item.label}
                  </p>
                  <p className="text-label-sm
                                 text-on_surface_variant dark:text-[#9ba3b8] mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <Switch
                  checked={
                    notifications[
                      item.key as keyof typeof notifications
                    ]
                  }
                  onCheckedChange={(val) =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: val,
                    }))
                  }
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* APPEARANCE CARD */}
      <section className="bg-surface_container_lowest
                          dark:bg-[#131820]
                          rounded-2xl overflow-hidden
                          shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="h-1 bg-gradient-to-r
                        from-[#4f46e5] to-[#7c3aed]" />
        <div className="p-8">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#ede9fe]
                            flex items-center justify-center
                            flex-shrink-0">
              <Monitor className="w-6 h-6 text-[#4f46e5]" />
            </div>
            <div>
              <h2 className="text-title-md font-bold
                              text-on_surface
                              dark:text-[#e8eaf0]">
                Appearance
              </h2>
              <p className="text-label-sm text-on_surface_variant
                             dark:text-[#9ba3b8]">
                Choose your preferred display mode
              </p>
            </div>
          </div>

          {mounted && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", icon: Sun,     label: "Light" },
                { value: "dark",  icon: Moon,    label: "Dark" },
                { value: "system",icon: Monitor, label: "System" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex flex-col items-center
                              gap-2 p-4 rounded-xl
                              transition-all border-2
                              ${resolvedTheme === value ||
                                (value === "system" &&
                                 theme === "system")
                                ? "border-primary bg-primary_fixed dark:bg-[#1a2d4d] dark:border-[#6b9eff]"
                                : "border-transparent bg-surface_container_low dark:bg-[#161b27] hover:bg-surface_container dark:hover:bg-[#1c2333]"
                              }`}>
                  <Icon className={`w-5 h-5 ${
                    resolvedTheme === value ||
                    (value === "system" && theme === "system")
                      ? "text-primary dark:text-[#6b9eff]"
                      : "text-on_surface_variant dark:text-[#9ba3b8]"
                  }`} />
                  <span className={`text-label-sm font-medium ${
                    resolvedTheme === value ||
                    (value === "system" && theme === "system")
                      ? "text-primary dark:text-[#6b9eff]"
                      : "text-on_surface_variant dark:text-[#9ba3b8]"
                  }`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── CARD 5: DANGER ZONE ── */}
      <section className="bg-surface_container_lowest dark:bg-[#131820]
                          rounded-2xl overflow-hidden
                          shadow-[0_4px_20px_rgba(0,0,0,0.03)]
                          border border-error_container">
        <div className="h-1 bg-gradient-to-r
                        from-error to-error/50" />
        <div className="p-8">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl
                            bg-error_container
                            flex items-center justify-center
                            flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <div>
              <h2 className="text-title-md font-bold
                              text-error">
                Danger Zone
              </h2>
              <p className="text-label-sm
                             text-on_surface_variant dark:text-[#9ba3b8]">
                Irreversible actions — proceed carefully
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-error_container/30
                          p-6 rounded-2xl
                          border border-error_container">

            <div className="flex items-center
                            justify-between py-2">
              <div>
                <p className="text-body-md font-bold
                               text-on_surface dark:text-[#e8eaf0]">
                  Sign out of all devices
                </p>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8]">
                  Ends all active sessions immediately
                </p>
              </div>
              <Button
                size="sm"
                className="border border-error
                           bg-transparent text-error
                           hover:bg-error_container
                           rounded-md flex-shrink-0">
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out All
              </Button>
            </div>

            <div className="h-px bg-error_container" />

            <div className="flex items-center
                            justify-between py-2">
              <div>
                <p className="text-body-md font-bold
                               text-on_surface dark:text-[#e8eaf0]">
                  Unlink wallet from account
                </p>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8]">
                  Removes wallet association from your profile
                </p>
              </div>
              <Button
                size="sm"
                className="bg-error text-white
                           hover:bg-error/90 rounded-md
                           flex-shrink-0"
                onClick={handleDisconnect}>
                <Unlink className="w-3.5 h-3.5 mr-1.5" />
                Unlink Wallet
              </Button>
            </div>

            <div className="p-4
                            bg-surface_container_lowest dark:bg-[#131820]/60
                            rounded-xl border
                            border-error_container">
              <p className="text-label-sm text-error/80
                             leading-relaxed italic font-medium">
                Signing out all devices will immediately end
                your session on all browsers and devices.
                You will need to sign in again.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
