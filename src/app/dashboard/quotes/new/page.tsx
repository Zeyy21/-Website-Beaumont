import Link from "next/link";
import { QuoteBuilder } from "@/components/quote/quote-builder";
import { getServices } from "@/lib/data";

export const metadata = { title: "Request a quote" };

export default async function NewDashboardQuotePage() {
  const services = await getServices();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/quotes" className="text-sm font-medium text-cinnamon hover:underline">
          ← Back to quotes
        </Link>
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-cinnamon">New request</p>
        <h2 className="mt-3 font-display text-4xl leading-tight text-oak md:text-5xl">Request your next visit.</h2>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-soil/60">
          Measure the area, choose the care, and send the request directly from your client portal.
        </p>
      </div>
      <QuoteBuilder services={services} />
    </div>
  );
}
