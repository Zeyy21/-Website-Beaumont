"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createCardCheckout } from "@/lib/payments";
import { sendEmail } from "@/lib/email";
import { site } from "@/lib/config";

export interface PayResult {
  ok: boolean;
  url?: string;
  disabled?: boolean;
  message?: string;
  error?: string;
}

/**
 * Records a manual (transfer/cash) payment as "awaiting" against a quote.
 * Staff later marks it paid from the admin panel.
 */
export async function recordManualPayment(
  quoteId: string,
  amount: number,
  method: "transfer" | "cash",
): Promise<PayResult> {
  const supabase = createClient();
  if (!supabase) return { ok: false, error: "Payments are not enabled yet." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in." };

  const { error } = await supabase.from("payments").insert({
    user_id: user.id,
    quote_id: quoteId,
    amount,
    method,
    status: "awaiting",
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/payments");
  return {
    ok: true,
    message:
      method === "transfer"
        ? "Recorded. Use your quote number as the transfer reference — we'll confirm once funds arrive."
        : "Recorded. Pay your team at the appointment and we'll mark it complete.",
  };
}

/**
 * Starts a Stripe Checkout session for a quote, or reports `disabled` when no
 * Stripe key is configured (so the UI can show the card option greyed out).
 */
export async function startCardPayment(
  quoteId: string,
  amount: number,
): Promise<PayResult> {
  const res = await createCardCheckout({
    amount,
    quoteId,
    successUrl: `${site.url}/dashboard/payments?paid=1`,
    cancelUrl: `${site.url}/dashboard/payments`,
  });
  if (res.disabled) return { ok: false, disabled: true };
  if (res.ok && res.url) return { ok: true, url: res.url };
  return { ok: false, error: res.error ?? "Could not start card payment." };
}
