import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full bg-sand/30 dark:bg-white/5 dark:text-[#e8eaf0] border border-stone/50 dark:border-white/10 rounded-xl",
          "focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none",
          "px-5 py-3.5 text-sm text-on_surface dark:text-[#e8eaf0] placeholder:text-on_surface_variant/30",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
