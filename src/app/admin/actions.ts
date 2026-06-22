"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminGate } from "@/lib/admin";
import { sendEmail } from "@/lib/email";
import { frequencies, site } from "@/lib/config";
import {
  notificationError,
  sendQuoteNotification,
} from "@/lib/quote-notification";

async function ensureStaff() {
  const gate = await adminGate();
  if (!gate.allowed) throw new Error("Not authorized");
  return createClient()!;
}

/** Marks a requested quote as "sent" and emails the customer a link. */
export async function sendQuoteToCustomer(quoteId: string) {
  const supabase = await ensureStaff();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .single();
  if (!quote) return { ok: false, error: "Quote not found." };

  if (quote.requester_email) {
    const delivery = await sendEmail({
      to: quote.requester_email,
      template: {
        kind: "quote_sent",
        name: quote.requester_name ?? "Customer",
        total: Number(quote.total),
        quoteUrl: `${site.url}/dashboard/quotes`,
      },
    });
    if (!delivery.ok) return { ok: false, error: "Customer email could not be delivered." };
  }

  await supabase.from("quotes").update({ status: "sent" }).eq("id", quoteId);

  revalidatePath("/admin");
  return { ok: true };
}

/** Retries the internal notification for a quote that is already safely saved. */
export async function retryQuoteNotification(quoteId: string) {
  const supabase = await ensureStaff();
  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .single();

  if (error || !quote) return { ok: false, error: "Quote not found." };
  if (
    !quote.requester_name ||
    !quote.requester_email ||
    !quote.requester_phone ||
    !quote.address ||
    !quote.service_name ||
    !quote.area_m2
  ) {
    return { ok: false, error: "This older quote does not contain every notification field." };
  }

  const conditionalServices = Array.isArray(quote.conditional_services)
    ? quote.conditional_services.filter((item): item is string => typeof item === "string")
    : [];
  const frequency =
    frequencies.find((item) => item.id === quote.frequency)?.label ??
    quote.frequency ??
    "Not selected";
  const delivery = await sendQuoteNotification({
    name: quote.requester_name,
    email: quote.requester_email,
    accountEmail: quote.account_email ?? quote.requester_email,
    phone: quote.requester_phone,
    address: quote.address,
    service: quote.service_name,
    areaM2: Number(quote.area_m2),
    frequency,
    conditionalServices,
    estimate: Number(quote.total),
  });

  const { error: updateError } = await supabase
    .from("quotes")
    .update({
      notification_status: delivery.ok ? "sent" : "failed",
      notification_error: delivery.ok ? null : notificationError(delivery.detail),
      notification_sent_at: delivery.ok ? new Date().toISOString() : null,
    })
    .eq("id", quoteId);

  revalidatePath("/admin");
  if (updateError) return { ok: false, error: "Notification status could not be updated." };
  if (!delivery.ok) return { ok: false, error: "Email delivery failed again. The quote remains saved." };
  return { ok: true };
}

/** Marks a payment as paid (e.g. transfer landed / cash received). */
export async function markPaymentPaid(paymentId: string) {
  const supabase = await ensureStaff();
  const { error } = await supabase
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", paymentId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

/** Updates a service's pricing knobs from the admin pricing editor. */
export async function updateServicePricing(
  serviceId: string,
  fields: { base_price: number; rate_per_m2: number; multiplier: number },
) {
  const supabase = await ensureStaff();
  const { error } = await supabase
    .from("services")
    .update(fields)
    .eq("id", serviceId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/pricing");
  revalidatePath("/services");
  return { ok: true };
}

/** Adds a featured before/after gallery item (URLs from Storage or external). */
export async function addGalleryItem(fields: {
  before_url: string;
  after_url: string;
  caption: string;
  featured: boolean;
}) {
  const supabase = await ensureStaff();
  const { error } = await supabase.from("gallery_items").insert(fields);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/gallery");
  return { ok: true };
}
