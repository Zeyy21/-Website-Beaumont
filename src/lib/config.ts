/** Central site configuration, copy edits live here, not scattered in JSX. */

export const site = {
  name: "Beaumont",
  tagline: "Concierge home care, quietly delivered.",
  description:
    "Beaumont provides professional exterior cleaning for pressure washing, soft washing, and window care across Greater Montreal.",
  promise: "A brighter arrival, quietly delivered.",
  email: "concierge@beaumontgroup.net",
  instagram: "https://www.instagram.com/groupebeaumont/?hl=en",
  instagramHandle: "@groupebeaumont",
  phone: "+1 (555) 014-7788",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

/** `key` maps to dictionaries.nav.<key> for the localized label. `label` is the
 *  English fallback kept for reference. */
export const nav = [
  { href: "#services", key: "services", label: "Services" },
  { href: "#about", key: "about", label: "Who We Are" },
  { href: "#quote", key: "quote", label: "Free Estimate" },
  { href: "/terms", key: "terms", label: "Terms" },
  { href: "/partners", key: "partners", label: "Partners" },
  { href: "/hiring", key: "hiring", label: "Hiring" },
] as const;

/** Frequencies offered for recurring service. */
export const frequencies = [
  { id: "one_time", label: "One-time", modifier: 1.0, note: "A single visit" },
  { id: "monthly", label: "Seasonal", modifier: 1.0, note: "A planned seasonal refresh" },
  {
    id: "biweekly",
    label: "Twice yearly",
    modifier: 1.0,
    note: "Spring and fall, most popular",
  },
  { id: "weekly", label: "Annual", modifier: 1.0, note: "A yearly restoration" },
] as const;

export type FrequencyId = (typeof frequencies)[number]["id"];

/** Legacy DB field default. Public quotes are reviewed, not area-priced. */
export const quoteRatePerM2 = 0;

/** Conditional services reviewed and priced after the request is submitted. */
export const addOns = [
  { id: "gutters", label: "Gutter Cleaning" },
  { id: "stain-review", label: "Oil, rust, or algae spot review" },
] as const;

/** Reward points economy. */
export const rewards = {
  signup: 100,
  quoteAccepted: 250,
  jobCompleted: 500,
  referralSuccess: 1000,
  pointsPerDollar: 10, // 100 pts = $10 discount
};

/**
 * Canonical public service catalogue. This intentionally remains code-owned so
 * legacy database rows can never replace the services shown on the website.
 */
export const fallbackServices = [
  {
    id: "driveway",
    name: "Driveway & Hardscape Washing",
    description:
      "Concrete, interlock, asphalt, steps, and front walks cleaned for a brighter arrival.",
    base_price: 0,
    rate_per_m2: quoteRatePerM2,
    multiplier: 1.0,
  },
  {
    id: "deck",
    name: "Deck & Patio Washing",
    description:
      "Wood, composite, concrete, and outdoor living surfaces refreshed with material-aware pressure.",
    base_price: 0,
    rate_per_m2: quoteRatePerM2,
    multiplier: 1.0,
  },
  {
    id: "house-wash",
    name: "Soft House Washing",
    description:
      "Low-pressure exterior washing for siding, brick, stucco, painted details, and delicate finishes.",
    base_price: 0,
    rate_per_m2: quoteRatePerM2,
    multiplier: 1.0,
  },
  {
    id: "windows-atlantic",
    name: "Exterior Window Washing",
    description:
      "Exterior glass, frames, and sills cleaned with purified water for a clear, streak-free finish.",
    base_price: 0,
    rate_per_m2: quoteRatePerM2,
    multiplier: 1.0,
  },
] as const;
