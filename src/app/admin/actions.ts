"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminGate } from "@/lib/admin";
import { sendEmail } from "@/lib/email";
import { frequencies, site } from "@/lib/config";
import { quoteScopeDetails } from "@/lib/quote-scope";
import {
  notificationError,
  sendQuoteNotification,
} from "@/lib/quote-notification";
import type { QuoteStatus } from "@/lib/supabase/types";

async function ensureStaff() {
  const gate = await adminGate();
  if (!gate.allowed) throw new Error("Not authorized");
  return createClient()!;
}

const adminQuoteStatuses: QuoteStatus[] = [
  "requested",
  "sent",
  "accepted",
  "scheduled",
  "completed",
];

function quotePaths(quoteId: string) {
  return ["/admin", "/admin/jobs", "/admin/payments", `/admin/quotes/${quoteId}`];
}

function revalidateQuoteAdmin(quoteId: string) {
  for (const path of quotePaths(quoteId)) revalidatePath(path);
  revalidatePath("/admin/clients");
}

function moneyFromForm(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").replace(/[$,\s]/g, "");
  if (!raw) return 0;
  const amount = Number(raw);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function statusFromForm(value: FormDataEntryValue | null): QuoteStatus {
  const status = String(value ?? "requested") as QuoteStatus;
  return adminQuoteStatuses.includes(status) ? status : "requested";
}

function dateTimeFromForm(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function updateQuoteFromForm(formData: FormData) {
  const supabase = await ensureStaff();
  const quoteId = String(formData.get("quote_id") ?? "");
  const total = moneyFromForm(formData.get("total"));
  if (!quoteId) return { ok: false, error: "Quote is missing." };
  if (total === null) return { ok: false, error: "Enter a valid quote amount." };

  const status = statusFromForm(formData.get("status"));
  const scheduledFor = dateTimeFromForm(formData.get("scheduled_for"));
  const internalNotes = String(formData.get("internal_notes") ?? "").trim();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("quotes")
    .update({
      total,
      status,
      internal_notes: internalNotes || null,
      scheduled_for: status === "scheduled" ? scheduledFor : null,
      completed_at: status === "completed" ? now : null,
    })
    .eq("id", quoteId);

  if (error) return { ok: false, error: error.message };
  revalidateQuoteAdmin(quoteId);
  return { ok: true, quoteId };
}

async function deliverQuoteToCustomer(quoteId: string) {
  const supabase = await ensureStaff();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .single();
  if (!quote) return { ok: false, error: "Quote not found." };
  if (!quote.requester_email) {
    return { ok: false, error: "Customer email is missing." };
  }
  if (Number(quote.total) <= 0) {
    return { ok: false, error: "Set the final quote amount before sending." };
  }

  const delivery = await sendEmail({
    to: quote.requester_email,
    template: {
      kind: "quote_sent",
      name: quote.requester_name ?? "Customer",
      total: Number(quote.total),
      quoteUrl: `${site.url}/dashboard/quotes`,
    },
  });
  if (!delivery.ok) {
    return { ok: false, error: "Customer email could not be delivered." };
  }

  const { error } = await supabase
    .from("quotes")
    .update({ status: "sent" })
    .eq("id", quoteId);
  if (error) return { ok: false, error: error.message };

  revalidateQuoteAdmin(quoteId);
  return { ok: true };
}

/** Marks a requested quote as "sent" and emails the customer a link. */
export async function sendQuoteToCustomer(quoteId: string) {
  return deliverQuoteToCustomer(quoteId);
}

export async function saveQuoteReview(formData: FormData) {
  return updateQuoteFromForm(formData);
}

export async function saveAndSendQuote(formData: FormData) {
  const saved = await updateQuoteFromForm(formData);
  if (!saved.ok || !saved.quoteId) return saved;
  return deliverQuoteToCustomer(saved.quoteId);
}

export async function applyPreviousQuote(formData: FormData) {
  const supabase = await ensureStaff();
  const quoteId = String(formData.get("quote_id") ?? "");
  const sourceQuoteId = String(formData.get("source_quote_id") ?? "");
  if (!quoteId || !sourceQuoteId) {
    return { ok: false, error: "Quote reference is missing." };
  }

  const [{ data: source }, { data: current }] = await Promise.all([
    supabase.from("quotes").select("*").eq("id", sourceQuoteId).single(),
    supabase.from("quotes").select("*").eq("id", quoteId).single(),
  ]);
  if (!source || !current) return { ok: false, error: "Quote not found." };
  if (Number(source.total) <= 0) {
    return { ok: false, error: "Previous quote has no confirmed amount." };
  }

  const note = [
    current.internal_notes?.trim() || null,
    `Reused previous quote ${source.id.slice(0, 8)} from ${new Date(
      source.created_at,
    ).toLocaleDateString("en-CA")} at $${Number(source.total).toFixed(0)}.`,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await supabase
    .from("quotes")
    .update({
      total: Number(source.total),
      line_items: source.line_items,
      internal_notes: note,
    })
    .eq("id", quoteId);

  if (error) return { ok: false, error: error.message };
  revalidateQuoteAdmin(quoteId);
  return { ok: true };
}

export async function applyPreviousQuoteForm(formData: FormData) {
  await applyPreviousQuote(formData);
}

async function updateQuoteStatus(quoteId: string, status: QuoteStatus) {
  const supabase = await ensureStaff();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("quotes")
    .update({
      status,
      completed_at: status === "completed" ? now : null,
    })
    .eq("id", quoteId);
  if (error) return { ok: false, error: error.message };
  revalidateQuoteAdmin(quoteId);
  return { ok: true };
}

export async function markQuoteAccepted(quoteId: string) {
  return updateQuoteStatus(quoteId, "accepted");
}

export async function markQuoteScheduled(quoteId: string) {
  return updateQuoteStatus(quoteId, "scheduled");
}

export async function markQuoteCompleted(quoteId: string) {
  return updateQuoteStatus(quoteId, "completed");
}

export async function saveClientNotes(formData: FormData) {
  const supabase = await ensureStaff();
  const profileId = String(formData.get("profile_id") ?? "");
  const notes = String(formData.get("internal_notes") ?? "").trim();
  if (!profileId) return { ok: false, error: "Client profile is missing." };

  const { error } = await supabase
    .from("profiles")
    .update({ internal_notes: notes || null })
    .eq("id", profileId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/clients");
  return { ok: true };
}

export async function saveClientNotesForm(formData: FormData) {
  await saveClientNotes(formData);
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
    !quote.service_name
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
    frequency,
    conditionalServices,
    scopeDetails: quoteScopeDetails(quote),
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
  revalidatePath("/admin/quotes");
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
  revalidatePath("/admin/payments");
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
