import { addOns, frequencies, quoteRatePerM2, type FrequencyId } from "./config";
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
  low: number;
  high: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Transparent public pricing model:
 * measured area × $3/m² + optional add-ons − points discount.
 * Service and visit frequency never alter the advertised square-metre rate.
 */
export function computeQuote(input: QuoteInput): QuoteResult {
  const { service, areaM2, frequency, addOnIds } = input;
  const freq = frequencies.find((item) => item.id === frequency) ?? frequencies[0];
  const area = Math.max(0, areaM2);
  const areaCost = area * quoteRatePerM2;

  const lineItems: LineItem[] = [
    {
      label: `${service.name} · ${Math.round(area)} m² at $${quoteRatePerM2}/m² · ${freq.label}`,
      amount: round2(areaCost),
    },
  ];

  for (const id of addOnIds) {
    const addOn = addOns.find((item) => item.id === id);
    if (addOn) lineItems.push({ label: addOn.label, amount: addOn.price });
  }

  const subtotal = round2(lineItems.reduce((sum, item) => sum + item.amount, 0));
  const pointsDiscount = Math.min(input.pointsDiscount ?? 0, subtotal);
  if (pointsDiscount > 0) {
    lineItems.push({ label: "Reward points", amount: -round2(pointsDiscount) });
  }

  const total = round2(subtotal - pointsDiscount);
  return { lineItems, subtotal, total, low: total, high: total };
}

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);

/** m² → ft² for display toggles. */
export const m2ToFt2 = (m2: number) => m2 * 10.7639;
