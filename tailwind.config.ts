import type { Config } from "tailwindcss";

/**
 * Beaumont brand tokens. Colors are the single source of truth here and in
 * globals.css (as CSS vars). Change a hex once and the whole app follows.
 *
 * Palette: a three-anchor system — Off-white (#F4F1EC), Canopy (#1F4934),
 * and Ink (#1C1C1A). The six token names are kept so existing utility classes
 * and /opacity washes are untouched; their values map onto the three anchors
 * (with two subtle tints) to preserve the original light→dark hierarchy.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F4F1EC", // Off-white — light surfaces, text on dark
        sand: "#E3DCCF", // Off-white, deepened — subtle panels / washes
        ochre: "#6E9476", // Canopy, lightened (sage) — accents on dark
        cinnamon: "#1F4934", // Canopy — primary buttons, key accents
        oak: "#2B2B28", // Ink, lifted — dark text on light, hover surfaces
        soil: "#1C1C1A", // Ink — darkest surfaces, body text
      },
      fontFamily: {
        // Display upgrades to Bombay Black Unicode automatically once the font
        // file is added (see globals.css @font-face); falls back to Cormorant.
        display: ["var(--font-display)", "Cormorant", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        shell: "1200px",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(28, 28, 26, 0.25)",
        lift: "0 24px 70px -20px rgba(28, 28, 26, 0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
