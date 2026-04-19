# Execution Plan: Fix Initiate Transfer Button

## Objective
Fix the "squared and discolored" Initiate Transfer button on the `/properties` page.

## 1. Button Component Polish (`components/ui/button.tsx`)
- **Fix Rounding**: Replace the problematic `rounded-[min(var(--radius-md),...)]` with the stable institutional token `rounded-xl`.
- **Refine Secondary Variant**: Update the `secondary` variant to use a more professional "institutional stone" look (`bg-stone/10 dark:bg-white/5 text-on_surface dark:text-[#e8eaf0]`) instead of the amber tint.

## 2. Property Card Optimization (`components/shared/PropertyCard.tsx`)
- **Update Action Area**:
  - Change "Initiate Transfer" button variant to `default` or a refined `secondary` to make it pop correctly.
  - Ensure both buttons use consistent sizing (`h-10` or `sm`).

## Execution Steps
1. Update `components/ui/button.tsx` rounding and `secondary` variant.
2. Update `components/shared/PropertyCard.tsx` action buttons.
3. Verify on `/properties` route.
