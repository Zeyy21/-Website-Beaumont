import type { Metadata } from "next";
import { getServices } from "@/lib/data";
import { addOns, frequencies } from "@/lib/config";
import { formatCurrency } from "@/lib/pricing";
import {
  ButtonLink,
  Container,
  Eyebrow,
  SectionHeading,
} from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { BeforeAfter } from "@/components/before-after";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Beaumont's premium cleaning services, residential, deep clean, move-in/out, and estate care.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="texture-soil text-ivory">
        <Container className="py-24 text-center">
          <Reveal>
            <Eyebrow>What we do</Eyebrow>
            <h1 className="mx-auto mt-4 max-w-3xl text-5xl md:text-6xl">
              Meticulous care for every kind of home
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ivory/70">
              Choose a service below, then build a transparent quote in under a
              minute, area-based pricing, no surprises.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <Stagger className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <StaggerItem key={s.id}>
                <article className="flex h-full flex-col rounded-2xl border border-oak/10 bg-white p-8">
                  <h2 className="text-3xl text-oak">{s.name}</h2>
                  <p className="mt-3 flex-1 text-soil/70">{s.description}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-oak/10 pt-6 text-sm">
                    <div>
                      <dt className="text-soil/50">Starting at</dt>
                      <dd className="font-display text-2xl text-oak">
                        {formatCurrency(s.base_price)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-soil/50">Then per m²</dt>
                      <dd className="font-display text-2xl text-oak">
                        {formatCurrency(s.rate_per_m2)}
                      </dd>
                    </div>
                  </dl>
                  <ButtonLink href="/quote" className="mt-6 w-full">
                    Build a quote
                  </ButtonLink>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-sand/30 py-24">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <BeforeAfter caption="Estate & Luxury Care, living room" />
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading
              eyebrow="Flexible & rewarding"
              title="Tailor every detail"
              intro="Set a rhythm that suits you and add the finishing touches your home deserves."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-ochre">
                  Frequencies
                </h3>
                <ul className="mt-3 space-y-2 text-soil/75">
                  {frequencies.map((f) => (
                    <li key={f.id} className="flex justify-between gap-4">
                      <span>{f.label}</span>
                      <span className="text-soil/50">{f.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-ochre">
                  Add-ons
                </h3>
                <ul className="mt-3 space-y-2 text-soil/75">
                  {addOns.map((a) => (
                    <li key={a.id} className="flex justify-between gap-4">
                      <span>{a.label}</span>
                      <span className="text-soil/50">
                        +{formatCurrency(a.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-24">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-display text-4xl text-oak">
              Ready for a spotless home?
            </h2>
            <ButtonLink href="/quote" size="lg" className="mt-8">
              Get your instant quote
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
