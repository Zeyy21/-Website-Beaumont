import { site } from "@/lib/config";
import { sendEmail } from "@/lib/email";

export interface QuoteNotificationDetails {
  name: string;
  email: string;
  accountEmail: string;
  phone: string;
  address: string;
  service: string;
  areaM2: number;
  frequency: string;
  conditionalServices: string[];
  estimate: number;
}

export interface QuoteNotificationDelivery {
  ok: boolean;
  detail?: string;
}

export async function sendQuoteNotification(
  details: QuoteNotificationDetails,
): Promise<QuoteNotificationDelivery> {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase();
  if (
    process.env.NODE_ENV === "production" &&
    (!provider || provider === "console")
  ) {
    return { ok: false, detail: "EMAIL_PROVIDER is not configured." };
  }

  const delivery = await sendEmail({
    to: process.env.QUOTE_NOTIFICATION_TO?.trim() || site.email,
    template: { kind: "quote_lead", ...details },
  });

  if (!delivery.ok || (delivery.provider === "console" && process.env.NODE_ENV === "production")) {
    return { ok: false, detail: delivery.detail || "The email provider rejected the request." };
  }

  return { ok: true };
}

export function notificationError(detail?: string) {
  return (detail || "Unknown email delivery error").slice(0, 1000);
}

