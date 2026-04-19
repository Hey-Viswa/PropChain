"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] active:transition-transform active:duration-75 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
        outline:
          "border-stone/50 dark:border-white/10 bg-transparent hover:bg-stone/10 dark:hover:bg-white/5 text-on_surface dark:text-[#e8eaf0]",
        secondary:
          "bg-stone/10 dark:bg-white/10 text-on_surface dark:text-[#e8eaf0] hover:bg-stone/20 dark:hover:bg-white/15",
        ghost:
          "hover:bg-stone/10 dark:hover:bg-white/5 text-on_surface_variant dark:text-muted-foreground hover:text-on_surface dark:hover:text-[#e8eaf0]",
        destructive:
          "bg-error/10 text-error hover:bg-error/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-6",
        xs: "h-7 gap-1 px-2.5 text-[0.7rem] uppercase tracking-widest",
        sm: "h-9 gap-1.5 px-4 text-xs uppercase tracking-wide",
        lg: "h-12 gap-2.5 px-8 text-sm uppercase tracking-widest",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
