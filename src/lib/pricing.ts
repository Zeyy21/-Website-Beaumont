import { addOns, frequencies, type FrequencyId } from "./config";
import type { LineItem } from "./supabase/types";

export interface PricingService {
  id: string;
  name: string;
  base_price: number;
  rate_per_m2: number;
  multiplier: number;
}

export interface QuoteInput {
  service: PricingService;
  areaM2: number;
  frequency: FrequencyId;
  addOnIds: string[];
  /** Optional discount from redeemed reward points, in dollars. */
  pointsDiscount?: number;
}

export interface QuoteResult {
  lineItems: LineItem[];
  subtotal: number;
  total: number;
  /** ± band shown to the user as a range, e.g. total × 0.9 … total × 1.12. */
  low: number;
  high: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Transparent pricing model:
 *   base + (area × rate × serviceMultiplier × frequencyModifier) + addOns − pointsDiscount
 * Returns itemized lines plus a low/high band for the "instant estimate" range.
 */
export function computeQuote(input: QuoteInput): QuoteResult {
  const { service, areaM2, frequency, addOnIds } = input;

  const freq =
    frequencies.find((f) => f.id === frequency) ?? frequencies[0];
  const area = Math.max(0, areaM2);

  const areaCost =
    area * service.rate_per_m2 * service.multiplier * freq.modifier;

  const lineItems: LineItem[] = [
    { label: `${service.name}, base`, amount: round2(service.base_price) },
    {
      label: `Area · ${Math.round(area)} m² · ${freq.label}`,
      amount: round2(areaCost),
    },
  ];

  for (const id of addOnIds) {
    const a = addOns.find((x) => x.id === id);
    if (a) lineItems.push({ label: a.label, amount: a.price });
  }

  const subtotal = round2(
    lineItems.reduce((sum, li) => sum + li.amount, 0),
  );

  const pointsDiscount = Math.min(input.pointsDiscount ?? 0, subtotal);
  if (pointsDiscount > 0) {
    lineItems.push({ label: "Reward points", amount: -round2(pointsDiscount) });
  }

  const total = round2(subtotal - pointsDiscount);

  return {
    lineItems,
    subtotal,
    total,
    low: round2(total * 0.9),
    high: round2(total * 1.12),
  };
}

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

/** m² → ft² for display toggles. */
export const m2ToFt2 = (m2: number) => m2 * 10.7639;
