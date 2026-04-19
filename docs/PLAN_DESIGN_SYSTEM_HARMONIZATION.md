# PropChain Design System Harmonization Plan

## Objective
Finalize the PropChain design system harmonization across the entire repository. This plan ensures institutional precision, adhering to a strict warm terracotta/cream palette, standardizing component roundness, and eliminating all unauthorized blue-tinted colors.

## 1. Rounding Harmonization
**Goal:** Standardize cards, buttons, and larger interactive elements to `rounded-xl` or `rounded-2xl`.
- **Target Replacements:** Replace `rounded-md`, `rounded-lg`, `rounded-[7px]`, `rounded-[6px]` with `rounded-xl`.
- **Conditional Replacements:** Replace `rounded-full` with `rounded-xl` *except* for small status dots and circular indicators (e.g., elements with `w-1` to `w-6`, `h-1` to `h-6`, `p-1`, `p-2`).

## 2. Dark Mode Backgrounds
**Goal:** Eliminate blue-tinted container backgrounds.
- **Target Replacements:** Replace `#1c2333`, `#131820`, `#211f1c`, `#222b3d`, `#131517`, `#1c2a4a` with:
  - `dark:bg-card` for main containers and cards.
  - `dark:bg-white/5` for nested elements and inner backgrounds.
- **Strict Rule for `loading.tsx`:** All identified background hex codes in `loading.tsx` files must be strictly replaced with `dark:bg-card`.

## 3. Text Visibility (High Contrast)
**Goal:** Ensure text remains legible and avoids cool/blue tones.
- **Muted Text Replacements:** Replace `#9ba3b8`, `#9b9690`, `#6b7280`, `#6b6560`, `#8a8480`, `#7a7470`, `#5A5450` with `text-on_surface_variant dark:text-muted-foreground`.
- **Primary Text Replacements:** Replace `#e8eaf0`, `#e8e6e2`, `#F5F3F0` with `text-on_surface dark:text-[#e8eaf0]`.

## 4. Borders
**Goal:** Warm, subtle borders in dark mode.
- **Target Replacements:** Replace `#2a2520`, `#2a3347`, `#3a342e` with `dark:border-white/5` or `border-stone/20`.

## Target Files for Execution

### Components
- `components/shared/AuditTimeline.tsx`
- `components/shared/MapboxLocationMap.tsx`
- `components/shared/ThemeToggle.tsx`
- `components/shared/AssetSpiderChart.tsx`
- `components/ui/badge.tsx`
- `components/ui/select.tsx`
- `components/ui/separator.tsx`
- `components/ui/slider.tsx`
- `components/ui/switch.tsx`
- `components/ui/card.tsx`
- `components/ui/toast.tsx`
- `components/layout/Navbar.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/MobileNav.tsx`

### Dashboard & Oracle App Pages
- `app/dashboard/components/AssetCard.tsx`
- `app/dashboard/components/NetworkTelemetry.tsx`
- `app/dashboard/components/PortfolioChart.tsx`
- `app/oracle/analytics/page.tsx`
- `app/oracle/login/page.tsx`
- `app/oracle/users/page.tsx`
- `app/oracle/queue/page.tsx`
- `app/oracle/users/[clerkId]/page.tsx`

### Mint & Audit App Pages
- `app/mint/details/page.tsx`
- `app/mint/review/page.tsx`
- `app/mint/upload/page.tsx`
- `app/audit/page.tsx`
- `app/registry/page.tsx`
- `app/properties/page.tsx`
- `app/properties/[id]/page.tsx`

### Settings Pages
- `app/settings/page.tsx`
- `app/oracle/settings/page.tsx`

### Skeletons (loading.tsx)
- `app/audit/loading.tsx`
- `app/dashboard/loading.tsx`
- `app/mint/details/loading.tsx`
- `app/mint/review/loading.tsx`
- `app/mint/upload/loading.tsx`
- `app/oracle/analytics/loading.tsx`
- `app/oracle/queue/loading.tsx`
- `app/oracle/settings/loading.tsx`
- `app/properties/loading.tsx`
- `app/properties/[id]/loading.tsx`
- `app/registry/loading.tsx`
- `app/settings/loading.tsx`

## Next Steps
To implement this plan, a global find-and-replace script or systematic tool execution will be used to process these exact files against the patterns defined above, guaranteeing that no blue tints remain and all cards conform to the institutional aesthetic.
