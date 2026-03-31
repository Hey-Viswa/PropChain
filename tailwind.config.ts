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
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#0050b2",
        primary_container: "#1868db",
        on_primary: "#ffffff",
        primary_fixed: "#d6e3ff",
        on_primary_fixed: "#001a43",
        secondary: "#835500",
        secondary_fixed: "#ffddb4",
        on_secondary_fixed: "#2a1700",
        surface: "#f9f9ff",
        surface_container_low: "#f3f3fa",
        surface_container: "#ededf5",
        surface_container_high: "#e7e8ef",
        surface_container_highest: "#e2e2e9",
        surface_container_lowest: "#ffffff",
        surface_bright: "#f9f9ff",
        on_surface: "#191c21",
        on_surface_variant: "#43474e",
        outline_variant: "#c3c6cf",
        error: "#ba1a1a",
        error_container: "#ffdad6",
        on_error_container: "#410002",
        success: "#006e2c",
        success_container: "#98f5b0",
        warning: "#d97706",
        warning_container: "#fef3c7",
        on_warning: "#ffffff",
        "surface-dark": "#0f1117",
        "surface-container-low-dark": "#161b27",
        "surface-container-dark": "#1c2333",
        "surface-container-high-dark": "#222b3d",
        "surface-container-lowest-dark": "#131820",
        "on-surface-dark": "#e8eaf0",
        "on-surface-variant-dark": "#9ba3b8",
        // standard shadcn variables mapped to our tokens
        border: "#c3c6cf",
        input: "#e2e2e9",
        ring: "#0050b2",
        background: "#f9f9ff",
        foreground: "#191c21",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#191c21",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#191c21",
        },
        muted: {
          DEFAULT: "#ededf5",
          foreground: "#43474e",
        },
        accent: {
          DEFAULT: "#e7e8ef",
          foreground: "#191c21",
        },
        destructive: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        display: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        display: [
          "clamp(2.5rem, 4vw, 3.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg": [
          "clamp(1.5rem, 2.5vw, 2rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-md": [
          "clamp(1.25rem, 2vw, 1.5rem)",
          { lineHeight: "1.3", fontWeight: "600" },
        ],
        "title-md": [
          "clamp(1rem, 1.5vw, 1.125rem)",
          { lineHeight: "1.4", fontWeight: "500" },
        ],
        "body-md": [
          "clamp(0.8rem, 1.2vw, 0.875rem)",
          { lineHeight: "1.5", fontWeight: "400" },
        ],
        "label-sm": [
          "clamp(0.7rem, 1vw, 0.75rem)",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" },
        ],
      },
      boxShadow: {
        floating: "0 12px 32px rgba(0,26,67,0.06)",
        card: "0 12px 32px rgba(0,26,67,0.06)",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      animation: {
        "fade-up": "fadeUp 200ms ease-out forwards",
        "fade-in": "fadeIn 150ms ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
