# Claude Mission: Institutional UI Precision Audit

## 1. Session Narrative (Gemini <-> User)
This session focused on transforming a fragmented, inconsistent UI into a premium, "institutional-grade" interface for PropChain. We are strictly in the **UI Layer** (no real backend integration yet).

### Key Transitions Completed:
- **Branding**: Migrated to a sophisticated typography pair: **Fraunces** (Display) and **Manrope** (Body).
- **Palette**: Enforced a strict **Terracotta/Cream/Stone** system. We purged all "blue-tinted" grays and unauthorized "blud" themes.
- **Rounding**: Standardized on `rounded-xl` (1rem) for institutional buttons and `rounded-2xl` (1.5rem) for cards.
- **Restructuring**: Moved the User Avatar and Theme Switch from the top Navbar to a unified "Identity Footer" in the **Sidebar**.
- **Special Effects**: Implemented a "stone-in-water" **Ripple Transition** for theme switching using the View Transitions API.

## 2. Your Mission: The "Final 1%" Audit
While the major pieces are moved, the user has noted lingering minor alignment, indentation, and arrangement issues. Your task is to perform a deep codebase audit and fix these "micro-mistakes."

### Audit Checklist:
1.  **Indentation & Alignment**:
    *   Check `app/page.tsx` Hero section. Ensure the "Go to Dashboard" and "View Network Data" buttons share a perfect horizontal baseline.
    *   Check the "Institutional Partners" bar. Ensure names are perfectly centered and contrast is high enough for professional visibility.
    *   Check the "Infrastructure Layer" section. The editorial heading and description must align with mathematical precision.
2.  **Button Arrangement**:
    *   Check `app/properties/page.tsx`. Ensure the "View Details" and "Initiate Transfer" buttons are identically sized and their text is perfectly centered.
    *   Verify that NO `rounded-md` or `rounded-lg` buttons remain in core paths; they must all be `rounded-xl`.
3.  **Color Consistency**:
    *   Search for any remaining hardcoded hex codes like `#1c2333` or `#9ba3b8`. They must be replaced with the system tokens `bg-card`, `text-on_surface`, or `dark:text-muted-foreground`.
    *   Ensure the dark mode background for cards is strictly `#1a1610`.
4.  **Interaction Polish**:
    *   Ensure the ripple transition is smooth and originates correctly from the Sidebar footer.
    *   Ensure Skeleton shimmer effects are consistent and use the warm palette (no blue tints).

## 3. Orchestral Rule (Mandatory)
You are part of a synchronized team.
- **DO NOT** "self-invent" new colors or effects.
- **STRICTLY** use the variables in `globals.css` and `tailwind.config.ts`.
- **FIX** minor mistakes, but do not overwrite the fundamental architecture established in this session.

Refer to `docs/MAIN_HANDOVER (1).md` for the full session log history before starting.
