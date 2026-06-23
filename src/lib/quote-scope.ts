import type { Json, LineItem } from "@/lib/supabase/types";

const scopeDetailsKind = "scope_details";

export function lineItemsWithScopeDetails(
  lineItems: LineItem[],
  scopeDetails: string,
): LineItem[] {
  if (!scopeDetails.trim()) return lineItems;

  return [
    ...lineItems,
    {
      label: "Scope details",
      amount: 0,
      kind: scopeDetailsKind,
      details: scopeDetails,
      hidden: true,
    },
  ];
}

export function visibleLineItems(value: Json): LineItem[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is LineItem => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    if (item.kind === scopeDetailsKind || item.hidden === true) return false;
    return typeof item.label === "string" && typeof item.amount === "number";
  });
}

export function quoteScopeDetails(quote: {
  scope_details?: string | null;
  line_items?: Json;
}): string | undefined {
  if (quote.scope_details?.trim()) return quote.scope_details;
  if (!Array.isArray(quote.line_items)) return undefined;

  const scopeItem = quote.line_items.find((item) => {
    if (
      item &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      item.kind === scopeDetailsKind &&
      typeof item.details === "string"
    ) {
      return true;
    }
    return false;
  });

  if (!scopeItem || typeof scopeItem !== "object" || Array.isArray(scopeItem)) {
    return undefined;
  }

  return typeof scopeItem.details === "string" ? scopeItem.details : undefined;
}
