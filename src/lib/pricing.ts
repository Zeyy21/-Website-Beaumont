import { frequencies, type FrequencyId } from "./config";
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

/**
 * Review-based quote model.
 *
 * Public requests no longer expose per-area rates. Staff confirm pricing after
 * reviewing service scope, access, and surface condition.
 */
export function computeQuote(input: QuoteInput): QuoteResult {
  const { service, frequency } = input;
  const freq = frequencies.find((item) => item.id === frequency) ?? frequencies[0];

  const lineItems: LineItem[] = [
    {
      label: `${service.name} request - ${freq.label}`,
      amount: 0,
    },
  ];

  const subtotal = 0;
  const total = 0;
  return { lineItems, subtotal, total, low: total, high: total };
}

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);

/** m2 -> ft2 for legacy display toggles. */
export const m2ToFt2 = (m2: number) => m2 * 10.7639;
