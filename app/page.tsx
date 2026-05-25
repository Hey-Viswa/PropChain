"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, ArrowRight, ShieldCheck, 
  ChevronRight, Globe, BarChart3, Database, 
  Activity, Zap, Box
} from "lucide-react";
import { PropChainMark } from "@/components/shared/PropChainMark";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/shared/ThemeToggle";

// ── Components ──────────────────────────────────────────────────────────────

function CtaButton({ className, withArrow = false, darkBg = false }: { className?: string; withArrow?: boolean; darkBg?: boolean }) {
  const { isSignedIn } = useAuth();
  const label = isSignedIn ? "Go to Dashboard" : "Initiate Protocol";

  return isSignedIn ? (
    <Link href="/dashboard" className="w-full sm:w-auto">
      <Button className={cn("rounded-xl h-14 px-10 text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer shadow-floating transition-all active:scale-95 flex items-center justify-center", className)}>
        {label} {withArrow && <ArrowRight className="ml-2 w-4 h-4" />}
      </Button>
    </Link>
  ) : (
    <SignUpButton mode="modal">
      <Button className={cn("rounded-xl h-14 px-10 text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer shadow-floating transition-all active:scale-95 flex items-center justify-center", className)}>
        {label} {withArrow && <ArrowRight className="ml-2 w-4 h-4" />}
      </Button>
    </SignUpButton>
  );
}

function NavCta() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <div className="h-10 w-24 bg-stone/20 rounded-xl animate-pulse" />;

  return isSignedIn ? (
    <Link href="/dashboard">
      <Button size="sm" className="bg-primary hover:bg-primary_container text-white rounded-xl h-10 px-6 text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-all active:scale-95">
        Dashboard
      </Button>
    </Link>
  ) : (
    <SignUpButton mode="modal">
      <Button size="sm" className="bg-primary hover:bg-primary_container text-white rounded-xl h-10 px-6 text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-all active:scale-95">
        Institutional Access
      </Button>
    </SignUpButton>
  );
}

function ProfileOrLogin() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <div className="h-10 w-10 bg-stone/20 rounded-xl animate-pulse" />;

  return isSignedIn ? (
    <div className="h-10 w-10 flex items-center justify-center">
      <UserButton />
    </div>
  ) : (
    <SignInButton mode="modal">
      <Button variant="ghost" className="text-muted-foreground hover:text-primary rounded-xl h-10 px-4 text-[10px] font-bold tracking-widest uppercase cursor-pointer">
        Log In
      </Button>
    </SignInButton>
  );
}

// ── Static data ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    num: "01",
    title: "AI Document Verification",
    body: "Neural audit of titles, deeds, and zoning permits in under 2 seconds. Replaces weeks of manual legal review with 99.9% accuracy.",
    tag: "Neural Audit V4",
  },
  {
    num: "02",
    title: "Immutable On-Chain Ownership",
    body: "ERC-1155 fractional tokens on Ethereum L2. Transparent, tamper-proof property records permanently secured by the network.",
    tag: "ERC-1155",
  },
  {
    num: "03",
    title: "Institutional Compliance",
    body: "Integrated with Chainlink oracles and Tier-1 custodians. Meets global AML and KYC standards natively — no third-party middleware.",
    tag: "Chainlink Oracle",
  },
  {
    num: "04",
    title: "24/7 Global Liquidity",
    body: "Exit your position in seconds on the PropChain DEX. Institutional market makers back every liquidity pool, eliminating 6-month wait periods.",
    tag: "Instant Settlement",
  },
];

const STATS = [
  { value: "$0", label: "Total Value Locked" },
  { value: "0",  label: "Properties Minted" },
  { value: "0s", label: "Avg. Verification" },
  { value: "0",  label: "Jurisdictions" },
];

const PROCESS = [
  {
    step: "01",
    title: "Submit & Verify",
    body: "Upload your property documents. PropChain AI performs a full legal and compliance audit in seconds.",
  },
  {
    step: "02",
    title: "Mint Your Token",
    body: "Receive ERC-1155 tokens representing fractional ownership, backed 1:1 by verified real-world assets.",
  },
  {
    step: "03",
    title: "Trade & Earn",
    body: "List fractions on the PropChain DEX or earn yield through liquidity pools. No lockups, no intermediaries.",
  },
];

