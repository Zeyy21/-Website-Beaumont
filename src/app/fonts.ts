import { Cormorant, Inter } from "next/font/google";

/**
 * Body font. Loaded from Google and exposed as --font-body fallback.
 * (globals.css :root --font-body lists "Inter" first; this guarantees it ships.)
 */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Display fallback. The brand font (Bombay Black Unicode) sits ABOVE this in the
 * --font-display stack; Cormorant renders until/unless that font file is added.
 */
export const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
