"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

export async function cancelQuote(quoteId: string) {
  const supabase = createClient();
  const { data: userResponse } = await supabase.auth.getUser();
  const user = userResponse?.user;

  if (!user) {
    return { error: "You must be logged in to cancel a quote." };
  }

  // Fetch the quote to make sure it belongs to the user and to get details for the email
  const { data: quote, error: fetchError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !quote) {
    return { error: "Quote not found or you don't have permission to cancel it." };
  }

  // Delete the quote
  const { error: deleteError } = await supabase
    .from("quotes")
    .delete()
    .eq("id", quoteId)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("Failed to delete quote:", deleteError);
    return { error: "Failed to cancel quote. Please try again." };
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

  return { ok: true };
}
