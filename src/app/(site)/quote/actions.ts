"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getServices } from "@/lib/data";
import { computeQuote } from "@/lib/pricing";
import { sendEmail } from "@/lib/email";
import { addOns, frequencies, site } from "@/lib/config";
import type { FrequencyId } from "@/lib/config";
import type { LineItem } from "@/lib/supabase/types";

export interface SaveQuotePayload {
  serviceId: string;
  address: string;
  areaM2: number;
  frequency: FrequencyId;
  addOnIds: string[];
  sourceZone?: string | null;
  fullName: string;
  email: string;
  phone: string;
}

export interface SaveQuoteResult {
  ok: boolean;
  quoteId?: string;
  total?: number;
  lineItems?: LineItem[];
  error?: string;
}

/**
 * Recomputes the estimate server-side, emails the complete lead to Beaumont,
 * and associates the request with the user when one is already signed in.
 */
export async function saveQuote(
  payload: SaveQuotePayload,
): Promise<SaveQuoteResult> {
  const services = await getServices();
  const service = services.find((s) => s.id === payload.serviceId);
  if (!service) return { ok: false, error: "Unknown service." };

  const fullName = payload.fullName.trim();
  const email = payload.email.trim().toLowerCase();
  const phone = payload.phone.trim();
  if (!fullName || !phone || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, error: "Please provide a valid name, email, and phone number." };
  }

  const quote = computeQuote({
    service,
    areaM2: payload.areaM2,
    frequency: payload.frequency,
    addOnIds: payload.addOnIds,
  });

  const supabase = createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const frequencyLabel =
    frequencies.find((item) => item.id === payload.frequency)?.label ?? payload.frequency;
  const conditionalServices: string[] = payload.addOnIds.flatMap((id) => {
    const addOn = addOns.find((item) => item.id === id);
    return addOn ? [addOn.label] : [];
  });

  const delivery = await sendEmail({
    to: site.email,
    template: {
      kind: "quote_lead",
      name: fullName,
      email,
      phone,
      address: payload.address,
      service: service.name,
      areaM2: payload.areaM2,
      frequency: frequencyLabel,
      conditionalServices,
      estimate: quote.total,
    },
  });

  if (!delivery.ok) {
    return { ok: false, error: "We could not send your request. Please try again." };
  }

  // Only persist a service_id that is a real UUID (fallback ids are slugs).
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      service.id,
    );

  const { data, error } = supabase ? await supabase
    .from("quotes")
    .insert({
      user_id: user?.id ?? null,
      service_id: isUuid ? service.id : null,
      address: payload.address,
      area_m2: payload.areaM2,
      frequency: payload.frequency,
      line_items: quote.lineItems,
      total: quote.total,
      status: "requested",
      source_zone: payload.sourceZone ?? null,
    })
    .select("id")
    .single() : { data: null, error: null };

  // Email delivery is the source of truth for a lead. Persistence is best-effort
  // because anonymous visitors may not have permission to insert database rows.
  if (error) console.error("[quote] request persistence failed:", error.message);

  revalidatePath("/dashboard");
  return {
    ok: true,
    quoteId: data?.id,
    total: quote.total,
    lineItems: quote.lineItems,
  };
}
