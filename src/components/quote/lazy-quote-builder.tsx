"use client";

import type { ServiceCard } from "@/lib/data";
import { QuoteBuilder } from "./quote-builder";

/**
 * The map itself remains dynamically loaded after address selection. Rendering
 * the quote shell immediately keeps every one-page anchor dimensionally stable.
 */
export function LazyQuoteBuilder({ services }: { services: ServiceCard[] }) {
  return <QuoteBuilder services={services} initialZone={null} />;
}
