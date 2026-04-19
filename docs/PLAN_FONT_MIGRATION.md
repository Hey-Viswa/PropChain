# Execution Plan: Font Migration to Fraunces & Manrope

## Objective
Update the global design system to use `Fraunces` for display/headings and `Manrope` for body text, as preferred by GPT Codex.

## Proposed Changes

### 1. Global Rules Update
- Update `docs/MAIN_HANDOVER (1).md` to include the mandatory "Log-Before-Edit" rule.
- Add warnings about rate limits and potential execution issues.

### 2. Typography Restoration
- **File:** `app/layout.tsx`
  - Replace `Plus_Jakarta_Sans` with `Fraunces`.
  - Replace `Inter` with `Manrope`.
  - Update variable names and CSS class applications.
- **File:** `tailwind.config.ts`
  - Update `fontFamily` to map `display` to `Fraunces` and `body` to `Manrope`.
- **File:** `app/globals.css`
  - Update CSS variable usage and default font-family declarations.

## Execution Steps
1. Update `docs/MAIN_HANDOVER (1).md` with the new agent rules.
2. Modify `app/layout.tsx` with the new font imports and configurations.
3. Modify `tailwind.config.ts` to reflect the new font families.
4. Modify `app/globals.css` to apply the fonts globally.
5. Verify changes.
