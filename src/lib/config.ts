/** Central site configuration, copy edits live here, not scattered in JSX. */

export const site = {
  name: "Beaumont",
  tagline: "Exterior care, beautifully delivered.",
  description:
    "Beaumont restores driveways, walkways, patios, pool surrounds, and home exteriors with meticulous pressure washing and effortless service.",
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
  { id: "monthly", label: "Quarterly", modifier: 0.85, note: "Four seasonal visits" },
  {
    id: "biweekly",
    label: "Twice yearly",
    modifier: 0.9,
    note: "Spring and fall, most popular",
  },
  { id: "weekly", label: "Annual", modifier: 0.95, note: "A yearly restoration" },
] as const;

export type FrequencyId = (typeof frequencies)[number]["id"];

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
 * Fallback service catalogue used when Supabase is not configured, so the
 * marketing site and quote tool render fully with zero keys. When Supabase is
 * connected these are seeded into the `services` table (see migration).
 */
export const fallbackServices = [
  {
    id: "driveway",
    name: "Driveway & Walkway Restoration",
    description:
      "Concrete, stone, and pavers restored to a brighter, more welcoming arrival.",
    base_price: 80,
    rate_per_m2: 2.2,
    multiplier: 1.0,
  },
  {
    id: "patio",
    name: "Patio & Pool Surround",
    description:
      "Outdoor living surfaces refreshed with careful pressure and material-aware treatment.",
    base_price: 140,
    rate_per_m2: 2.8,
    multiplier: 1.0,
  },
  {
    id: "house-wash",
    name: "Gentle House Wash",
    description:
      "A considered low-pressure exterior wash for siding, stucco, brick, and delicate finishes.",
    base_price: 160,
    rate_per_m2: 2.4,
    multiplier: 1.0,
  },
  {
    id: "estate",
    name: "Complete Estate Exterior",
    description:
      "A tailored restoration of the driveway, paths, terraces, walls, and outdoor living areas.",
    base_price: 240,
    rate_per_m2: 3.2,
    multiplier: 1.0,
  },
] as const;
