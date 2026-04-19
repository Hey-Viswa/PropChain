# Execution Plan: Strict Dark Theme & Glow Elimination

## Objective
Standardize dark mode card backgrounds to `#1a1610`, remove all remaining glow effects, and fix visibility/theming inconsistencies across all core modules.

## 1. Global Dark Theme Standardization
- **Card Background**: Update `app/globals.css` and `tailwind.config.ts` to ensure `--card` in dark mode is strictly `#1a1610` (currently erroneously showing `#131517` or similar).
- **Surface Audit**: Replace any hardcoded dark surfaces like `#1a1916` or `#131820` with the official system tokens.

## 2. Global Glow Removal
- **Dashboard**:
  - `PortfolioChart`: Verify no gradients.
  - `AssetSpiderChart`: Audit for glows/shadows.
  - `Global Registry Hotspot`: Remove any remaining radial gradients or blurs.
- **Minting**:
  - `app/mint/details/page.tsx`: Scrub any `shadow-floating` or glow wrappers.
  - `app/mint/upload/page.tsx`: Scrub glow/light leak backgrounds.
- **Tables**:
  - Audit `Verification Queue` and `Audit History` tables for glow/blur backgrounds.

## 3. Component Consistency Audit
- **My Property Cards**: Standardize background and borders.
- **Audit History & Public Registry**: Fix text visibility (ensure use of `text-on_surface_variant` mapped to high-contrast dark tones).

## Execution Steps
1. Update `globals.css` and `tailwind.config.ts` for the `#1a1610` standard.
2. Scrub glows from dashboard charts and hotspots.
3. Overhaul `app/audit/page.tsx` and `app/registry/page.tsx` for dark mode visibility.
4. Standardize `My Property` cards.
5. Final global search for unauthorized hex codes and glows.
