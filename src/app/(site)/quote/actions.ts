"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getServices } from "@/lib/data";
import { computeQuote } from "@/lib/pricing";
import { sendEmail } from "@/lib/email";
import { site } from "@/lib/config";
import type { FrequencyId } from "@/lib/config";
import type { LineItem } from "@/lib/supabase/types";

export interface SaveQuotePayload {
  serviceId: string;
  address: string;
  areaM2: number;
  frequency: FrequencyId;
  addOnIds: string[];
  sourceZone?: string | null;
  /** "save" keeps it as a draft; "request" notifies staff + emails customer. */
  intent: "save" | "request";
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
 * Recomputes the price SERVER-SIDE (never trust the client total), persists the
 * quote, and on "request" emails the customer + flags staff. Requires auth to
 * save; returns needsAuth so the UI can route to login while preserving intent.
 */
export async function saveQuote(
  payload: SaveQuotePayload,
): Promise<SaveQuoteResult> {
  const services = await getServices();
  const service = services.find((s) => s.id === payload.serviceId);
  if (!service) return { ok: false, error: "Unknown service." };

  const quote = computeQuote({
    service,
    areaM2: payload.areaM2,
    frequency: payload.frequency,
    addOnIds: payload.addOnIds,
  });

  const supabase = createClient();
  if (!supabase) {
    // No backend configured: return the computed quote so the UI can still show
    // a confirmation, but we cannot persist or require an account.
    return {
      ok: true,
      total: quote.total,
      lineItems: quote.lineItems,
      error: "preview", // signal: not persisted
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, needsAuth: true };

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
      address: payload.address,
      area_m2: payload.areaM2,
      frequency: payload.frequency,
      line_items: quote.lineItems,
      total: quote.total,
      status: payload.intent === "request" ? "requested" : "draft",
      source_zone: payload.sourceZone ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not save quote." };
  }

  if (payload.intent === "request" && user.email) {
    await sendEmail({
      to: user.email,
      template: {
        kind: "quote_requested",
        name: user.email.split("@")[0],
        total: quote.total,
        address: payload.address,
      },
    });
    // Notify the business inbox too (console driver until email is configured).
    await sendEmail({
      to: site.email,
      template: {
        kind: "quote_requested",
        name: "Beaumont team",
        total: quote.total,
        address: payload.address,
      },
    });
  }

  revalidatePath("/dashboard");
  return {
    ok: true,
    quoteId: data.id,
    total: quote.total,
    lineItems: quote.lineItems,
  };
}
