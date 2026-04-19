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
        display: ["var(--font-fraunces)", "serif"],
        body:    ["var(--font-manrope)",  "sans-serif"],
      },

      // ── Systemic Fluid Scaling (Auto-Scaling) ──────────────
      // clamp(min, preferred, max)
      // preferred is calculated to scale linearly between 375px and 1440px
      fontSize: {
        "fluid-display": [
          "clamp(3.5rem, 2.3rem + 7.5vw, 9rem)",
          { lineHeight: "0.92", letterSpacing: "-0.04em", fontWeight: "800" },
        ],
        "fluid-h1": [
          "clamp(2.5rem, 1.8rem + 3vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        "fluid-h2": [
          "clamp(2rem, 1.5rem + 2.5vw, 3.5rem)",
          { lineHeight: "1.2", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        "fluid-body": [
          "clamp(0.875rem, 0.8rem + 0.5vw, 1.125rem)",
          { lineHeight: "1.6", fontWeight: "400" },
        ],
        "fluid-label": [
          "clamp(0.7rem, 0.65rem + 0.25vw, 0.8rem)",
          { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" },
        ],
      },

      spacing: {
        // Fluid spacing tokens for consistent "breathing" space
        "fluid-gap": "clamp(1rem, 0.5rem + 2vw, 3rem)",
        "fluid-padding": "clamp(1.25rem, 1rem + 3vw, 5rem)",
        "fluid-section": "clamp(4rem, 2rem + 8vw, 10rem)",
      },

      boxShadow: {
        // Premium layered shadows
        floating: "0 2px 4px rgba(26,25,24,0.02), 0 12px 32px rgba(26,25,24,0.08), 0 24px 64px rgba(26,25,24,0.04)",
        card:     "0 1px 3px rgba(26,25,24,0.04), 0 4px 12px rgba(26,25,24,0.03)",
        sm:       "0 1px 2px rgba(26,25,24,0.05)",
      },

      borderRadius: {
        lg: "0.625rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2.5rem",
      },

      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer:   "shimmer 2s infinite linear",
      },

      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
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
