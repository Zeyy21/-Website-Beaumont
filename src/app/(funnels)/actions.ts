"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  notificationError,
  sendQuoteNotification,
} from "@/lib/quote-notification";
import type { Database, QuoteNotificationStatus } from "@/lib/supabase/types";

export interface FunnelLeadState {
  ok?: boolean;
  error?: string;
}

const LIMITS = { name: 120, address: 200, service: 120, phone: 40, email: 160 };

/**
 * Handles a lead from the ad-funnel landing pages (/getquote, /learnmore).
 *
 * Unlike the account-gated quote builder, this captures an ANONYMOUS lead
 * (user_id null — allowed by the quotes_insert RLS policy) so paid traffic can
 * convert without a signup step, then emails the team exactly like a normal
 * quote request. Follows the zero-key pattern: succeeds if the lead was stored
 * OR emailed, so it still works in local preview mode.
 */
export async function submitFunnelLead(
  _prev: FunnelLeadState,
  formData: FormData,
): Promise<FunnelLeadState> {
  const errorMessage = String(formData.get("errorMessage") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const consent = String(formData.get("casl_consent") ?? "") === "yes";
  const source = String(formData.get("source") ?? "").trim() || "funnel";

  const fail = { error: errorMessage || "Please check your details and try again." };

  if (!name || name.length > LIMITS.name) return fail;
  if (!address || address.length > LIMITS.address) return fail;
  if (!service || service.length > LIMITS.service) return fail;
  if (!phone || phone.length > LIMITS.phone) return fail;
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > LIMITS.email) return fail;

  const scopeDetails = [
    `Lead source: ${source} funnel`,
    `Service requested: ${service}`,
    `Marketing consent: ${consent ? "yes" : "no"}`,
  ].join("\n");
  const conditionalServices = consent ? ["Marketing opt-in"] : [];

  let stored = false;
  let quoteId: string | null = null;
  const supabase = createClient();
  if (supabase) {
    const insert: Database["public"]["Tables"]["quotes"]["Insert"] = {
      request_key: randomUUID(),
      user_id: null,
      service_id: null,
      address,
      area_m2: null,
      frequency: null,
      line_items: [],
      total: 0,
      status: "requested",
      source_zone: `funnel:${source}`,
      requester_name: name,
      requester_email: email,
      account_email: email,
      requester_phone: phone,
      service_name: service,
      conditional_services: conditionalServices,
      scope_details: scopeDetails,
      notification_status: "pending",
      notification_error: null,
      notification_sent_at: null,
    };

    let { data, error } = await supabase
      .from("quotes")
      .insert(insert)
      .select("id")
      .single();

    if (isMissingColumnError(error, "scope_details")) {
      const compat = { ...insert };
      delete compat.scope_details;
      const retry = await supabase
        .from("quotes")
        .insert(compat)
        .select("id")
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error || !data) {
      console.error("[funnel] lead persistence failed:", error?.message);
    } else {
      stored = true;
      quoteId = data.id;
    }
  }

  const delivery = await sendQuoteNotification({
    name,
    email,
    accountEmail: email,
    phone,
    address,
    service,
    frequency: "To confirm",
    conditionalServices,
    scopeDetails,
    estimate: 0,
  });

  if (stored && quoteId) {
    const status: QuoteNotificationStatus = delivery.ok ? "sent" : "failed";
    await supabase!
      .from("quotes")
      .update({
        notification_status: status,
        notification_error: delivery.ok ? null : notificationError(delivery.detail),
        notification_sent_at: delivery.ok ? new Date().toISOString() : null,
      })
      .eq("id", quoteId);
    revalidatePath("/admin");
  }

  if (!stored && !delivery.ok) {
    console.error("[funnel] lead not captured (no store, email failed).");
    return fail;
  }

  return { ok: true };
}

function isMissingColumnError(
  error: { code?: string; message?: string } | null,
  column: string,
) {
  if (!error) return false;
  const message = error.message ?? "";
  return (
    error.code === "PGRST204" ||
    message.includes(`'${column}' column`) ||
    message.includes(`'${column}' in the schema cache`)
  );
}
