/** Central site configuration, copy edits live here, not scattered in JSX. */

export const site = {
  name: "Beaumont",
  tagline: "Concierge home care, quietly delivered.",
  description:
    "Beaumont provides meticulous pressure washing for driveways, decks, patios, and home exteriors, with specialist window washing delivered alongside Atlantic.",
  promise: "A brighter arrival, quietly delivered.",
  email: "beaumontgroup.net@gmail.com",
  instagram: "https://www.instagram.com/groupebeaumont/?hl=en",
  instagramHandle: "@groupebeaumont",
  phone: "+1 (555) 014-7788",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const nav = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "Who We Are" },
  { href: "#quote", label: "Instant Quote" },
  { href: "#terms", label: "Terms" },
];

/** Frequencies offered for recurring service. modifier multiplies the line total. */
export const frequencies = [
  { id: "one_time", label: "One-time", modifier: 1.0, note: "A single visit" },
  { id: "monthly", label: "Quarterly", modifier: 1.0, note: "Four seasonal visits" },
  {
    id: "biweekly",
    label: "Twice yearly",
    modifier: 1.0,
    note: "Spring and fall, most popular",
  },
  { id: "weekly", label: "Annual", modifier: 1.0, note: "A yearly restoration" },
] as const;

export type FrequencyId = (typeof frequencies)[number]["id"];

/** Public instant-estimate rate. Every measured service uses this exact rate. */
export const quoteRatePerM2 = 3;

/** Optional add-ons surfaced in the quote builder. price is a flat add. */
export const addOns = [
  { id: "windows", label: "Exterior window rinse", price: 60 },
  { id: "deep", label: "Protective surface seal", price: 120 },
  { id: "fridge", label: "Oil and rust treatment", price: 45 },
  { id: "laundry", label: "Gutter-face brightening", price: 35 },
] as const;

/** Reward points economy. */
export const rewards = {
  signup: 100,
  quoteAccepted: 250,
  jobCompleted: 500,
  referralSuccess: 1000,
  pointsPerDollar: 100, // 100 pts = $1 discount
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
      "Interlock, concrete, stone, and front walks pressure washed for a cleaner, brighter arrival.",
    base_price: 0,
    rate_per_m2: quoteRatePerM2,
    multiplier: 1.0,
  },
  {
    id: "deck",
    name: "Deck & Patio Washing",
    description:
      "Wood and composite decks, terraces, and patios refreshed with material-aware pressure and careful preparation.",
    base_price: 0,
    rate_per_m2: quoteRatePerM2,
    multiplier: 1.0,
  },
  {
    id: "house-wash",
    name: "House Exterior Washing",
    description:
      "A considered exterior wash for brick, stone, stucco, siding, entrances, and other residential surfaces.",
    base_price: 0,
    rate_per_m2: quoteRatePerM2,
    multiplier: 1.0,
  },
  {
    id: "windows-atlantic",
    name: "Window Washing with Atlantic",
    description:
      "Purified-water window care for glass, frames, and sills, delivered with our specialist partner Atlantic.",
    base_price: 0,
    rate_per_m2: quoteRatePerM2,
    multiplier: 1.0,
  },
] as const;
