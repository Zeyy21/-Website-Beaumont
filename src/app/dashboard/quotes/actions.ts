"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { getDict } from "@/lib/i18n/server";

export async function cancelQuote(quoteId: string) {
  const t = getDict().dashboard.quotes;
  const supabase = createClient();
  if (!supabase) return { error: t.errUnavailable };

  const { data: userResponse } = await supabase.auth.getUser();
  const user = userResponse?.user;

  if (!user) {
    return { error: t.errMustLogin };
  }

  // Fetch the quote to make sure it belongs to the user and to get details for the email
  const { data: quote, error: fetchError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !quote) {
    return { error: t.errNotFound };
  }

  // Delete the quote
  const { error: deleteError } = await supabase
    .from("quotes")
    .delete()
    .eq("id", quoteId)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("Failed to delete quote:", deleteError);
    return { error: t.errCancelFailed };
  }

  // Send the cancellation email
  // We use user.email or the account email associated with the quote
  const emailToSendTo = quote.requester_email || quote.account_email || user.email;
  const name = quote.requester_name || user.user_metadata?.full_name || "Customer";

  if (emailToSendTo) {
    await sendEmail({
      to: emailToSendTo,
      template: {
        kind: "quote_cancelled",
        name: name,
        address: quote.address || "your property",
        total: Number(quote.total || 0),
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/quotes");

  return { ok: true };
}
