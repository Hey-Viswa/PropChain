"use client";
import OracleGuard from "@/components/shared/OracleGuard";
import { useWallet } from "@/hooks/useWallet";
import {
  Shield, Copy, CheckCircle, ExternalLink,
  SlidersHorizontal, BarChart2, Users,
  AlertTriangle, ChevronRight, Bell, User,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

export default function OracleSettingsPage() {
  return (
    <OracleGuard>
      <OracleSettingsContent />
    </OracleGuard>
  );
}

function OracleSettingsContent() {
  const { address, chain } = useWallet();
  const { toast } = useToast();

  const [copiedWallet, setCopiedWallet]     = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [threshold, setThreshold]           = useState(50);
  const [manualReview, setManualReview]     = useState(false);
  const [highlightFraud, setHighlightFraud] = useState(true);
  const [grantAddress, setGrantAddress]     = useState("");
  const [grantBank, setGrantBank]           = useState("");

  const truncate = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";

  const copyToClipboard = (
    text: string,
    setter: (v: boolean) => void,
    label: string
  ) => {
    navigator.clipboard.writeText(text);
    setter(true);
    toast({ title: "Copied", description: `${label} copied.` });
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* PAGE HEADER */}
      <div className="mb-10">
        <h1 className="text-headline-md font-semibold
                       text-on_surface dark:text-[#e8eaf0] tracking-tight mb-1">
          Oracle Settings
        </h1>
        <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">
          Manage your oracle authority and system configuration
        </p>
      </div>

      {/* ── CARD 1: ORACLE IDENTITY ── */}
      <section className="bg-surface_container_lowest dark:bg-[#1a1916]
                          rounded-2xl overflow-hidden
                          shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="h-1 bg-gradient-to-r
                        from-primary to-primary_container" />
        <div className="p-8">

          {/* Header row */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl
                              bg-primary_fixed flex items-center
                              justify-center text-primary
                              flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-title-md font-bold
                               text-on_surface dark:text-[#e8eaf0]">
                  Oracle Identity
                </h2>
                <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8]">
                  Core identity on the Polygon Network
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5
                              rounded-full px-3 py-1
                              text-label-sm font-bold
                              bg-success_container text-success
                              flex-shrink-0">
              <CheckCircle className="w-3 h-3" />
              Verified On-Chain
            </span>
          </div>

          <div className="space-y-6">

            {/* Role display */}
            <div>
              <span className="text-[10px] uppercase
                                tracking-wider
                                text-on_surface_variant dark:text-[#9ba3b8]
                                font-bold">
                Contract Role
              </span>
              <div className="mt-1 bg-surface_container_low dark:bg-[#211f1c]
                              rounded-lg px-4 py-2 inline-block
                              font-mono text-primary font-bold">
                ORACLE_ROLE
              </div>
              <p className="text-label-sm
                             text-on_surface_variant dark:text-[#9ba3b8] mt-1">
                Active on {chain?.name ?? "Hardhat Local"}
              </p>
            </div>

            {/* Info tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2
                            gap-4">
              <button
                onClick={() => copyToClipboard(
                  address ?? "", setCopiedWallet, "Wallet"
                )}
                className="bg-surface_container_low dark:bg-[#211f1c] p-4
                           rounded-xl flex justify-between
                           items-center hover:bg-surface_container dark:hover:bg-[#2a2520] dark:bg-[#2a2520]
                           transition-colors text-left w-full">
                <div>
                  <p className="text-[10px] uppercase
                                 text-on_surface_variant dark:text-[#9ba3b8]
                                 font-bold mb-0.5">
                    Oracle Wallet
                  </p>
                  <p className="font-mono text-body-md
                                 text-on_surface dark:text-[#e8eaf0] font-medium">
                    {truncate(address ?? "")}
                  </p>
                </div>
                {copiedWallet
                  ? <CheckCircle className="w-4 h-4 text-success
                                            flex-shrink-0" />
                  : <Copy className="w-4 h-4
                                     text-on_surface_variant dark:text-[#9ba3b8]
                                     flex-shrink-0" />
                }
              </button>

              <button
                onClick={() => copyToClipboard(
                  CONTRACT_ADDRESS, setCopiedContract, "Contract"
                )}
                className="bg-surface_container_low dark:bg-[#211f1c] p-4
                           rounded-xl flex justify-between
                           items-center hover:bg-surface_container dark:hover:bg-[#2a2520] dark:bg-[#2a2520]
                           transition-colors text-left w-full">
                <div>
                  <p className="text-[10px] uppercase
                                 text-on_surface_variant dark:text-[#9ba3b8]
                                 font-bold mb-0.5">
                    Oracle Contract
                  </p>
                  <p className="font-mono text-body-md
                                 text-on_surface dark:text-[#e8eaf0] font-medium">
                    {truncate(CONTRACT_ADDRESS)}
                  </p>
                </div>
                {copiedContract
                  ? <CheckCircle className="w-4 h-4 text-success
                                            flex-shrink-0" />
                  : <Copy className="w-4 h-4
                                     text-on_surface_variant dark:text-[#9ba3b8]
                                     flex-shrink-0" />
                }
              </button>
            </div>

            <a
              href={`https://mumbai.polygonscan.com/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5
                         text-primary text-body-md font-bold
                         hover:opacity-80 transition-opacity">
              View on Polygonscan
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

          </div>
        </div>
      </section>

      {/* ── CARD 2: VERIFICATION PREFERENCES ── */}
      <section className="bg-surface_container_lowest dark:bg-[#1a1916]
                          rounded-2xl overflow-hidden
                          shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="h-1 bg-gradient-to-r
                        from-[#4f46e5] to-[#7c3aed]" />
        <div className="p-8">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#ede9fe]
                            flex items-center justify-center
                            flex-shrink-0">
              <SlidersHorizontal className="w-6 h-6
                                            text-[#4f46e5]" />
            </div>
            <div>
              <h2 className="text-title-md font-bold
                              text-on_surface dark:text-[#e8eaf0]">
                Verification Preferences
              </h2>
              <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8]">
                Configure automated validation logic
              </p>
            </div>
          </div>

          <div className="space-y-2">

            {/* Threshold slider */}
            <div className="flex items-center justify-between
                            p-4 rounded-xl
                            hover:bg-surface_container_low dark:hover:bg-[#161b27] dark:bg-[#211f1c]
                            transition-colors">
              <div>
                <p className="text-body-md font-semibold
                               text-on_surface dark:text-[#e8eaf0]">
                  Auto-reject Threshold
                </p>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8]">
                  Automatically reject if document score is
                  below {threshold}%
                </p>
              </div>
              <div className="flex items-center gap-4 w-1/3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={threshold}
                  onChange={(e) =>
                    setThreshold(Number(e.target.value))}
                  className="w-full h-1 bg-surface_container_high
                             rounded-lg appearance-none
                             cursor-pointer accent-primary"
                />
                <span className="font-bold text-primary text-sm
                                  min-w-[36px]">
                  {threshold}%
                </span>
              </div>
            </div>

            {/* Toggle — Manual review */}
            <div className="flex items-center justify-between
                            p-4 rounded-xl
                            hover:bg-surface_container_low dark:hover:bg-[#161b27] dark:bg-[#211f1c]
                            transition-colors">
              <div>
                <p className="text-body-md font-semibold
                               text-on_surface dark:text-[#e8eaf0]">
                  Manual Review Trigger
                </p>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8]">
                  Force oracle review for all cross-border
                  transactions
                </p>
              </div>
              <Switch
                checked={manualReview}
                onCheckedChange={setManualReview}
              />
            </div>

            {/* Toggle — Highlight fraud */}
            <div className="flex items-center justify-between
                            p-4 rounded-xl
                            hover:bg-surface_container_low dark:hover:bg-[#161b27] dark:bg-[#211f1c]
                            transition-colors">
              <div>
                <p className="text-body-md font-semibold
                               text-on_surface dark:text-[#e8eaf0]">
                  Highlight Fraud Risks
                </p>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8]">
                  Visual flagging for suspicious wallet patterns
                </p>
              </div>
              <Switch
                checked={highlightFraud}
                onCheckedChange={setHighlightFraud}
              />
            </div>

            {/* Dropdown */}
            <div className="flex items-center justify-between
                            p-4 rounded-xl
                            hover:bg-surface_container_low dark:hover:bg-[#161b27] dark:bg-[#211f1c]
                            transition-colors">
              <div>
                <p className="text-body-md font-semibold
                               text-on_surface dark:text-[#e8eaf0]">
                  Default Rejection Reason
                </p>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8]">
                  Preset text for failed property audits
                </p>
              </div>
              <select className="bg-surface_container_low dark:bg-[#211f1c]
                                  text-body-md text-on_surface dark:text-[#e8eaf0]
                                  rounded-lg px-3 py-2
                                  border-0 focus:outline-none
                                  focus:ring-1 focus:ring-primary
                                  cursor-pointer">
                <option>Insufficient documentation</option>
                <option>Mismatch in legal titles</option>
                <option>Invalid digital signature</option>
                <option>ULPIN does not match records</option>
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* ── CARD 3: ORACLE STATISTICS ── */}
      <section className="bg-surface_container_lowest dark:bg-[#1a1916]
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
              <BarChart2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <h2 className="text-title-md font-bold
                              text-on_surface dark:text-[#e8eaf0]">
                Oracle Statistics
              </h2>
              <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8]">
                Real-time performance metrics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "Total Reviewed", value: "142",
                color: "text-on_surface dark:text-[#e8eaf0]" },
              { label: "Approved",       value: "118",
                color: "text-success" },
              { label: "Rejected",       value: "24",
                color: "text-error" },
              { label: "Approval Rate",  value: "83%",
                color: "text-primary" },
            ].map((s) => (
              <div key={s.label}
                   className="bg-surface_container_low dark:bg-[#211f1c] p-6
                               rounded-2xl">
                <p className="text-[10px] font-bold
                               text-on_surface_variant dark:text-[#9ba3b8]
                               uppercase tracking-wider mb-2">
                  {s.label}
                </p>
                <p className={`text-headline-lg font-bold
                                ${s.color}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <p className="text-body-md font-bold
                             text-on_surface dark:text-[#e8eaf0]">
                Accuracy Index
              </p>
              <p className="text-label-sm text-success font-bold">
                vs 79% last month ↑
              </p>
            </div>
            <div className="w-full h-2 bg-surface_container_low dark:bg-[#211f1c]
                            rounded-full overflow-hidden">
              <div className="w-[83%] h-full bg-primary
                              rounded-full" />
            </div>
          </div>

        </div>
      </section>

      {/* ── CARD 4: ROLE MANAGEMENT ── */}
      <section className="bg-surface_container_lowest dark:bg-[#1a1916]
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
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-title-md font-bold
                              text-on_surface dark:text-[#e8eaf0]">
                Role Management
              </h2>
              <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8]">
                Delegate and monitor sub-oracle nodes
              </p>
            </div>
          </div>

          <div className="space-y-8">

            {/* Oracle nodes */}
            <div>
              <div className="flex items-center
                              justify-between mb-4">
                <h3 className="text-body-md font-bold
                                text-on_surface dark:text-[#e8eaf0]">
                  Manage Oracle Nodes
                </h3>
                <span className="rounded-full px-2.5 py-1
                                  text-label-sm font-bold
                                  bg-success_container
                                  text-success">
                  1 Active
                </span>
              </div>

              <div className="bg-surface_container_low dark:bg-[#211f1c]
                              rounded-xl p-4 flex items-center
                              justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full
                                  bg-success flex-shrink-0
                                  ring-4 ring-success/20" />
                  <span className="font-mono text-body-md
                                    text-on_surface dark:text-[#e8eaf0] font-medium">
                    {truncate(address ?? "")}
                  </span>
                  <span className="text-label-sm
                                    text-on_surface_variant dark:text-[#9ba3b8]">
                    (You)
                  </span>
                </div>
                <span className="rounded-full px-2.5 py-1
                                  text-label-sm font-bold
                                  bg-secondary_fixed
                                  text-on_secondary_fixed">
                  Owner
                </span>
              </div>

              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={grantAddress}
                  onChange={(e) =>
                    setGrantAddress(e.target.value)}
                  placeholder="Enter wallet address (0x...)"
                  className="flex-1 bg-surface_container_low dark:bg-[#211f1c]
                             rounded-lg text-body-md
                             text-on_surface dark:text-[#e8eaf0] px-4 py-2.5
                             border-0 border-b
                             border-outline_variant/20
                             focus:border-primary
                             focus:outline-none
                             placeholder:text-on_surface_variant/50
                             font-mono text-sm"
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    if (!grantAddress) return;
                    toast({
                      title: "Oracle role granted (mock)",
                      description: `ORACLE_ROLE granted to ${grantAddress.slice(0,10)}...`,
                    });
                    setGrantAddress("");
                  }}>
                  Grant Role
                </Button>
              </div>
            </div>

            {/* Bank nodes */}
            <div className="pt-6 border-t
                            border-outline_variant/20">
              <div className="flex items-center
                              justify-between mb-4">
                <h3 className="text-body-md font-bold
                                text-on_surface dark:text-[#e8eaf0]">
                  Manage Bank Nodes
                </h3>
                <span className="rounded-full px-2.5 py-1
                                  text-label-sm font-bold
                                  bg-surface_container dark:bg-[#2a2520]
                                  text-on_surface_variant dark:text-[#9ba3b8]">
                  0 Active
                </span>
              </div>

              <div className="py-10 text-center
                              bg-surface_container_low/50
                              rounded-xl border-2 border-dashed
                              border-outline_variant/30">
                <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]
                               font-medium">
                  No secondary bank nodes authorized
                </p>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8] mt-1">
                  Authorized banks can process payments but
                  cannot verify properties.
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={grantBank}
                  onChange={(e) => setGrantBank(e.target.value)}
                  placeholder="Enter bank wallet address (0x...)"
                  className="flex-1 bg-surface_container_low dark:bg-[#211f1c]
                             rounded-lg text-body-md
                             text-on_surface dark:text-[#e8eaf0] px-4 py-2.5
                             border-0 border-b
                             border-outline_variant/20
                             focus:border-primary
                             focus:outline-none
                             placeholder:text-on_surface_variant/50
                             font-mono text-sm"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (!grantBank) return;
                    toast({
                      title: "Bank role granted (mock)",
                      description: `BANK_ROLE granted to ${grantBank.slice(0,10)}...`,
                    });
                    setGrantBank("");
                  }}>
                  Grant Bank Role
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CARD 5: DANGER ZONE ── */}
      <section className="bg-surface_container_lowest dark:bg-[#1a1916]
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
              <h2 className="text-title-md font-bold text-error">
                Danger Zone
              </h2>
              <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8]">
                Critical administrative actions
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
                  Pause Contract
                </p>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8]">
                  Stops all verification processing globally.
                </p>
              </div>
              <Button
                size="sm"
                className="border border-error bg-transparent
                           text-error hover:bg-error_container
                           rounded-md">
                Pause Contract
              </Button>
            </div>

            <div className="h-px bg-error_container" />

            <div className="flex items-center
                            justify-between py-2">
              <div>
                <p className="text-body-md font-bold
                               text-on_surface dark:text-[#e8eaf0]">
                  Renounce Oracle Role
                </p>
                <p className="text-label-sm
                               text-on_surface_variant dark:text-[#9ba3b8]">
                  Irreversibly remove your administrative power.
                </p>
              </div>
              <Button
                size="sm"
                className="bg-error text-white
                           hover:bg-error/90 rounded-md">
                Renounce Role
              </Button>
            </div>

            <div className="p-4 bg-surface_container_lowest dark:bg-[#1a1916]/60
                            rounded-xl border border-error_container">
              <p className="text-label-sm text-error/80
                             leading-relaxed italic font-medium">
                <strong>Warning:</strong> Renouncing your role
                is permanent. Another oracle with OWNER_ROLE
                must be present to grant access back.
                Proceed with extreme caution.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
