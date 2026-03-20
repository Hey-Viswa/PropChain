"use client"

import { useToast } from "@/hooks/use-toast"

// A simplified Toaster using PropChain V2 design tokens that doesn't depend on Radix
export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-6 sm:right-6 sm:max-w-[420px]">
      {toasts.map(function ({ id, title, description, action }) {
        return (
          <div
            key={id}
            className="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border border-outline_variant/20 bg-surface_container_lowest p-5 shadow-[0_12px_32px_rgba(0,26,67,0.06)] transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-4"
          >
            <div className="grid gap-1">
              {title && <div className="text-title-md font-medium text-on_surface">{title}</div>}
              {description && (
                <div className="text-body-md text-on_surface_variant">{description}</div>
              )}
            </div>
            {action}
            <button
              onClick={() => dismiss(id)}
              className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:text-on_surface focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 text-on_surface_variant"
            >
              x
            </button>
          </div>
        )
      })}
    </div>
  )
}
