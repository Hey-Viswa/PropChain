"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";
import { PropChainMark } from "@/components/shared/PropChainMark";

// ── Auth-aware CTA ──────────────────────────────────────────────────────────

function CtaButton({
  className,
  withArrow,
  darkBg,
}: {
  className?: string;
  withArrow?: boolean;
  darkBg?: boolean;
}) {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button className={className}>
          Go to Dashboard {withArrow && <ArrowRight size={15} className="ml-2" />}
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex gap-3 w-full flex-col sm:flex-row">
      <SignUpButton mode="modal">
        <Button className={className}>
          Get Started {withArrow && <ArrowRight size={15} className="ml-2" />}
        </Button>
      </SignUpButton>
      <SignInButton mode="modal">
        <Button
          variant="outline"
          className={
            darkBg
              ? "rounded-none h-12 px-8 text-sm font-semibold tracking-widest uppercase border-white/25 text-white hover:bg-white/10 bg-transparent cursor-pointer"
              : "rounded-none h-12 px-8 text-sm font-semibold tracking-widest uppercase cursor-pointer"
          }
        >
          Sign In
        </Button>
      </SignInButton>
    </div>
  );
}

function NavCta() {
  const { isSignedIn } = useUser();
  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button className="rounded-full shadow-none px-6 h-9 cursor-pointer">
          Dashboard
        </Button>
      </Link>
    );
  }
  return (
    <div className="flex gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost" className="rounded-full shadow-none px-4 h-9 cursor-pointer text-sm">
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button className="rounded-full shadow-none px-5 h-9 cursor-pointer text-sm">
          Get Started
        </Button>
      </SignUpButton>
    </div>
  );
}