const FOOTER_COLS = [
  {
    title: "Product",
    links: ["Asset Marketplace", "Developer SDK", "Compliance Engine", "Oracle Nodes"],
  },
  {
    title: "Company",
    links: ["About PropChain", "Network Status", "Legal & Regulatory", "Contact"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Audit Reports", "Community Forum", "Governance"],
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-body bg-background text-foreground selection:bg-primary/10 selection:text-primary">

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-fluid-gap h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
              <PropChainMark size={26} />
              <span className="font-display text-[17px] tracking-tight text-foreground font-bold">
                Prop<span className="text-primary">Chain</span>
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {[
                { l: "Network",  h: "/network" },
                { l: "Docs",     h: "/docs" },
                { l: "Registry", h: "/registry" }
              ].map((link) => (
                <Link
                  key={link.l}
                  href={link.h}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-150 cursor-pointer"
                >
                  {link.l}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="pr-4 border-r border-border h-8 flex items-center">
              <ThemeToggle />
            </div>
            <ProfileOrLogin />
            <NavCta />
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="relative bg-[#12100E] dark:bg-[#090806] overflow-hidden section-padding">
          {/* Architectural dot-grid background */}
          <div
            className="absolute inset-0 opacity-[0.18] dark:opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(250, 249, 246, 0.42) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 18%, rgba(217, 119, 87, 0.18), transparent 42%), radial-gradient(circle at 80% 0%, rgba(255, 221, 180, 0.1), transparent 36%)",
            }}
          />

          <div className="container mx-auto px-fluid-gap relative z-10">

            {/* Pre-headline rule + label */}
            <div className="flex items-center gap-3 mb-12 animate-fade-in">
              <div className="h-px w-8 bg-primary" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">
                Real World Asset Infrastructure
              </span>
            </div>

            {/* Massive editorial headline */}
            <div className="max-w-6xl mb-12 space-y-2 animate-fade-up">
              <h1 className="text-display-lg text-[#F5F3F0]">
                Real Estate.
              </h1>
              <h1 className="text-display-lg text-primary">
                On&#8209;Chain.
              </h1>
            </div>

            {/* Divider */}
            <div className="w-full max-w-4xl h-px bg-[#FAF9F6]/10 mb-12" />

            {/* Sub-headline + CTAs */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-[#b8b1a9] dark:text-[#9B9690] text-lg lg:text-xl leading-relaxed max-w-[480px] text-balance">
                PropChain transforms physical property into liquid digital assets — unified legal compliance, institutional security, and AI verification on a single protocol.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-8 flex-shrink-0">
                <CtaButton
                  className="bg-primary hover:bg-primary_container text-white rounded-xl h-14 px-10 text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer shadow-floating transition-all active:scale-95 flex items-center justify-center"
                  withArrow
                  darkBg
                />
                <Link
                  href="/network"
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8b1a9] dark:text-[#9B9690] hover:text-white transition-colors duration-150 cursor-pointer group whitespace-nowrap"
                >
                  <span>View Network Data</span>
                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
                  />
                </Link>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-24 pt-12 border-t border-[#FAF9F6]/15 dark:border-[#FAF9F6]/10 grid grid-cols-2 md:grid-cols-4 gap-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="px-8 first:pl-0 border-l border-[#FAF9F6]/15 dark:border-[#FAF9F6]/10 first:border-l-0"
                >
                  <p className="font-display text-4xl lg:text-5xl text-[#F5F3F0] font-bold tracking-tight mb-2">
                    {value}
                  </p>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8c847b] dark:text-[#6B6560]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ───────────────────────────────────────────── */}
        <section className="bg-muted/30 border-y border-border py-6">
          <div className="container mx-auto px-fluid-gap">
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-muted-foreground flex-shrink-0 pr-4 border-r border-border">
                Institutional Partners
              </span>
              {["Chainlink", "Ethereum L2", "Fireblocks", "Circle", "Coinbase Prime"].map((name) => (
                <span key={name} className="text-[11px] font-bold text-muted-foreground tracking-[0.15em] uppercase hover:text-primary transition-colors cursor-default">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────── */}
        <section className="bg-background section-padding">
          <div className="container mx-auto px-fluid-gap">
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-24 gap-12 pb-16 border-b border-border">
              <h2 className="text-fluid-h1 text-foreground max-w-2xl text-balance font-bold leading-[1.1]">
                The infrastructure layer for property finance.
              </h2>
              <p className="text-muted-foreground text-lg max-w-[380px] leading-relaxed font-medium md:pt-2">
                Every component engineered for institutional-grade real estate tokenization at global scale.
              </p>
            </div>

            {/* Editorial numbered feature list */}
            <div className="space-y-0">
              {FEATURES.map((f, i) => (
                <div
                  key={f.num}
                  className="group flex flex-col md:flex-row md:items-start gap-8 md:gap-16 py-12 border-b border-border last:border-b-0 hover:bg-muted/30 transition-all duration-300 px-6 -mx-6 rounded-2xl cursor-default"
                >
                  <span className="font-display text-[5rem] leading-none font-black text-primary/10 group-hover:text-primary/30 transition-colors duration-300 w-24 flex-shrink-0 select-none">
                    {f.num}
                  </span>
                  <div className="flex-1 min-w-0 md:pt-4">
                    <h3 className="text-fluid-h2 text-foreground mb-4">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-xl font-medium">
                      {f.body}
                    </p>
                  </div>
                  <div className="flex-shrink-0 md:pt-6">
                    <span className="inline-block border-2 border-border text-muted-foreground text-[10px] tracking-[0.2em] uppercase font-bold px-4 py-2 rounded-xl group-hover:border-primary group-hover:text-primary transition-colors">
                      {f.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ─────────────────────────────────────────────── */}
        <section className="bg-[#12100E] section-padding">
          <div className="container mx-auto px-fluid-gap">
            {/* Section header */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-primary" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">
                  Institutional Protocol
                </span>
              </div>
              <h2 className="text-fluid-h1 text-[#F5F3F0] max-w-2xl font-bold leading-[1.1]">
                From deed to digital asset in three steps.
              </h2>
            </div>

            {/* 3-step bordered grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 border border-[#FAF9F6]/10 divide-y md:divide-y-0 md:divide-x divide-[#FAF9F6]/10 rounded-3xl overflow-hidden">
              {PROCESS.map((s) => (
                <div key={s.step} className="p-10 lg:p-12 flex flex-col gap-10 hover:bg-white/[0.02] transition-colors">
                  <span className="font-display text-[6rem] leading-none text-primary/10 select-none font-black">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-[#F5F3F0] mb-4 font-bold tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-[#9B9690] text-base leading-relaxed font-medium">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ────────────────────────────────────────────── */}
        <section className="bg-primary section-padding relative overflow-hidden">
          <div className="container mx-auto px-fluid-gap relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="text-center lg:text-left">
                <h2 className="text-fluid-h1 text-white font-bold leading-[1.05] tracking-tight mb-6">
                  Ready to tokenize?
                </h2>
                <p className="text-white/80 text-xl max-w-xl leading-relaxed font-medium">
                  Join institutional partners building the future of property finance on PropChain.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 flex-shrink-0">
                <CtaButton
                  className="bg-white text-primary hover:bg-stone/10 rounded-xl h-16 px-12 text-xs font-black tracking-widest uppercase cursor-pointer shadow-2xl"
                  withArrow
                />
                <Button
                  variant="outline"
                  className="rounded-xl h-16 px-10 text-xs font-black tracking-widest uppercase border-white/30 text-white hover:bg-white/10 bg-transparent cursor-pointer"
                >
                  Network Status
                </Button>
              </div>
            </div>
          </div>
          {/* subtle decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
        </section>

      </main>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-[#0E0C0B] border-t border-[#FAF9F6]/8 pt-20 pb-12">
        <div className="container mx-auto px-fluid-gap">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            {/* Brand col */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-8 cursor-pointer group">
                <PropChainMark size={28} />
                <span className="font-display text-[18px] font-black tracking-tight text-[#F5F3F0]">
                  Prop<span className="text-primary">Chain</span>
                </span>
              </Link>
              <p className="text-base text-[#6d6861] leading-relaxed max-w-[220px] font-medium">
                The global gateway for institutional RWA tokenization.
              </p>
            </div>

            {/* Link cols */}
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#6B6560] mb-8">
                  {col.title}
                </h4>
                <ul className="space-y-4">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-[13px] font-bold text-[#5A5450] hover:text-white transition-colors duration-150 cursor-pointer"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-[#FAF9F6]/8 text-[11px] font-bold text-[#3A3530] uppercase tracking-widest">
            <p>© 2026 PropChain Institutional. SEC Compliant.</p>
            <div className="flex gap-8 mt-6 md:mt-0">
              {["Privacy", "Terms", "Compliance"].map((l) => (
                <Link
                  key={l}
                  href="#"
                  className="hover:text-[#6d6861] transition-colors duration-150 cursor-pointer"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
