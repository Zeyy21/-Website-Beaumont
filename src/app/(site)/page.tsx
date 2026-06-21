import Image from "next/image";
import { Hero } from "@/components/hero";
import { ExperienceSequence } from "@/components/home-experience";
import { LazyQuoteBuilder } from "@/components/quote/lazy-quote-builder";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { getServices } from "@/lib/data";
import { formatCurrency } from "@/lib/pricing";
import { site } from "@/lib/config";

const serviceImages = [
  "/images/pressure-washed-driveway-placeholder.png",
  "/images/pressure-washed-patio-placeholder.png",
  "/images/pressure-washed-entry-placeholder.png",
  "/images/montreal-home-hero.png",
];

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      <Hero />

      <section id="services" className="scroll-mt-20 overflow-hidden bg-ivory py-24 md:py-36" aria-labelledby="services-title">
        <Container>
          <Reveal className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <Eyebrow>Services</Eyebrow>
              <p className="mt-5 max-w-sm text-base font-medium leading-relaxed text-soil/70">
                Exterior care selected for the surface, the setting, and the result you want to come home to.
              </p>
            </div>
            <h2 id="services-title" className="max-w-4xl text-balance font-display text-[clamp(3.25rem,6.2vw,6.5rem)] leading-[0.9] text-oak">
              Everything the exterior needs.
              <span className="block italic text-ochre">Nothing it doesn’t.</span>
            </h2>
          </Reveal>

          <Stagger className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-oak/10 bg-oak/10 md:grid-cols-2 md:rounded-[3rem]">
            {services.map((service, index) => (
              <StaggerItem key={service.id}>
                <article className="group relative min-h-[30rem] overflow-hidden bg-soil text-ivory md:min-h-[36rem]">
                  <Image
                    src={serviceImages[index % serviceImages.length]}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-soil/95 via-soil/30 to-soil/5" />
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
                    <div className="flex items-center justify-between gap-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-sand">
                      <span>0{index + 1}</span>
                      <span>From {formatCurrency(service.base_price)}</span>
                    </div>
                    <h3 className="mt-5 max-w-lg font-display text-4xl leading-[0.98] md:text-5xl">{service.name}</h3>
                    <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-ivory/75 md:text-base">{service.description}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <ExperienceSequence />

      <section className="bg-ivory py-24 md:py-32" aria-label="Client testimonial">
        <Container>
          <Reveal className="mx-auto max-w-5xl border-y border-oak/15 py-16 text-center md:py-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cinnamon">Felt, not announced</p>
            <blockquote className="mt-7 text-balance font-display text-[clamp(2.8rem,5.7vw,5.7rem)] leading-[0.96] text-oak">
              “It made the whole house look newer. The property simply felt cared for again.”
            </blockquote>
            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-soil/60">Eleanor V. · Beaumont client</p>
          </Reveal>
        </Container>
      </section>

      <section id="quote" className="scroll-mt-16 bg-sand/20 py-24 md:py-36" aria-labelledby="quote-title">
        <Container>
          <Reveal className="mb-14 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <Eyebrow>Instant quote</Eyebrow>
              <p className="mt-5 max-w-sm text-base font-medium leading-relaxed text-soil/70">
                Trace the space, choose the care, and see a transparent estimate without leaving this page.
              </p>
            </div>
            <h2 id="quote-title" className="max-w-4xl text-balance font-display text-[clamp(3.2rem,6vw,6.2rem)] leading-[0.9] text-oak">
              A clear price,
              <span className="block italic text-ochre">in three simple steps.</span>
            </h2>
          </Reveal>
          <LazyQuoteBuilder services={services} />
        </Container>
      </section>

      <section id="contact" className="scroll-mt-20 bg-ivory py-24 md:py-32" aria-labelledby="contact-title">
        <Container className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
            <h2 id="contact-title" className="mt-6 max-w-3xl text-balance font-display text-[clamp(3.2rem,6vw,6.1rem)] leading-[0.9] text-oak">
              Prefer a conversation?
              <span className="block italic text-ochre">We’re here.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="border-t border-oak/15 pt-7">
            <a href={`mailto:${site.email}`} className="block font-display text-3xl text-oak transition-colors hover:text-cinnamon md:text-4xl">{site.email}</a>
            <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="mt-3 block text-lg font-medium text-soil/65 transition-colors hover:text-oak">{site.phone}</a>
            <p className="mt-6 max-w-md text-sm font-medium leading-relaxed text-soil/60">Monday to Saturday · Quotes available online at any time.</p>
          </Reveal>
        </Container>
      </section>

      <section id="terms" className="scroll-mt-20 border-t border-oak/10 bg-ivory py-12" aria-labelledby="terms-title">
        <Container className="grid gap-5 md:grid-cols-[0.35fr_1.65fr]">
          <h2 id="terms-title" className="text-xs font-semibold uppercase tracking-[0.25em] text-cinnamon">Terms</h2>
          <p className="max-w-4xl text-sm font-medium leading-relaxed text-soil/60">
            Estimates are based on the area and options selected and are confirmed after review. Work is scheduled subject to access, weather, and surface condition. No payment is taken when requesting an estimate.
          </p>
        </Container>
      </section>
    </>
  );
}
