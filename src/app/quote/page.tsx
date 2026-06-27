import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/quote/quote-builder";
import { QuoteResumeAnchor } from "@/components/quote/quote-resume-anchor";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free estimate",
  description:
    "Build your Beaumont exterior-care request in about two minutes. A specialist reviews every detail and replies with a clear written quote, usually within 24 hours.",
};

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
