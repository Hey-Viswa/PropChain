import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full bg-sand/30 dark:bg-white/5 dark:text-[#e8eaf0] border border-stone/50 dark:border-white/10 rounded-xl",
          "focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none",
          "px-5 py-3.5 text-sm text-on_surface dark:text-[#e8eaf0] placeholder:text-on_surface_variant/30",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
