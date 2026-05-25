import Link from "next/link";
import {
  BookOpen, Code2, Shield, Zap,
  ArrowRight, FileText, Terminal, Key,
  Database, Globe, BarChart,
} from "lucide-react";

const CATEGORIES = [
  {
    icon: Zap,
    title: "Getting Started",
    desc: "Install the SDK, authenticate your account, and mint your first property token in under 10 minutes.",
    color: "text-primary bg-primary/10",
    articles: ["Quickstart Guide", "Authentication", "First Mint", "Environment Setup"],
  },
  {
    icon: Code2,
    title: "API Reference",
    desc: "Full REST and WebSocket API documentation with live request examples and response schemas.",
    color: "text-success bg-success/10",
    articles: ["REST Endpoints", "WebSocket Streams", "Webhooks", "Rate Limits"],
  },
  {
    icon: Shield,
    title: "Compliance & KYC",
    desc: "Understand AML/KYC requirements, jurisdiction rules, and how PropChain handles regulatory reporting.",
    color: "text-warning bg-warning/10",
    articles: ["KYC Flow", "AML Checks", "Jurisdiction Guide", "Audit Exports"],
  },
  {
    icon: Database,
    title: "Smart Contracts",
    desc: "ERC-1155 token specification, on-chain governance, and verified contract addresses by network.",
    color: "text-muted-foreground bg-muted/60",
    articles: ["Token Standard", "Contract Addresses", "Events & ABIs", "Upgradability"],
  },
  {
    icon: Globe,
    title: "Oracle Network",
    desc: "How Chainlink-backed PropChain oracles verify real-world property data and push it on-chain.",
    color: "text-primary bg-primary/10",
    articles: ["Oracle Architecture", "Data Sources", "Verification Flow", "Becoming an Oracle"],
  },
  {
    icon: BarChart,
    title: "Analytics & Reporting",
    desc: "Export portfolio data, generate compliance reports, and integrate with BI tools via our Data API.",
    color: "text-success bg-success/10",
    articles: ["Portfolio Export", "Compliance Reports", "Data API", "Webhooks"],
  },
];

const QUICK_LINKS = [
  { icon: Terminal, label: "SDK Quickstart",      href: "#" },
  { icon: Key,      label: "API Keys",             href: "#" },
  { icon: FileText, label: "Contract ABIs",        href: "#" },
  { icon: BookOpen, label: "Changelog",            href: "#" },
];

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">

      {/* Header */}
      <div className="pt-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-6 bg-primary" />
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Documentation</span>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-3">
          PropChain Developer Docs
        </h1>
        <p className="text-muted-foreground text-base font-medium max-w-2xl">
          Everything you need to integrate PropChain into your application — APIs, SDKs, smart contract references, and compliance guides.
        </p>

        {/* Search bar */}
        <div className="mt-6 relative max-w-xl">
          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full pl-11 pr-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Quick links */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground/50 mb-4">Quick Access</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer"
            >
              <Icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              <span className="text-[12px] font-semibold text-foreground group-hover:text-primary transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground/50 mb-4">Browse by Category</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map(({ icon: Icon, title, desc, color, articles }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 hover:border-primary/20 hover:shadow-floating transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-bold text-foreground mb-1">{title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
              <div className="space-y-1 pt-1 border-t border-border">
                {articles.map((a) => (
                  <div
                    key={a}
                    className="flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg hover:bg-muted/40 transition-colors group/item cursor-pointer"
                  >
                    <span className="text-[11px] font-semibold text-muted-foreground group-hover/item:text-foreground transition-colors">
                      {a}
                    </span>
                    <ArrowRight size={11} className="text-muted-foreground/40 group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-primary/8 border border-primary/15 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-[15px] font-bold text-foreground mb-1">Need help integrating?</h3>
          <p className="text-[12px] text-muted-foreground">Our developer relations team is available for enterprise integration support.</p>
        </div>
        <Link
          href="#"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-[11px] font-bold tracking-widest uppercase hover:bg-primary_container transition-colors whitespace-nowrap cursor-pointer shadow-floating"
        >
          Contact DevRel <ArrowRight size={13} />
        </Link>
      </div>

    </div>
  );
}
