import type { Config } from "tailwindcss";

/**
 * Beaumont brand tokens. Colors are the single source of truth here and in
 * globals.css (as CSS vars). Change a hex once and the whole app follows.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F9F8E7",
        sand: "#D7BE96",
        ochre: "#A1794F",
        cinnamon: "#7A4327",
        oak: "#40261A",
        soil: "#1D170F",
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
        soft: "0 10px 40px -12px rgba(29, 23, 15, 0.25)",
        lift: "0 24px 70px -20px rgba(29, 23, 15, 0.45)",
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
