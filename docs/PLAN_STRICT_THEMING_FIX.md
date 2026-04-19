# Execution Plan: Strict Theming & Visibility Fixes

## Objective
Enforce strict adherence to the terracotta/cream institutional design system, removing all "blueish" tints, glow effects, and visibility issues in dark mode.

## 1. System Throughput Card (Oracle Dashboard)
- **Issue**: Glow effect visible in dark mode.
- **Fix**: Identify the component (likely `PortfolioChart` or a wrapper in `app/dashboard/page.tsx`) and remove any `shadow-primary` or custom glow effects.

## 2. Audit History & Global Visibility
- **Issue**: "Live View" text not visible in dark mode.
- **Issue**: "Blueish" card theming inconsistent with the warm system palette.
- **Fix**: 
  - Audit `app/audit/page.tsx` and related components.
  - Replace any `bg-blue-*`, `text-blue-*`, or blue-tinted hex codes with system tokens (`primary`, `surface`, `on_surface`, `sand`, `stone`).
  - Ensure all text uses theme-aware classes (`text-on_surface_variant` or `dark:text-[#9ba3b8]`).

## 3. Strict Theming Mandate
- **Action**: Update `docs/MAIN_HANDOVER (1).md` to explicitly forbid non-system colors and "creative" effects like glows or blurs.

## Execution Steps
1. Audit `app/dashboard/page.tsx` for glows and blue tints.
2. Audit `app/audit/page.tsx` for text visibility and blueish cards.
3. Global search for lingering blue colors.
4. Update handover log with the strict theme rule.
5. Apply fixes.
