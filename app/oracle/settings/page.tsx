"use client";

import OracleGuard from "@/components/shared/OracleGuard";
import { useWallet } from "@/hooks/useWallet";
import {
  Shield, Copy, CheckCircle, ExternalLink,
  SlidersHorizontal, BarChart2, Users,
  AlertTriangle, ChevronRight, Bell, User,
  Plus, Activity, Database, History, Globe
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

export default function OracleSettingsPage() {
  return (
    <OracleGuard>
      <div className="max-w-5xl mx-auto pb-20">
        <OracleSettingsContent />
      </div>
    </OracleGuard>
  );
}

function OracleSettingsContent() {
  const { address, chain } = useWallet();
  const { toast } = useToast();

  const [copiedWallet, setCopiedWallet]     = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [threshold, setThreshold]           = useState([50]);
  const [manualReview, setManualReview]     = useState(false);
  const [highlightFraud, setHighlightFraud] = useState(true);
  const [grantAddress, setGrantAddress]     = useState("");

  const truncate = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";

  const copyToClipboard = (text: string, setter: (v: boolean) => void, label: string) => {
    navigator.clipboard.writeText(text);
    setter(true);
    toast({ title: "Copied", description: `${label} address copied to clipboard.` });
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">
          Oracle Configuration
        </h1>
        <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] mt-1">
          Manage institutional verification logic and node authority.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: IDENTITY & STATUS */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-primary/10">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-base">Node Identity</CardTitle>
              <CardDescription>On-chain authority status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-on_surface_variant/60 mb-2">Contract Role</p>
                <Badge className="bg-primary_fixed text-primary font-mono py-1 px-3">ORACLE_ROLE</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-sand dark:bg-[#211f1c] border border-stone/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-on_surface_variant/60 uppercase mb-1">Operator Wallet</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs truncate">{truncate(address ?? "")}</span>
                    <Button variant="ghost" size="icon-xs" onClick={() => copyToClipboard(address ?? "", setCopiedWallet, "Wallet")}>
                      {copiedWallet ? <CheckCircle className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sand dark:bg-[#211f1c] border border-stone/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-on_surface_variant/60 uppercase mb-1">Registry Contract</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs truncate">{truncate(CONTRACT_ADDRESS)}</span>
                    <Button variant="ghost" size="icon-xs" onClick={() => copyToClipboard(CONTRACT_ADDRESS, setCopiedContract, "Contract")}>
                      {copiedContract ? <CheckCircle className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full h-10 text-xs font-bold uppercase tracking-wider gap-2" asChild>
                <a href={`https://mumbai.polygonscan.com/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-3.5 h-3.5" />
                  Polygonscan
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on_surface_variant">Node Status</span>
                <span className="flex items-center gap-1.5 text-success font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on_surface_variant">Sync State</span>
                <span className="font-medium">100% (Synced)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on_surface_variant">Latency</span>
                <span className="font-medium text-primary">42ms</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: PREFERENCES & ACTIONS */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-base">Verification Preferences</CardTitle>
                  <CardDescription>Automated validation and risk thresholds</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 p-0">
              <div className="px-6 py-5">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-sm font-bold">Auto-reject Threshold</p>
                    <p className="text-xs text-on_surface_variant mt-0.5">Reject if confidence is below {threshold[0]}%</p>
                  </div>
                  <span className="text-lg font-display font-bold text-primary">{threshold[0]}%</span>
                </div>
                <Slider 
                  value={threshold} 
                  onValueChange={setThreshold} 
                  max={100} 
                  step={1} 
                  className="py-4"
                />
              </div>

              <Separator />

              <div className="px-6 py-5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold">Default Rejection Reason</p>
                  <p className="text-xs text-on_surface_variant mt-0.5">Preset text for failed property audits</p>
                </div>
                <Select defaultValue="insufficient">
                  <SelectTrigger className="w-[240px] h-10">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insufficient">Insufficient documentation</SelectItem>
                    <SelectItem value="legal-mismatch">Mismatch in legal titles</SelectItem>
                    <SelectItem value="invalid-signature">Invalid digital signature</SelectItem>
                    <SelectItem value="ulp-mismatch">ULPIN does not match records</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="px-6 py-5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold">Manual Review Trigger</p>
                  <p className="text-xs text-on_surface_variant mt-0.5">Force oracle review for all cross-border transactions</p>
                </div>
                <Switch checked={manualReview} onCheckedChange={setManualReview} />
              </div>

              <Separator />

              <div className="px-6 py-5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold">Fraud Risk Analysis</p>
                  <p className="text-xs text-on_surface_variant mt-0.5">Real-time flagging for suspicious wallet behaviors</p>
                </div>
                <Switch checked={highlightFraud} onCheckedChange={setHighlightFraud} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-base">Role Management</CardTitle>
                  <CardDescription>Delegate authority to sub-nodes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  placeholder="Enter 0x address..." 
                  className="flex-1 h-11 font-mono text-sm"
                  value={grantAddress}
                  onChange={(e) => setGrantAddress(e.target.value)}
                />
                <Button 
                  className="h-11 px-8 font-bold uppercase tracking-wider text-xs"
                  onClick={() => {
                    if (!grantAddress) return;
                    toast({ title: "Role Granted", description: "Node authorized on-chain." });
                    setGrantAddress("");
                  }}
                >
                  Grant Role
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <CardTitle className="text-base">Danger Zone</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold">Emergency Pause</p>
                  <p className="text-xs text-on_surface_variant mt-0.5">Stop all contract interactions immediately</p>
                </div>
                <Button variant="destructive" size="sm" className="h-9 px-5 font-bold uppercase tracking-wider text-[10px]">
                  Pause Node
                </Button>
              </div>
              <Separator className="bg-destructive/10" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold">Renounce Authority</p>
                  <p className="text-xs text-on_surface_variant mt-0.5">Irreversibly remove your oracle role</p>
                </div>
                <Button variant="destructive" size="sm" className="h-9 px-5 font-bold uppercase tracking-wider text-[10px]">
                  Renounce
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
