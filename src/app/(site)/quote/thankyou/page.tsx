import type { Metadata } from "next";
import { QuoteThankYouLetter } from "@/components/quote/quote-thank-you-letter";
import { getCurrentUser } from "@/lib/data";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const t = getDict().quoteThankYou;
  return { title: t.metaTitle, description: t.metaDescription };
}

export default async function QuoteThankYouPage({
  searchParams,
}: {
  searchParams: { delivery?: string; flow?: string; completeQuote?: string };
}) {
  const user = await getCurrentUser();
  return (
    <QuoteThankYouLetter
      signedIn={Boolean(user)}
      autoProceed={searchParams.flow === "quote" || searchParams.completeQuote === "1"}
      completePendingQuote={searchParams.completeQuote === "1"}
      initialDelivery={searchParams.delivery === "sent" ? "sent" : searchParams.delivery === "saved" ? "saved" : null}
    />
  );
}
