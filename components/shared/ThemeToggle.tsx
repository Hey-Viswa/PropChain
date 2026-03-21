"use client";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-surface_container dark:bg-[#1c2333] animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-surface_container dark:bg-[#1c2333] hover:bg-surface_container_high text-on_surface_variant dark:text-[#9ba3b8] hover:text-on_surface dark:hover:text-[#e8eaf0] dark:text-[#e8eaf0] dark:bg-surface-container-dark dark:hover:bg-surface-container-high-dark dark:text-on-surface-variant-dark"
      aria-label="Toggle theme">
      <div className="transition-transform duration-300 ease-out rotate-0 dark:-rotate-12">
        {isDark
          ? <Sun className="w-4 h-4 transition-all duration-300" />
          : <Moon className="w-4 h-4 transition-all duration-300" />
        }
      </div>
    </button>
  );
}
