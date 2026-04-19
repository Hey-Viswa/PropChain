# Execution Plan: Disable Dark Mode Hover Glows

## Objective
Remove glowing hover effects in dark mode to ensure a professional, institutional aesthetic. Depth should be achieved via subtle borders and value changes, not light-emitting shadows.

## 1. Tailwind Configuration Refinement
- **Action**: Update `tailwind.config.ts` to redefine `boxShadow`.
- **Strategy**: 
  - Ensure `shadow-floating` and `shadow-card` use very low opacity (0.4 or lower) for their shadow colors.
  - Implement a `dark:` variant for custom shadows if needed, or simply ensure the existing ones are subtle enough to not look like "glows" on dark backgrounds.

## 2. Component Hover Audit
- **Dashboard Cards**: Check `app/dashboard/page.tsx` for `hover:shadow-card` or `hover:shadow-floating`.
- **Buttons**: Check `components/ui/button.tsx` for hover-induced shadow changes that may look like glows in dark mode.
- **Fix**: Replace `hover:shadow-*` with `hover:border-primary/30` or `hover:bg-white/5` in dark mode to provide feedback without "light leaks."

## 3. Global CSS Audit
- **File**: `app/globals.css`
- **Action**: Remove any custom CSS filters or box-shadows that specifically target `.dark` with high-intensity primary colors.

## Execution Steps
1. Refine `tailwind.config.ts` shadow values.
2. Update component hover states in `app/dashboard/page.tsx`.
3. Verify that hover feedback in dark mode is subtle and institutional.
