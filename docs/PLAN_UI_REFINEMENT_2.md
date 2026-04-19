# Execution Plan: UI Refinement & Alignment Fixes

## Objective
Address specific layout, alignment, and visibility issues reported by the user to ensure a high-precision "institutional" interface.

## 1. Settings Screen Polish
- **Button Rounding**: Audit `app/settings/page.tsx` and `app/oracle/settings/page.tsx`. Standardize rounding to `rounded-xl` to match the dashboard, ensuring they aren't "boxy" but also not "bubbly" (full rounded).
- **Polygonscan Button**: Fix icon and text alignment in `app/oracle/settings/page.tsx` (Node Identity card).

## 2. Home Screen (app/page.tsx) Polish
- **Hero CTAs**: Align "View Network Data" and "Go to Dashboard" (or SignUp/SignIn buttons) properly. Ensure they share a clean horizontal or vertical baseline.
- **Institutional Partners**: Increase visibility/contrast of the partner names in the trust bar.
- **Infrastructure Layer Section**: Fix alignment of the heading and description text.
- **Navlinks**: Update "Network", "Docs", and "Registry" to point to valid routes (e.g., `/registry`, `/docs`, etc.) or at least ensure they handle clicks gracefully.

## 3. Global Consistency Audit
- Ensure all "institutional" buttons share the same height and internal alignment patterns.

## Execution Steps
1. Refine `app/oracle/settings/page.tsx` (Polygonscan button & rounding).
2. Refine `app/settings/page.tsx` (rounding & alignment).
3. Overhaul `app/page.tsx` (Hero CTAs, Trust Bar visibility, Features alignment, Navlinks).
4. Verify changes in both Light and Dark modes.
