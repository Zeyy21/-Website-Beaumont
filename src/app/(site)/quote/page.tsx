import type { Metadata } from "next";
import { getServices } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { Container, Eyebrow } from "@/components/ui";
import { QuoteBuilder } from "@/components/quote/quote-builder";

export const metadata: Metadata = {
  title: "Instant Quote",
  description:
    "Draw your property on the map and get an instant, transparent cleaning estimate from Beaumont.",
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: { zone?: string; tag?: string };
}) {
  const services = await getServices();
  const zone = searchParams.zone ?? null;

  // Log a door-tag scan if this visit came from a tag (best-effort, no-op w/o DB).
  if (zone || searchParams.tag) {
    const supabase = createClient();
    if (supabase) {
      await supabase
        .from("door_tag_scans")
        .insert({ zone, tag_id: searchParams.tag ?? null });
    }
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="mb-10 text-center">
          <Eyebrow>Instant quote</Eyebrow>
          <h1 className="mx-auto mt-3 max-w-2xl text-4xl text-oak md:text-5xl">
            A transparent price in three easy steps
          </h1>
          {zone && (
            <p className="mt-3 text-sm text-ochre">
              Welcome, neighbour in {zone}, your estimate is pre-tuned for your area.
            </p>
          )}
        </div>
        <QuoteBuilder services={services} initialZone={zone} />
      </Container>
    </section>
  );
}
