import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-surface_container dark:bg-[#1c2333]", className)}
      {...props}
    />
  );
};

export { Skeleton };
