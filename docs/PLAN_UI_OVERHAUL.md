# Execution Plan: UI & UX Overhaul

## Objective
Fix sizing inconsistencies, generic components, role-based dashboard logic, and visibility issues across the application.

## 1. Dashboard Logic
- **Issue**: Oracle and User dashboards show identical content.
- **Fix**: 
  - Update `app/dashboard/page.tsx` to conditionally render content based on `isOracleMode` from `useOracleAccessStore`.
  - Oracle Dashboard: Show verification queue snapshot, oracle-specific stats, and system telemetry.
  - User Dashboard: Show portfolio growth, asset composition, and user-specific activity.

## 2. Global Component Improvements
- **Select Component (`components/ui/select.tsx`)**:
  - Replace native `<select>` wrapper with a high-quality Radix-UI based Select for a more premium look.
  - Ensure proper portal rendering and custom triggers.
- **Slider Component (`components/ui/slider.tsx`)**:
  - Enhance styling to move beyond basic native range input.
  - Fix track and thumb visibility in both light and dark modes.
- **Button Component (`components/ui/button.tsx`)**:
  - Audit all `size` variants for consistency.
  - Ensure consistent height/padding across the app.

## 3. Settings Layout & Sizing
- **Oracle Settings (`app/oracle/settings/page.tsx`)**:
  - Standardize button sizes (some are currently short, some big).
  - Improve card spacing and alignment.
  - Fix dropdown styling (currently looks generic).
- **User Settings (`app/settings/page.tsx`)**:
  - Improve overall layout hierarchy.
  - Fix sizing for wallet disconnect and unlink buttons.

## 4. Visibility & Theming
- Ensure all components (especially sliders and dropdowns) have high contrast in both light and dark modes.
- Audit `globals.css` and `tailwind.config.ts` for any missing variable mappings.

## Execution Steps
1. Refactor `app/dashboard/page.tsx` for role-based content.
2. Upgrade `Select` and `Slider` components.
3. Apply layout and sizing fixes to `app/oracle/settings/page.tsx` and `app/settings/page.tsx`.
4. Global audit for button sizing and visibility.
