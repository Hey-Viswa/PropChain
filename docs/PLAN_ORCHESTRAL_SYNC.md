# Execution Plan: Orchestral Sync & Design System Correction

## Objective
Harmonize the entire application with the institutional design system: Standardize to `rounded-xl` for all buttons/containers, eliminate all blue-tinted hex codes (`#1c2333`, `#9ba3b8`, `#e8eaf0`), and establish strict orchestral synchronization rules for all agents.

## 1. Orchestral Rule Update (continuity/synchronization)
- **Action**: Update `docs/MAIN_HANDOVER (1).md`.
- **New Rule: Orchestral Synchronization**:
  - Agents must treat the workspace as a single team-led project.
  - Design tokens MUST be reused; no ad-hoc hex codes.
  - Multi-file changes must be atomic and verified for side-effects.

## 2. Standardized Rounding (Anti-Full / Anti-Boxy)
- **Target**: `rounded-xl` (1rem) is the institutional standard.
- **Fixes**:
  - `components/ui/button.tsx`: Change default rounding to `rounded-xl`.
  - `app/page.tsx`: Replace `rounded-full` with `rounded-xl`.
  - `app/settings/page.tsx`: Standardize theme buttons to `rounded-xl`.
  - `KYCModal`, `OracleAuthButton`, and admin views: Standardize to `rounded-xl`.

## 3. Global Color Sanitization (Warm vs Blue)
- **Issue**: Blue-tinted grays (`#1c2333`, `#9ba3b8`, `#e8eaf0`) clash with the warm `#1a1610` palette and reduce visibility.
- **Fix**:
  - **Text**: Replace `#9ba3b8` and `#e8eaf0` with `text-on_surface_variant` and `text-on_surface` (or high-contrast warm equivalents).
  - **Skeletons/Loading**: Replace `#1c2333` with `bg-stone/10` or `dark:bg-white/5`.
  - **Toasts**: Update `components/ui/toast.tsx` to match the warm palette.

## 4. Visibility Polish (Critical Factor)
- Ensure all text in dark mode uses variables that map to high-contrast warm tones against `#1a1610`.

## Execution Steps
1. Update orchestral rules in `docs/MAIN_HANDOVER (1).md`.
2. Fix `components/ui/button.tsx` default rounding.
3. Batch update `app/` and `components/` for rounding and color compliance.
4. Verify visibility across all modules.
