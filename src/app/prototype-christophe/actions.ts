"use server";

import { site } from "@/lib/config";
import { sendEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export interface SalesApplicationState {
  ok?: boolean;
  error?: string;
}

const LIMITS = { name: 120, phone: 40, email: 160, motivation: 4000 };

/**
 * Handles a sales-rep application from the private /prototype-christophe page.
 *
 * Follows the app's zero-key principle: it persists to Supabase when a project
 * is configured AND emails the Beaumont hiring inbox. The submission succeeds
 * as long as at least one path captured it, so the form still works in local
 * preview mode (console email) and stays reliable in production.
 */
export async function submitSalesApplication(
  _prev: SalesApplicationState,
  formData: FormData,
): Promise<SalesApplicationState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motivation = String(formData.get("motivation") ?? "").trim();
  const scheduleRaw = String(formData.get("schedule_ok") ?? "");

  if (!fullName || fullName.length > LIMITS.name) {
    return { error: "Please enter your name." };
  }
  if (!phone || phone.length > LIMITS.phone) {
    return { error: "Please enter a phone number where we can reach you." };
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > LIMITS.email) {
    return { error: "Please enter a valid email address." };
  }
  if (!motivation || motivation.length > LIMITS.motivation) {
    return { error: "Please tell us why you want to get into sales." };
  }
  if (scheduleRaw !== "yes" && scheduleRaw !== "no") {
    return { error: "Please answer the schedule question." };
  }
  const scheduleOk = scheduleRaw === "yes";

  let stored = false;
  const supabase = createClient();
  if (supabase) {
    const { error } = await supabase.from("sales_applications").insert({
      full_name: fullName,
      phone,
      email,
      motivation,
      schedule_ok: scheduleOk,
      source: "prototype-christophe",
    });
    if (error) {
      console.error("[sales-application] persistence failed:", error.message);
    } else {
      stored = true;
    }
  }

  const delivery = await sendEmail({
    to:
      process.env.SALES_APPLICATION_TO?.trim() ||
      process.env.QUOTE_NOTIFICATION_TO?.trim() ||
      site.email,
    template: {
      kind: "sales_application",
      name: fullName,
      email,
      phone,
      motivation,
      scheduleOk,
    },
  });
  // A console-driver "send" in production means nothing actually went out.
  const emailed =
    delivery.ok &&
    !(delivery.provider === "console" && process.env.NODE_ENV === "production");

  if (!stored && !emailed) {
    console.error("[sales-application] not captured (no store, email failed).");
    return {
      error:
        "We couldn't submit your application just now. Please try again in a moment.",
    };
  }

  return { ok: true };
}
