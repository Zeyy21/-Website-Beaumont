/** Central site configuration, copy edits live here, not scattered in JSX. */

export const site = {
  name: "Beaumont",
  tagline: "Effortless luxury cleaning.",
  description:
    "Beaumont delivers meticulous, premium cleaning for discerning homes. Draw your space, get an instant estimate, and book in minutes.",
  promise: "Meticulous care, quietly delivered.",
  email: "concierge@beaumont.example",
  phone: "+1 (555) 014-7788",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/quote", label: "Instant Quote" },
  { href: "/about", label: "Who We Are" },
  { href: "/terms", label: "Terms" },
];

/** Frequencies offered for recurring service. modifier multiplies the line total. */
export const frequencies = [
  { id: "one_time", label: "One-time", modifier: 1.0, note: "A single visit" },
  { id: "monthly", label: "Monthly", modifier: 0.95, note: "Every 4 weeks" },
  {
    id: "biweekly",
    label: "Bi-weekly",
    modifier: 0.9,
    note: "Every 2 weeks, most popular",
  },
  { id: "weekly", label: "Weekly", modifier: 0.85, note: "Every week" },
] as const;

export type FrequencyId = (typeof frequencies)[number]["id"];

/** Optional add-ons surfaced in the quote builder. price is a flat add. */
export const addOns = [
  { id: "windows", label: "Interior windows", price: 60 },
  { id: "deep", label: "Deep clean", price: 120 },
  { id: "fridge", label: "Inside fridge & oven", price: 45 },
  { id: "laundry", label: "Laundry & linens", price: 35 },
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
    id: "residential",
    name: "Residential Cleaning",
    description:
      "Recurring care for your home, surfaces, floors, kitchens and baths returned to a quiet, ordered calm.",
    base_price: 80,
    rate_per_m2: 1.8,
    multiplier: 1.0,
  },
  {
    id: "deep",
    name: "Signature Deep Clean",
    description:
      "A meticulous top-to-bottom reset. Grout, baseboards, fixtures and the details most services overlook.",
    base_price: 140,
    rate_per_m2: 2.6,
    multiplier: 1.0,
  },
  {
    id: "move",
    name: "Move-In / Move-Out",
    description:
      "Empty-home detailing so a space is flawless for its next chapter, or for handing back the keys.",
    base_price: 160,
    rate_per_m2: 2.9,
    multiplier: 1.0,
  },
  {
    id: "luxury",
    name: "Estate & Luxury Care",
    description:
      "Discreet, white-glove housekeeping for larger residences, with a dedicated team and bespoke checklist.",
    base_price: 240,
    rate_per_m2: 3.4,
    multiplier: 1.0,
  },
] as const;
