/**
 * Payments adapter. The manual transfer/cash path works with NO keys. Stripe
 * is enabled only when STRIPE_SECRET_KEY is present; until then the card option
 * renders in a disabled "coming soon" state (see PaymentOptions component).
 */

export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

export const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export interface ManualPaymentInstructions {
  method: "transfer" | "cash";
  heading: string;
  body: string;
}

/** Static instructions shown when a customer chooses a manual method. */
export function manualInstructions(
  method: "transfer" | "cash",
): ManualPaymentInstructions {
  if (method === "transfer") {
    return {
      method,
      heading: "Bank transfer",
      body: "Use your quote number as the reference. We'll mark the invoice paid as soon as funds arrive. Bank details are shown on your invoice and emailed with your confirmation.",
    };
  }
  return {
    method,
    heading: "Cash on service",
    body: "Pay your team directly at the end of your appointment. We'll record the payment and email a receipt.",
  };
}

/**
 * Create a Stripe Checkout session, server only. Returns a friendly disabled
 * result when no key is set so the caller can keep the UI coherent.
 */
export async function createCardCheckout(args: {
  amount: number;
  quoteId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ ok: boolean; url?: string; disabled?: boolean; error?: string }> {
  if (!stripeEnabled) {
    return { ok: false, disabled: true };
  }
  try {
    // Lazy import keeps stripe out of the bundle when unused / not installed.
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Beaumont service · ${args.quoteId}` },
            unit_amount: Math.round(args.amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: args.customerEmail,
      success_url: args.successUrl,
      cancel_url: args.cancelUrl,
      metadata: { quoteId: args.quoteId },
    });
    return { ok: true, url: session.url ?? undefined };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
