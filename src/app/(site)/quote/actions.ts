"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getServices } from "@/lib/data";
import { computeQuote } from "@/lib/pricing";
import { addOns, frequencies } from "@/lib/config";
import type { FrequencyId } from "@/lib/config";
import {
  notificationError,
  sendQuoteNotification,
} from "@/lib/quote-notification";
import type { QuoteNotificationStatus } from "@/lib/supabase/types";
import type { LineItem } from "@/lib/supabase/types";

export interface SaveQuotePayload {
  requestId: string;
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
  saved?: boolean;
  notificationStatus?: QuoteNotificationStatus;
  error?: string;
}

/**
 * Requires an authenticated account, recomputes the estimate server-side,
 * emails the complete lead to Beaumont, and saves it to the signed-in user.
 */
export async function saveQuote(
  payload: SaveQuotePayload,
): Promise<SaveQuoteResult> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.requestId)) {
    return { ok: false, error: "This quote request is invalid. Please try again." };
  }

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

  const { data: existing, error: existingError } = await supabase
    .from("quotes")
    .select("*")
    .eq("request_key", payload.requestId)
    .maybeSingle();

  if (existingError) {
    return { ok: false, error: "Quote storage is temporarily unavailable. Please try again." };
  }
  if (existing) {
    return {
      ok: true,
      saved: true,
      quoteId: existing.id,
      total: Number(existing.total),
      notificationStatus: existing.notification_status,
    };
  }

  // Only persist a service_id that is a real UUID (fallback ids are slugs).
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      service.id,
    );

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      request_key: payload.requestId,
      user_id: user.id,
      service_id: isUuid ? service.id : null,
      address,
      area_m2: payload.areaM2,
      frequency: payload.frequency,
      line_items: quote.lineItems,
      total: quote.total,
      status: "requested",
      source_zone: payload.sourceZone ?? null,
      requester_name: fullName,
      requester_email: email,
      account_email: user.email ?? email,
      requester_phone: phone,
      service_name: service.name,
      conditional_services: conditionalServices,
      notification_status: "pending",
      notification_error: null,
      notification_sent_at: null,
    })
    .select("*")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      const { data: duplicate } = await supabase
        .from("quotes")
        .select("*")
        .eq("request_key", payload.requestId)
        .maybeSingle();
      if (duplicate) {
        return {
          ok: true,
          saved: true,
          quoteId: duplicate.id,
          total: Number(duplicate.total),
          notificationStatus: duplicate.notification_status,
        };
      }
    }
    console.error("[quote] request persistence failed:", error?.message);
    return { ok: false, error: "We could not safely save your quote. Please try again." };
  }

  const delivery = await sendQuoteNotification({
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
  });

  const notificationStatus: QuoteNotificationStatus = delivery.ok ? "sent" : "failed";
  const sentAt = delivery.ok ? new Date().toISOString() : null;
  const errorDetail = delivery.ok ? null : notificationError(delivery.detail);
  const { error: notificationUpdateError } = await supabase
    .from("quotes")
    .update({
      notification_status: notificationStatus,
      notification_error: errorDetail,
      notification_sent_at: sentAt,
    })
    .eq("id", data.id);

  if (notificationUpdateError) {
    console.error("[quote] notification status update failed:", notificationUpdateError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return {
    ok: true,
    saved: true,
    quoteId: data?.id,
    total: quote.total,
    lineItems: quote.lineItems,
    notificationStatus,
  };
}
