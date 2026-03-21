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
          "flex w-full bg-surface_container_highest dark:bg-[#2a3347] dark:text-[#e8eaf0] dark:border-[#2a3347] dark:focus:border-[#6b9eff] rounded-md border-0 border-b border-outline_variant/20",
          "focus:border-primary focus-visible:outline-none focus-visible:ring-0",
          "px-4 py-3 text-body-md text-on_surface dark:text-[#e8eaf0] placeholder:text-on_surface_variant/60",
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
