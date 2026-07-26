import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ------------------------------------------------------------------
         Colors — all values routed through CSS variables from globals.css.
         Never use hardcoded hex values in components.
      ------------------------------------------------------------------ */
      colors: {
        bg: {
          primary:   "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
        },
        glass: {
          surface:   "var(--glass-surface)",
          border:    "var(--glass-border)",
          highlight: "var(--glass-highlight)",
        },
        primary: {
          500: "var(--primary-500)",
          700: "var(--primary-700)",
          900: "var(--primary-900)",
        },
        secondary: {
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
        },
        accent: {
          400: "var(--accent-400)",
          500: "var(--accent-500)",
        },
        text: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted:     "var(--text-muted)",
        },
      },

      /* ------------------------------------------------------------------
         Typography
      ------------------------------------------------------------------ */
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)",    "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)",    "monospace"],
      },
      fontSize: {
        "fluid-h1":   "var(--fs-h1)",
        "fluid-h2":   "var(--fs-h2)",
        "fluid-body": "var(--fs-body)",
      },
      lineHeight: {
        display: "1.15",
        body:    "1.6",
      },
      letterSpacing: {
        display: "-0.02em",
      },

      /* ------------------------------------------------------------------
         Background Gradients
      ------------------------------------------------------------------ */
      backgroundImage: {
        "hero-gradient":        "var(--hero-gradient)",
        "warm-accent-gradient": "var(--warm-accent-gradient)",
        "cool-accent-gradient": "var(--cool-accent-gradient)",
        "text-gradient":        "var(--text-gradient)",
      },

      /* ------------------------------------------------------------------
         Border Radius
      ------------------------------------------------------------------ */
      borderRadius: {
        pill: "999px",
        card: "20px",
      },

      /* ------------------------------------------------------------------
         Box Shadows — glass-specific
      ------------------------------------------------------------------ */
      boxShadow: {
        "glass-liquid":
          "inset 0 1px 1px rgba(255,255,255,0.25), 0 8px 32px rgba(0,0,0,0.35)",
        "glass-liquid-hover":
          "inset 0 1px 2px rgba(255,255,255,0.35), 0 12px 40px rgba(0,0,0,0.45)",
        "glass-frosted":
          "0 4px 24px rgba(0,0,0,0.25)",
        "glow-primary":
          "0 0 24px rgba(124,58,237,0.4)",
        "glow-accent":
          "0 0 24px rgba(56,189,248,0.35)",
        "glow-secondary":
          "0 0 24px rgba(255,107,74,0.35)",
      },

      /* ------------------------------------------------------------------
         Transitions
      ------------------------------------------------------------------ */
      transitionDuration: {
        250: "250ms",
      },

      /* ------------------------------------------------------------------
         Max Width — content containers
      ------------------------------------------------------------------ */
      maxWidth: {
        content: "1280px",
      },

      /* ------------------------------------------------------------------
         Spacing scale extension (8px base)
      ------------------------------------------------------------------ */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
