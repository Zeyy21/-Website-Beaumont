import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/quote/quote-builder";
import { QuoteResumeAnchor } from "@/components/quote/quote-resume-anchor";
import { getServices } from "@/lib/data";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const dict = getDict();
  return {
    title: dict.quotePage.metaTitle,
    description: dict.quotePage.metaDescription,
  };
}

export default async function QuotePage() {
  const services = await getServices();

  return (
    <main className="min-h-screen bg-ivory p-3 sm:p-6 lg:p-8">
      <QuoteResumeAnchor />
      <div id="estimate" className="mx-auto max-w-[96rem]">
        <QuoteBuilder services={services} />
      </div>
    </main>
  );
}
