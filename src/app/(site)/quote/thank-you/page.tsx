import { redirect } from "next/navigation";

/** Preserve old links while making `thankyou` the canonical confirmation URL. */
export default function LegacyQuoteThankYouPage({
  searchParams,
}: {
  searchParams: { delivery?: string; flow?: string; completeQuote?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.delivery === "sent" || searchParams.delivery === "saved") {
    params.set("delivery", searchParams.delivery);
  }
  if (searchParams.flow === "quote") params.set("flow", "quote");
  if (searchParams.completeQuote === "1") params.set("completeQuote", "1");
  redirect(`/quote/thankyou${params.size ? `?${params.toString()}` : ""}`);
}
