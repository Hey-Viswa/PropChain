# PropChain — Complete Change Log
## Session 1 — Dark Mode Theming Overhaul
**Root cause:** `tailwind.config.ts` used hardcoded hex values, making `.dark` CSS variables in `globals.css` completely ineffective.

- **tailwind.config.ts** — Wired all shadcn semantic tokens to CSS variables:
  - background, foreground, card, muted, accent, border, input, ring, primary, popover, destructive → all now `rgb(var(--token) / <alpha-value>)`
  - Kept secondary: `"#835500"` as fixed amber brand token for KYC/oracle badges
- **app/globals.css** — Added:
  - `color-scheme: light/dark` declarations to fix native form control blue tint
  - `:-webkit-autofill` box-shadow inset override to kill autofill blue
  - `@keyframes shake` for OracleAccessModal error animation
- **components/ui/card.tsx** — `bg-white dark:bg-card` → `bg-card`, `border-stone dark:border-white/5` → `border-border`, hardcoded text colors → `text-card-foreground`, `text-muted-foreground`
- **components/shared/PropertyCard.tsx** — Same semantic token cleanup
- **components/layout/AppShell.tsx** — `bg-cream dark:bg-[#0f0e0d]` → `bg-background`; `animate-fade-up` → `animate-fade-in` (critical: fixed modal overlay rendering as a box instead of full-viewport)
- **components/ui/button.tsx** — Variant cleanup: outline, secondary, ghost all use semantic tokens; default size gets explicit `text-sm`
- **components/ui/input.tsx** — `dark:bg-white/5 dark:text-[#e8eaf0] dark:border-white/10` → `dark:bg-input border-border text-foreground placeholder:text-muted-foreground/40`
- **app/oracle/settings/page.tsx** — Polygonscan button: removed invisible `dark:border-white/5` override

## Session 2 — Bug Fixes (from screenshots)
- **app/audit/page.tsx** — Smart Auditor Beta card: `text-on_secondary_fixed` (#2a1700 near-black) was invisible on dark amber bg → added `dark:text-secondary_fixed` (#ffddb4 light amber)
- **app/oracle/users/page.tsx** — Filter buttons (ALL/FLAGGED/ACTIVE): removed `dark:border-white/5`, normalized to `size="sm" h-9 text-xs px-4 rounded-lg` with `variant="default"/"outline"` toggle
- **app/settings/page.tsx** — KYC status row: `bg-surface` (hardcoded cream) → `bg-muted/30 border border-border`

## Session 3 — OracleAccessModal Redesign
- **components/shared/OracleAccessModal.tsx** — Full rewrite:
  - Removed cheap top color stripe
  - Centered header with 60×60 dynamic shield icon (Shield / CheckCircle / Lock)
  - `backdrop-blur-md`, `bg-card border-border` rounded-3xl, `z-[200]`
  - Proper `[animation:shake_0.45s_ease-in-out]` error shake
  - Lockout state shows `font-display` countdown timer
  - Attempt dots: `w-2 h-2` with `scale-110` on active
  - Input uses `bg-muted/40 dark:bg-muted/60` with red border on error

## Session 4 — Sidebar Redesign
- **components/layout/Sidebar.tsx** — Full redesign:
  - Width 240→220px
  - `bg-background border-border` (fully theme-responsive)
  - Active nav item: `bg-primary/10 text-primary border border-primary/15` + dot indicator `w-1.5 h-1.5 rounded-full bg-primary`
  - Inactive: `text-muted-foreground hover:bg-accent hover:text-foreground`
  - Section labels: `text-[9px] tracking-[0.22em] uppercase`
  - User card: `bg-muted/40 border border-border/60`
  - Oracle active pill: `bg-primary text-primary-foreground`
  - Typed nav items: `icon: React.ElementType`; removed unused imports

## Session 5 — Toast System
- **components/ui/toast.tsx** — Full rewrite with 4 variants:
  - `default` → Info icon (terracotta), `bg-card border-border`
  - `success` → CheckCircle2, `border-success/20`
  - `destructive` → XCircle, `border-error/30`
  - `warning` → AlertTriangle, `border-warning/20`
  - Slides from bottom-right, rounded-2xl, shadow-floating
  - Exports `ToastIcon` component
- **components/ui/toaster.tsx** — Rewritten: left icon column + content column layout using `ToastIcon`

## Session 6 — Landing Page + New Pages + Ripple (this session)
- **app/page.tsx** — Theme-reactive landing page:
  - `bg-cream` → `bg-background`, `text-on_surface` → `text-foreground`, `text-on_surface_variant` → `text-muted-foreground`, `bg-sand/30` → `bg-muted/30`, `border-stone` → `border-border` throughout
  - ThemeToggle added to navbar
  - Nav links fixed: Network → `/network`, Docs → `/docs`, Registry → `/registry`
  - "View Network Data" → `/network`
  - Dark editorial hero/process sections kept intentionally dark (`bg-[#12100E] dark:bg-[#080706]`)
- **app/network/page.tsx** — New page (inside AppShell):
  - 4 stat cards: TVL, properties, block time, oracle nodes
  - Live pulse indicator
  - Recent blocks table with tx count + size
  - Oracle node distribution by region with latency + status
  - 90-day uptime health bar (green/amber/red segments)
- **app/docs/page.tsx** — New page (inside AppShell):
  - Search bar
  - 4 quick-link cards (SDK, API Keys, Contract ABIs, Changelog)
  - 6 category cards: Getting Started, API Reference, Compliance & KYC, Smart Contracts, Oracle Network, Analytics
  - Each category shows 4 article links with hover arrows
  - DevRel contact CTA banner
- **hooks/useTheme.ts** — Ripple transition: duration 500→580ms, easing `cubic-bezier(0.4,0,0.2,1)` → `cubic-bezier(0.22, 1, 0.36, 1)` (spring expo-out)
- **app/globals.css** — View transition: `will-change: clip-path` for crisp ripple edges, corrected z-index stacking order comments