function ProfileOrLogin() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return <div className="w-8 h-8 rounded-full bg-stone animate-pulse" />;
  if (isSignedIn) return <UserButton />;
  return null;
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
  { value: "$2.4B+", label: "Total Value Locked" },
  { value: "14.2k",  label: "Properties Minted" },
  { value: "1.4s",   label: "Avg. Verification" },
  { value: "32+",    label: "Jurisdictions" },
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
    <div className="min-h-screen flex flex-col font-body bg-cream">

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-cream/92 backdrop-blur-md border-b border-stone">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
              <PropChainMark size={26} />
              <span className="font-display text-[17px] tracking-tight text-on_surface">
                Prop<span className="text-primary">Chain</span>
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {["Network", "Docs", "Registry"].map((label) => (
                <Link
                  key={label}
                  href="#"
                  className="text-sm font-medium text-on_surface_variant hover:text-on_surface transition-colors duration-150 cursor-pointer"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ProfileOrLogin />
            <NavCta />
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="relative bg-[#12100E] overflow-hidden">
          {/* Architectural dot-grid background */}
          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #FAF9F6 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Subtle warm glow — top right */}
          <div
            className="absolute top-0 right-0 w-[600px] h-[500px] opacity-[0.08] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top right, #D97757 0%, transparent 65%)",
            }}
          />

          <div className="container mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 relative z-10">

            {/* Pre-headline rule + label */}
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px w-8 bg-primary" />
              <span className="text-[10px] font-semibold tracking-[0.22em] text-primary uppercase">
                Real World Asset Infrastructure
              </span>
            </div>

            {/* Massive editorial headline */}
            <div className="max-w-5xl mb-10">
              <h1
                className="font-display leading-[0.92] tracking-[-0.03em] text-[#F5F3F0]"
                style={{ fontSize: "clamp(3.2rem, 9vw, 7.5rem)" }}
              >
                Real Estate.
              </h1>
              <h1
                className="font-display leading-[0.92] tracking-[-0.03em] text-primary"
                style={{ fontSize: "clamp(3.2rem, 9vw, 7.5rem)" }}
              >
                On&#8209;Chain.
              </h1>
            </div>

            {/* Divider */}
            <div className="w-full max-w-4xl h-px bg-[#FAF9F6]/10 mb-10" />

            {/* Sub-headline + CTAs */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-24 items-start">
              <p className="text-[#9B9690] text-base lg:text-lg leading-relaxed max-w-[420px]">
                PropChain transforms physical property into liquid digital assets — unified legal compliance, institutional security, and AI verification on a single protocol.
              </p>
              <div className="flex flex-col gap-4 flex-shrink-0 min-w-[220px]">
                <CtaButton
                  className="bg-primary hover:bg-primary_container text-white rounded-none h-12 px-8 text-sm font-semibold tracking-widest uppercase cursor-pointer"
                  withArrow
                  darkBg
                />
                <Link
                  href="#"
                  className="flex items-center gap-1.5 text-sm text-[#6B6560] hover:text-[#9B9690] transition-colors duration-150 cursor-pointer group"
                >
                  <span>View Network Data</span>
                  <ArrowUpRight
                    size={13}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
                  />
                </Link>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-20 pt-10 border-t border-[#FAF9F6]/10 grid grid-cols-2 md:grid-cols-4">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="px-6 first:pl-0 border-l border-[#FAF9F6]/10 first:border-l-0 py-2"
                >
                  <p className="font-display text-3xl lg:text-4xl text-[#F5F3F0] tracking-tight mb-1">
                    {value}
                  </p>
                  <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#6B6560]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ───────────────────────────────────────────── */}
        <section className="bg-sand border-y border-stone py-[18px]">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-on_surface_variant/40 flex-shrink-0 pr-2 border-r border-stone">
                Trusted By
              </span>
              {["Chainlink", "Ethereum L2", "Fireblocks", "Circle", "Coinbase Prime"].map((name) => (
                <span key={name} className="text-sm font-medium text-on_surface_variant/35 tracking-wide">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────── */}
        <section className="bg-cream py-24 lg:py-32">
          <div className="container mx-auto px-6">
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-12 border-b border-stone">
              <h2
                className="font-display leading-[1.03] tracking-[-0.025em] text-on_surface max-w-lg"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
              >
                The infrastructure layer for property finance.
              </h2>
              <p className="text-on_surface_variant text-sm max-w-[280px] leading-relaxed">
                Every component engineered for institutional-grade real estate tokenization at global scale.
              </p>
            </div>

            {/* Editorial numbered feature list */}
            <div>
              {FEATURES.map((f) => (
                <div
                  key={f.num}
                  className="group flex flex-col md:flex-row md:items-start gap-6 md:gap-12 py-9 border-b border-stone last:border-b-0 hover:bg-sand/50 transition-colors duration-200 px-3 -mx-3 cursor-default"
                >
                  <span className="font-display text-[3.5rem] leading-none text-primary/20 group-hover:text-primary/50 transition-colors duration-200 w-20 flex-shrink-0 select-none">
                    {f.num}
                  </span>
                  <div className="flex-1 min-w-0 md:pt-1">
                    <h3 className="font-display text-xl lg:text-2xl text-on_surface mb-3 tracking-tight leading-snug">
                      {f.title}
                    </h3>
                    <p className="text-on_surface_variant text-sm leading-relaxed max-w-lg">
                      {f.body}
                    </p>
                  </div>
                  <div className="flex-shrink-0 md:pt-2">
                    <span className="inline-block border border-stone text-on_surface_variant text-[9px] tracking-[0.14em] uppercase font-semibold px-3 py-1.5">
                      {f.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ─────────────────────────────────────────────── */}
        <section className="bg-[#12100E] py-24 lg:py-32">
          <div className="container mx-auto px-6">
            {/* Section header */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-primary" />
                <span className="text-[10px] font-semibold tracking-[0.22em] text-primary uppercase">
                  How It Works
                </span>
              </div>
              <h2
                className="font-display text-[#F5F3F0] tracking-[-0.025em] leading-tight max-w-xl"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}
              >
                From deed to digital asset in three steps.
              </h2>
            </div>

            {/* 3-step bordered grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 border border-[#FAF9F6]/10 divide-y md:divide-y-0 md:divide-x divide-[#FAF9F6]/10">
              {PROCESS.map((s) => (
                <div key={s.step} className="p-8 lg:p-10 flex flex-col gap-8">
                  <span className="font-display text-[5rem] leading-none text-primary/15 select-none">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.2rem] text-[#F5F3F0] mb-3 tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-[#6B6560] text-sm leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ────────────────────────────────────────────── */}
        <section className="bg-primary py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
              <div>
                <h2
                  className="font-display text-white leading-[1.02] tracking-[-0.025em] mb-5"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  Ready to tokenize your first asset?
                </h2>
                <p className="text-white/65 text-base max-w-md leading-relaxed">
                  Join 12,000+ investors and developers building on the PropChain registry.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <CtaButton
                  className="bg-white text-primary hover:bg-white/90 rounded-none h-12 px-8 text-sm font-semibold tracking-widest uppercase cursor-pointer"
                  withArrow
                />
                <Button
                  variant="outline"
                  className="rounded-none h-12 px-8 text-sm font-semibold tracking-widest uppercase border-white/25 text-white hover:bg-white/10 bg-transparent cursor-pointer"
                >
                  Developer Hub
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-[#0E0C0B] border-t border-[#FAF9F6]/8 pt-16 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand col */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-5 cursor-pointer">
                <PropChainMark size={22} />
                <span className="font-display text-[16px] tracking-tight text-[#F5F3F0]">
                  Prop<span className="text-primary">Chain</span>
                </span>
              </Link>
              <p className="text-sm text-[#5A5450] leading-relaxed max-w-[200px]">
                The institutional gateway for RWA tokenization on-chain.
              </p>
            </div>

            {/* Link cols */}
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#6B6560] mb-5">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-sm text-[#5A5450] hover:text-[#F5F3F0] transition-colors duration-150 cursor-pointer"
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
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#FAF9F6]/8 text-[11px] text-[#3A3530]">
            <p>© 2026 PropChain. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((l) => (
                <Link
                  key={l}
                  href="#"
                  className="hover:text-[#5A5450] transition-colors duration-150 cursor-pointer"
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
