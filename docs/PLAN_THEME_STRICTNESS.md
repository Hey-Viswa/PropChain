# Execution Plan: Theme Strictness & Logo Redirection

## Objective
Remove all "self-invented" UI effects (glows, non-system colors, blurs) and ensure the PropChain logo consistently redirects to the home page.

## 1. Aesthetic Cleanup
- **Remove Glows**: Identify and remove any `radial-gradient` or glow effects in `app/page.tsx` and other components.
- **Remove Non-System Colors**: Audit codebase for hardcoded blue shades or any colors not defined in the terracotta/cream/sand/stone palette.
- **Strict Theming**: Ensure all components use the standard Tailwind tokens (`primary`, `surface`, `on_surface`, etc.) without custom overrides.

## 2. Logo Redirection
- **Action**: Audit `components/layout/Navbar.tsx`, `components/layout/Sidebar.tsx`, and `app/page.tsx`.
- **Fix**: Wrap all `PropChainMark` or "PropChain" text instances in a `Link` component pointing to `/`.

## 3. Global CSS Audit
- **Action**: Check `app/globals.css` for any remaining blur or glow utility classes.
- **Action**: Remove any "floating" or "glowing" shadow definitions if they deviate from the professional institutional look.

## Execution Steps
1. Scrub `app/page.tsx` of the hero glow and check logo link.
2. Fix logo links in `Navbar.tsx` and `Sidebar.tsx`.
3. Audit `app/dashboard/page.tsx` for color consistency.
4. Final check of `tailwind.config.ts` to ensure no "blue" tokens exist.
