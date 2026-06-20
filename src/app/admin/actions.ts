"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminGate } from "@/lib/admin";
import { sendEmail } from "@/lib/email";
import { site } from "@/lib/config";

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

  await supabase.from("quotes").update({ status: "sent" }).eq("id", quoteId);

  if (quote.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", quote.user_id)
      .single();
    // Look up the customer email via auth admin is out of scope here; email the
    // business + rely on in-app status. If you wire a profiles.email column,
    // send directly to the customer.
    await sendEmail({
      to: site.email,
      template: {
        kind: "quote_sent",
        name: profile?.full_name ?? "Customer",
        total: Number(quote.total),
        quoteUrl: `${site.url}/dashboard/quotes`,
      },
    });
  }

  revalidatePath("/admin");
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
