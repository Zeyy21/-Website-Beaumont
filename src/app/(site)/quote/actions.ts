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
  needsAuth?: boolean;
  quoteId?: string;
  total?: number;
  lineItems?: LineItem[];
  error?: string;
}

/**
 * Requires an authenticated account, recomputes the estimate server-side,
 * emails the complete lead to Beaumont, and saves it to the signed-in user.
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
  const address = payload.address.trim();
  if (
    !fullName ||
    !phone ||
    !address ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !Number.isFinite(payload.areaM2) ||
    payload.areaM2 <= 0
  ) {
    return { ok: false, error: "Please provide a valid name, email, and phone number." };
  }

  const quote = computeQuote({
    service,
    areaM2: payload.areaM2,
    frequency: payload.frequency,
    addOnIds: payload.addOnIds,
  });

  const supabase = createClient();
  if (!supabase) return { ok: false, needsAuth: true };

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { ok: false, needsAuth: true };

  const frequencyLabel =
    frequencies.find((item) => item.id === payload.frequency)?.label ?? payload.frequency;
  const conditionalServices: string[] = payload.addOnIds.flatMap((id) => {
    const addOn = addOns.find((item) => item.id === id);
    return addOn ? [addOn.label] : [];
  });

  const emailProvider = process.env.EMAIL_PROVIDER?.toLowerCase();
  if (
    process.env.NODE_ENV === "production" &&
    (!emailProvider || emailProvider === "console")
  ) {
    console.error("[quote] EMAIL_PROVIDER is not configured for production delivery.");
    return { ok: false, error: "Email delivery is temporarily unavailable. Please try again later." };
  }

  const delivery = await sendEmail({
    to: site.email,
    template: {
      kind: "quote_lead",
      name: fullName,
      email,
      accountEmail: user.email ?? email,
      phone,
      address,
      service: service.name,
      areaM2: payload.areaM2,
      frequency: frequencyLabel,
      conditionalServices,
      estimate: quote.total,
    },
  });

  if (
    !delivery.ok ||
    (delivery.provider === "console" && process.env.NODE_ENV === "production")
  ) {
    return { ok: false, error: "We could not send your request. Please try again." };
  }

  // Only persist a service_id that is a real UUID (fallback ids are slugs).
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      service.id,
    );

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      user_id: user.id,
      service_id: isUuid ? service.id : null,
      address,
      area_m2: payload.areaM2,
      frequency: payload.frequency,
      line_items: quote.lineItems,
      total: quote.total,
      status: "requested",
      source_zone: payload.sourceZone ?? null,
    })
    .select("id")
    .single();

  // Email delivery is the source of truth for the lead; database persistence
  // remains best-effort so a temporary storage issue never loses the request.
  if (error) console.error("[quote] request persistence failed:", error.message);

  revalidatePath("/dashboard");
  return {
    ok: true,
    quoteId: data?.id,
    total: quote.total,
    lineItems: quote.lineItems,
  };
}
