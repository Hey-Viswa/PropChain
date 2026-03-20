"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <p className="text-headline-md font-semibold text-on_surface">
        Something went wrong
      </p>
      <p className="text-body-md text-on_surface_variant">
        {error.message ?? "An unexpected error occurred."}
      </p>
      <Button variant="default" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}