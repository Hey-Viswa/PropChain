"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-xl bg-stone/10 animate-pulse" />
    );
  }

  return (
    <button
      onClick={(e) => toggleTheme(e)}
      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-on_surface_variant hover:text-primary dark:text-muted-foreground dark:hover:text-[#E89874]"
      aria-label="Toggle theme">
      <div className="transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] rotate-0 dark:-rotate-90">
        {isDark
          ? <Sun className="w-[18px] h-[18px]" />
          : <Moon className="w-[18px] h-[18px]" />
        }
      </div>
    </button>
  );
}
