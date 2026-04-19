# Execution Plan: Restructuring, Ripple Transition & Consistency

## Objective
Relocate key UI elements, implement a premium ripple theme transition, standardize rounding, and fix top-bar sizing for a professional institutional look.

## 1. Structural Changes
- **Navbar (`components/layout/Navbar.tsx`)**:
  - Remove `UserButton` (Clerk avatar).
  - Remove `ThemeToggle`.
  - Fix height/length inconsistencies.
- **Sidebar (`components/layout/Sidebar.tsx`)**:
  - Add a dedicated footer section for the `UserButton` and `ThemeToggle`.
  - Improve visual hierarchy and vertical spacing.

## 2. Aesthetic & Consistency Fixes
- **Button Standard**: Strictly enforce `rounded-xl` for all buttons.
- **Skeleton loaders**: Add a high-performance shimmer effect.
- **Dark Mode Color**: Ensure absolute strictness for `#1a1610` card backgrounds and high-contrast text.

## 3. Ripple Theme Transition
- **Implementation**: Use a CSS/JS "Clip Path" or overlay approach to create a "stone-in-water" ripple effect when toggling between light and dark modes.
- **Trigger**: The ripple will originate from the theme toggle icon position in the sidebar.

## 4. Branch Management
- **Action**: Merge/Push all changes to the `development` branch.

## 5. Autonomous Task for Claude
- **Action**: Create `CLAUDE_TASK.md` with instructions for a complex logic-heavy feature.

## Execution Steps
1. Relocate elements from Navbar to Sidebar.
2. Implement Shimmer effect in `Skeleton` component.
3. Build and integrate the Ripple Transition system.
4. Global audit for button rounding and color consistency.
5. Branch operations and Claude task handoff.
