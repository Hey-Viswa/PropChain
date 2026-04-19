"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer",
      "items-center rounded-full border-2 border-transparent",
      "transition-colors duration-200",
      "focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=unchecked]:bg-stone dark:data-[state=unchecked]:bg-[#2a2520]",
      "data-[state=checked]:bg-primary",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full",
        "bg-white shadow-lg ring-0",
        "transition-transform duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]",
        "data-[state=unchecked]:translate-x-0",
        "data-[state=checked]:translate-x-5"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
