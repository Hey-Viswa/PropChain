import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-stone/20 dark:bg-white/5",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 dark:before:via-white/5 before:to-transparent",
        className
      )}
      {...props}
    />
  );
};

export { Skeleton };
