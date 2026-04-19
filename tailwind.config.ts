import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // ── Signature terracotta accent ────────────────────────
        primary:                   "#D97757",
        primary_container:         "#C4602A",
        on_primary:                "#ffffff",
        primary_fixed:             "#F6EAE3",
        on_primary_fixed:          "#6B2F14",

        // ── Warm neutral surfaces (Anthropic palette) ──────────
        cream:                     "#FAF9F6",
        sand:                      "#F0EDE7",
        stone:                     "#E5E1DA",
        pebble:                    "#D0CBC2",

        // ── Map existing tokens to warm palette ────────────────
        surface:                   "#FAF9F6",
        surface_bright:            "#FAF9F6",
        surface_container_lowest:  "#FFFFFF",
        surface_container_low:     "#F0EDE7",
        surface_container:         "#E5E1DA",
        surface_container_high:    "#D0CBC2",
        surface_container_highest: "#C5BFB6",

        // ── Text ───────────────────────────────────────────────
        on_surface:         "#1A1918",
        on_surface_variant: "#6D6861",
        outline_variant:    "#D0CBC2",

        // ── Keep amber secondary for KYC/oracle badges ─────────
        secondary:          "#835500",
        secondary_fixed:    "#ffddb4",
        on_secondary_fixed: "#2a1700",

        // ── Semantic ───────────────────────────────────────────
        success:           "#3D7A5F",
        success_container: "#EBF3EE",
        error:             "#B84040",
        error_container:   "#F5EDED",
        warning:           "#8B6914",
        warning_container: "#F5EDD6",
        on_warning:        "#ffffff",

        // ── shadcn compatibility ───────────────────────────────
        border:     "#E5E1DA",
        input:      "#E5E1DA",
        ring:       "#D97757",
        background: "#FAF9F6",
        foreground: "#1A1918",
        card: {
          DEFAULT:    "#ffffff",
          foreground: "#1A1918",
        },
        popover: {
          DEFAULT:    "#ffffff",
          foreground: "#1A1918",
        },
        muted: {
          DEFAULT:    "#E5E1DA",
          foreground: "#6D6861",
        },
        accent: {
          DEFAULT:    "#F0EDE7",
          foreground: "#1A1918",
        },
        destructive: {
          DEFAULT:    "#B84040",
          foreground: "#ffffff",
        },
      },

      fontFamily: {
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
        body:    ["var(--font-dm-sans)",  "system-ui", "sans-serif"],
      },

      fontSize: {
        display: [
          "clamp(2.5rem, 4vw, 3.5rem)",
          { lineHeight: "1.06", letterSpacing: "-0.025em", fontWeight: "400" },
        ],
        "headline-lg": [
          "clamp(1.5rem, 2.5vw, 2rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "400" },
        ],
        "headline-md": [
          "clamp(1.25rem, 2vw, 1.5rem)",
          { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "400" },
        ],
        "title-md": [
          "clamp(1rem, 1.5vw, 1.125rem)",
          { lineHeight: "1.4", fontWeight: "600" },
        ],
        "body-md": [
          "clamp(0.8rem, 1.2vw, 0.875rem)",
          { lineHeight: "1.6", fontWeight: "400" },
        ],
        "label-sm": [
          "clamp(0.7rem, 1vw, 0.75rem)",
          { lineHeight: "1.4", letterSpacing: "0.04em", fontWeight: "500" },
        ],
      },

      boxShadow: {
        floating: "0 8px 24px rgba(26,25,24,0.08)",
        card:     "0 2px 8px rgba(26,25,24,0.05)",
        sm:       "0 1px 3px rgba(26,25,24,0.06)",
      },

      borderRadius: {
        lg: "0.625rem",
        md: "0.375rem",
        sm: "0.25rem",
      },

      animation: {
        "fade-up": "fadeUp 220ms ease-out forwards",
        "fade-in": "fadeIn 180ms ease-out forwards",
        shimmer:   "shimmer 1.5s infinite linear",
      },

      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
