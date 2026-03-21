"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Shield, Asterisk, Lock, CheckCircle2, 
  ArrowRight, RefreshCcw, Bell, UserCircle2, Sparkles, Building 
} from "lucide-react";
import Image from "next/image";
import { SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";

function CtaButton({ className, children, withArrow }: { className?: string, children?: React.ReactNode, withArrow?: boolean }) {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button className={className}>
          Go to Dashboard {withArrow && <ArrowRight size={16} className="ml-2" />}
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex gap-2 w-full flex-col sm:flex-row">
      <SignUpButton mode="modal">
        <Button className={className}>Get Started {withArrow && <ArrowRight size={16} className="ml-2" />}</Button>
      </SignUpButton>
      <SignInButton mode="modal">
        <Button variant="outline" className={className}>Sign In</Button>
      </SignInButton>
    </div>
  );
}

function NavCta() {
  const { isSignedIn } = useUser();
  
  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button className="rounded-full shadow-none px-6 h-9">Go to Dashboard</Button>
      </Link>
    );
  }
  
  return (
    <div className="flex gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost" className="rounded-full shadow-none px-4 h-9">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button className="rounded-full shadow-none px-6 h-9">Get Started</Button>
      </SignUpButton>
    </div>
  );
}

function ProfileOrLogin() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return <div className="w-8 h-8 rounded-full bg-surface_container dark:bg-[#1c2333] animate-shimmer" />;
  if (isSignedIn) return <UserButton />;
  return (
    <button className="text-on_surface_variant dark:text-[#9ba3b8] hover:text-on_surface dark:hover:text-[#e8eaf0] transition-colors p-1 mr-2">
      <UserCircle2 size={18} />
    </button>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface_bright flex flex-col font-body">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-outline_variant/20 bg-surface_bright/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary font-display tracking-tight">
                Prop<span className="text-on_surface dark:text-[#e8eaf0]">Chain</span>
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="#" className="text-sm font-medium text-on_surface_variant dark:text-[#9ba3b8] hover:text-primary transition-colors">
                Network
              </Link>
              <Link href="#" className="text-sm font-medium text-on_surface_variant dark:text-[#9ba3b8] hover:text-primary transition-colors">
                Docs
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-shimmer" />
              <span className="text-xs font-semibold text-success tracking-wide">Oracle Node Active</span>
            </div>
            
            <button className="text-on_surface_variant dark:text-[#9ba3b8] hover:text-on_surface dark:hover:text-[#e8eaf0] dark:text-[#e8eaf0] transition-colors p-1">
              <Bell size={18} />
            </button>
            <ProfileOrLogin />
            
            <NavCta />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-surface_container_lowest to-surface_container_low/30 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="max-w-xl mx-auto lg:mx-0 z-10 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-6 sm:mb-8">
                <Sparkles size={14} className="fill-secondary/20" />
                <span className="text-xs font-bold tracking-wide uppercase">AI-Powered Infrastructure</span>
              </div>
              
              <h1 className="text-display font-display text-on_surface dark:text-[#e8eaf0] mb-6 leading-[1.05]">
                Tokenize Real-World <span className="text-primary">Real Estate</span> with AI & Blockchain
              </h1>
              
              <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8] mb-8 xl:mb-10 max-w-lg leading-relaxed text-lg">
                PropChain transforms physical property into liquid digital assets. Unified legal compliance, institutional-grade security, and automated AI verification.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12 sm:mb-16">
                <CtaButton className="rounded-full h-12 px-8 text-sm font-semibold shadow-floating" withArrow />
                <Button variant="secondary" size="lg" className="rounded-full h-12 px-8 text-sm font-semibold bg-surface_container dark:bg-[#1c2333] hover:bg-surface_container_high text-on_surface dark:text-[#e8eaf0]">
                  View Network Data
                </Button>
              </div>
              
              <div className="flex items-center gap-6 grayscale text-on_surface_variant">
                <p className="text-xs font-semibold tracking-wider text-on_surface_variant dark:text-[#9ba3b8] uppercase">Trusted By</p>
                <Building2 size={24} />
                <Shield size={24} />
                <Asterisk size={24} />
              </div>
            </div>

            {/* Hero Card Image */}
            <div className="relative mx-auto lg:mx-0 w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end perspective-1000">
              {/* Main Card */}
              <div className="relative w-full max-w-md bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-4 shadow-floating border border-outline_variant/20 -rotate-1 hover:rotate-0 transition-transform duration-500 ease-out z-10">
                <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden mb-5">
                  <Image 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" 
                    alt="The Azure Heights" 
                    fill 
                    className="object-cover"
                    priority
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">The Azure Heights</h3>
                      <p className="text-xs font-mono text-on_surface_variant dark:text-[#9ba3b8] mt-1">ID: PC-8829 NYC</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] px-2 py-0.5 rounded-sm">
                      VERIFIED
                    </Badge>
                  </div>
                  
                  <div className="flex gap-8 border-t border-outline_variant/20 pt-4 mt-2">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-on_surface_variant dark:text-[#9ba3b8] mb-1">TVL</p>
                      <p className="font-semibold text-on_surface dark:text-[#e8eaf0]">$4.2M</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-on_surface_variant dark:text-[#9ba3b8] mb-1">Fractions</p>
                      <p className="font-semibold text-on_surface dark:text-[#e8eaf0]">1.2k</p>
                    </div>
                  </div>
                </div>

                {/* Floating status badge */}
                <div className="absolute -bottom-6 -left-6 sm:-left-10 bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-3 sm:p-4 shadow-card border border-outline_variant/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom flex-shrink-0 z-20">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on_surface dark:text-[#e8eaf0] leading-tight">AI Document Audit Complete</p>
                  </div>
                </div>
              </div>

              {/* Decorative blobs behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 bg-surface_container_lowest dark:bg-[#131820] border-t border-outline_variant/10">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-on_surface dark:text-[#e8eaf0] mb-6 leading-tight">
                Reinventing Real Estate Finance
              </h2>
              <p className="text-on_surface_variant dark:text-[#9ba3b8] text-lg">
                We replace legacy paper trails with high-frequency blockchain rails, verified by advanced neural networks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div className="lg:col-span-1 bg-surface_container_lowest dark:bg-[#131820] border border-outline_variant/20 shadow-[0_8px_24px_rgba(0,0,0,0.04)] rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-3">AI Document Verification</h3>
                  <p className="text-on_surface_variant dark:text-[#9ba3b8] text-sm leading-relaxed mb-8">
                    Our PropChain AI automatically audits titles, deeds, and zoning permits in seconds. 99.9% accuracy compared to manual legal reviews that take weeks.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-surface_container dark:bg-[#1c2333] text-xs font-medium text-on_surface_variant dark:text-[#9ba3b8] rounded-md shadow-none hover:bg-surface_container dark:hover:bg-[#1c2333] dark:bg-[#1c2333]">
                    Neural Audit V4
                  </Badge>
                  <Badge variant="outline" className="bg-surface_container dark:bg-[#1c2333] text-xs font-medium text-on_surface_variant dark:text-[#9ba3b8] rounded-md shadow-none hover:bg-surface_container dark:hover:bg-[#1c2333] dark:bg-[#1c2333]">
                    NLP Deed Scanning
                  </Badge>
                </div>
              </div>

              {/* Card 2 */}
              <div className="lg:col-span-1 bg-primary text-on_primary rounded-2xl p-8 flex flex-col justify-between shadow-floating hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-on_primary/20 flex items-center justify-center text-on_primary mb-6 backdrop-blur-sm">
                    <Lock size={18} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">Immutable Ownership</h3>
                  <p className="text-primary_fixed text-sm leading-relaxed mb-6 opacity-90">
                    Secured by the Ethereum L2 network. Your property title is fractionalized into ERC-1155 tokens, ensuring transparent and unalterable records.
                  </p>
                </div>
                {/* Decorative circle */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
              </div>

              {/* Card 3 */}
              <div className="lg:col-span-1 bg-surface_container_low dark:bg-[#161b27] border border-outline_variant/20 rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                    <Building size={18} />
                  </div>
                  <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-3">Institutional Trust</h3>
                  <p className="text-on_surface_variant dark:text-[#9ba3b8] text-sm leading-relaxed">
                    Integrated with Chainlink oracles and Tier-1 custodians to bridge the gap between DeFi and global banking standards.
                  </p>
                </div>
              </div>

              {/* Card 4 - Wide */}
              <div className="md:col-span-2 lg:col-span-3 bg-surface_container_lowest dark:bg-[#131820] border border-outline_variant/20 shadow-[0_8px_24px_rgba(0,0,0,0.04)] rounded-2xl p-8 lg:p-12 overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-4">24/7 Global Liquidity</h3>
                  <p className="text-on_surface_variant dark:text-[#9ba3b8] text-base leading-relaxed max-w-xl">
                    Exit your position in seconds on the PropChain DEX. No more waiting 6 months for a buyer. Liquidity pools backed by institutional market makers.
                  </p>
                </div>
                <div className="w-full md:w-auto flex-shrink-0 flex justify-center">
                  <div className="w-48 h-32 bg-primary rounded-xl -rotate-6 shadow-floating flex items-center justify-center translate-x-4">
                    <RefreshCcw size={48} className="text-white opacity-80" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-surface_container_low dark:bg-[#161b27] border-y border-outline_variant/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-outline_variant/20 text-center md:text-left">
              <div className="pl-0">
                <p className="text-[10px] sm:text-xs font-bold tracking-wider text-on_surface_variant dark:text-[#9ba3b8] uppercase mb-2">Total Value Locked</p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-on_surface dark:text-[#e8eaf0] tracking-tight">$2.4B+</p>
              </div>
              <div className="md:pl-12">
                <p className="text-[10px] sm:text-xs font-bold tracking-wider text-on_surface_variant dark:text-[#9ba3b8] uppercase mb-2">Properties Minted</p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-on_surface dark:text-[#e8eaf0] tracking-tight">14.2k</p>
              </div>
              <div className="md:pl-12">
                <p className="text-[10px] sm:text-xs font-bold tracking-wider text-on_surface_variant dark:text-[#9ba3b8] uppercase mb-2">Verification Time</p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-on_surface dark:text-[#e8eaf0] tracking-tight">1.4s</p>
              </div>
              <div className="md:pl-12">
                <p className="text-[10px] sm:text-xs font-bold tracking-wider text-on_surface_variant dark:text-[#9ba3b8] uppercase mb-2">Global Jurisdictions</p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-on_surface dark:text-[#e8eaf0] tracking-tight">32+</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-surface_container_lowest dark:bg-[#131820]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-[#1a1f26] rounded-3xl p-10 sm:p-16 lg:p-20 text-center shadow-floating relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  Ready to build the future of finance?
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                  Join 12,000+ investors and developers building on the PropChain registry. Start tokenizing your first asset today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <CtaButton className="rounded-full h-12 px-8 text-sm font-semibold" />
                  <Button variant="outline" size="lg" className="rounded-full h-12 px-8 text-sm font-semibold border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-on_primary bg-transparent">
                    Developer Hub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-surface_container_low dark:bg-[#161b27] pt-16 pb-8 border-t border-outline_variant/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <span className="text-xl font-bold text-primary font-display tracking-tight">
                  Prop<span className="text-on_surface dark:text-[#e8eaf0]">Chain</span>
                </span>
              </Link>
              <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] leading-relaxed mb-6">
                The institutional gateway for RWA (Real World Assets) on-chain infrastructure.
              </p>
              <div className="flex gap-4 opacity-50">
                <div className="w-8 h-8 rounded-full bg-on_surface_variant/20 flex items-center justify-center" />
                <div className="w-8 h-8 rounded-full bg-on_surface_variant/20 flex items-center justify-center" />
                <div className="w-8 h-8 rounded-full bg-on_surface_variant/20 flex items-center justify-center" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-on_surface dark:text-[#e8eaf0] mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-on_surface_variant dark:text-[#9ba3b8]">
                <li><Link href="#" className="hover:text-primary transition-colors">Asset Marketplace</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Developer SDK</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Compliance Engine</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Oracle Nodes</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-on_surface dark:text-[#e8eaf0] mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-on_surface_variant dark:text-[#9ba3b8]">
                <li><Link href="#" className="hover:text-primary transition-colors">About PropChain</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Network Status</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Legal & Regulatory</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-on_surface dark:text-[#e8eaf0] mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-on_surface_variant dark:text-[#9ba3b8]">
                <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Audit Reports</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Community Forum</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Governance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline_variant/20 text-xs text-on_surface_variant dark:text-[#9ba3b8]">
            <p>© 2024 PropChain AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-on_surface dark:hover:text-[#e8eaf0] dark:text-[#e8eaf0]">Privacy Policy</Link>
              <Link href="#" className="hover:text-on_surface dark:hover:text-[#e8eaf0] dark:text-[#e8eaf0]">Terms of Service</Link>
              <Link href="#" className="hover:text-on_surface dark:hover:text-[#e8eaf0] dark:text-[#e8eaf0]">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
