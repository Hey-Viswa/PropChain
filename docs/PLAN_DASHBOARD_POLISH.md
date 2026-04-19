# Execution Plan: Dashboard Aesthetic Refinement

## Objective
Remove generic design elements (top colored lines) and refine "boxy" components to achieve a more sophisticated, institutional look.

## 1. Card Refinement
- **Issue**: Cards have a 1px colored line at the top, which feels generic.
- **Fix**: 
  - Remove the top border/line from `StatCard` in `app/dashboard/page.tsx`.
  - Enhance card roundedness from `rounded-xl` to `rounded-2xl` or `rounded-3xl` where appropriate for a softer, more modern feel.
  - Use subtle, multi-layered shadows instead of borders where possible to create depth.

## 2. Button & Shape Harmonization
- **Issue**: Some buttons still feel "boxy" or inconsistently rounded.
- **Fix**:
  - Audit and update all buttons in `app/dashboard/page.tsx` to ensure they use `rounded-xl` or `rounded-full` consistently.
  - Ensure icon containers within cards also follow the refined rounding patterns.

## 3. UI Consistency
- Apply these refined card and button styles across both Oracle and User dashboard views.

## Proposed Changes
- **File**: `app/dashboard/page.tsx`
  - Remove `div` with `h-1` colored background in `StatCard`.
  - Update `rounded-xl` classes to `rounded-2xl`.
  - Refine icon backgrounds to use softer, more integrated colors.

## Execution Steps
1. Refactor `StatCard` and card layouts in `app/dashboard/page.tsx`.
2. Final visual audit of both dashboard modes.
