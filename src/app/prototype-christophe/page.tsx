import type { Metadata } from "next";
import { Wordmark } from "@/components/ui";
import { SalesApplicationForm } from "@/components/sales-application-form";

/**
 * Private, unlisted recruiting page. It is intentionally not linked anywhere
 * in the site navigation — reachable only by its direct URL — and marked
 * noindex so search engines don't surface it.
 */
export const metadata: Metadata = {
  title: "Sales Team Application",
  robots: { index: false, follow: false },
};

export default function PrototypeChristophePage() {
  return (
    <main className="relative min-h-screen bg-ivory text-soil">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cinnamon/10 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-16">
        <div className="mb-8 flex flex-col items-center text-center">
          <Wordmark className="w-40" dark priority />
          <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-ochre">
            Careers · Sales
          </span>
          <h1 className="mt-3 font-display text-4xl leading-tight text-oak md:text-5xl">
            Join the Beaumont sales team
          </h1>
          <p className="mt-4 max-w-md text-soil/70">
            We&rsquo;re hiring driven sales representatives. Tell us a little
            about yourself — it takes under two minutes.
          </p>
        </div>

        <div className="rounded-3xl border border-sand bg-white/70 p-6 shadow-soft backdrop-blur md:p-8">
          <SalesApplicationForm />
        </div>
      </div>
    </main>
  );
}
