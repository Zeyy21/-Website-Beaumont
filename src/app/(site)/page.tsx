import Image from "next/image";
import { Hero } from "@/components/hero";
import { ExperienceSequence } from "@/components/home-experience";
import { LazyQuoteBuilder } from "@/components/quote/lazy-quote-builder";
import { PartnerFeature } from "@/components/partner-feature";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { getServices } from "@/lib/data";
import { site } from "@/lib/config";

const serviceImages = [
  "/images/montreal-driveway-pressure-washing.webp",
  "/images/montreal-deck-pressure-washing.webp",
  "/images/montreal-home-hero.png",
  "/images/atlantic-window-care-montreal.webp",
];

const serviceDetails = [
  "Driveways & stone",
  "Decks & patios",
  "House exteriors",
  "Atlantic partner",
];

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      <Hero />

      <section data-header-tone="dark" className="relative z-10 border-y border-ivory/10 bg-soil text-ivory" aria-label="Beaumont service principles">
        <Container className="grid divide-y divide-ivory/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            ["01", "Material-aware", "A method selected for every surface."],
            ["02", "Quietly managed", "Clear timing, careful preparation, no theatre."],
            ["03", "Effortless to arrange", "Measure and request your visit in one place."],
          ].map(([number, title, copy]) => (
            <div key={number} className="group flex gap-5 py-7 md:px-8 md:py-9 first:md:pl-0 last:md:pr-0">
              <span className="font-display text-2xl text-ochre transition-colors group-hover:text-sand">{number}</span>
              <div>
                <p className="text-sm font-semibold text-ivory">{title}</p>
                <p className="mt-1 text-xs font-medium leading-relaxed text-ivory/50">{copy}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section id="services" className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 md:py-40" aria-labelledby="services-title">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-10 font-display text-[18rem] leading-none text-oak/[0.025] md:text-[28rem]">01</div>
        <Container>
          <Reveal className="relative grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl text-ochre">01</span>
                <span className="h-px w-12 bg-ochre/40" />
                <Eyebrow>Services</Eyebrow>
              </div>
              <p className="mt-6 max-w-sm text-base font-medium leading-relaxed text-soil/65">
                Pressure washing and specialist window care selected for each surface, setting, and Montréal home.
              </p>
            </div>
            <h2 id="services-title" className="max-w-4xl text-balance font-display text-[clamp(3.25rem,6.2vw,6.5rem)] leading-[0.9] text-oak">
              Every exterior surface.
              <span className="block italic text-ochre">One considered standard.</span>
            </h2>
          </Reveal>

          <Stagger className="relative mt-16 grid gap-4 lg:grid-cols-12">
            {services.map((service, index) => (
              <StaggerItem
                key={service.id}
                className={
                  index === 0
                    ? "lg:col-span-7 lg:row-span-2"
                    : index === 3
                      ? "lg:col-span-12"
                      : "lg:col-span-5"
                }
              >
                <article className={`group relative h-full min-h-[30rem] overflow-hidden rounded-[2rem] bg-soil text-ivory shadow-[0_28px_80px_-40px_rgba(29,23,15,.75)] md:rounded-[2.75rem] ${index === 0 ? "lg:min-h-[46rem]" : index === 3 ? "lg:min-h-[28rem]" : "lg:min-h-[22.5rem]"}`}>
                  <Image
                    src={serviceImages[index % serviceImages.length]}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-soil/95 via-soil/30 to-soil/5 transition-colors duration-700 group-hover:via-soil/20" />
                  <div className="pointer-events-none absolute inset-3 rounded-[1.45rem] border border-ivory/15 md:inset-4 md:rounded-[2.15rem]" />
                  <div className="absolute left-7 top-7 rounded-full border border-ivory/20 bg-soil/25 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/75 backdrop-blur-md md:left-10 md:top-10">
                    {serviceDetails[index]}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-11">
                    <div className="flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-sand/90">
                      <span>Service 0{index + 1}</span>
                      <span className="h-px w-8 bg-sand/40" />
                      <span>{index === 3 ? "With Atlantic" : "Pressure washing"}</span>
                    </div>
                    <h3 className={`mt-5 max-w-2xl font-display leading-[0.95] ${index === 0 || index === 3 ? "text-4xl md:text-6xl" : "text-4xl md:text-[2.65rem]"}`}>{service.name}</h3>
                    <div className="mt-5 flex items-end justify-between gap-6">
                      <p className="max-w-lg text-sm font-medium leading-relaxed text-ivory/70 md:text-base">{service.description}</p>
                      <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/25 text-xl transition-all duration-500 group-hover:-rotate-45 group-hover:bg-ivory group-hover:text-soil sm:flex">↗</span>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <ExperienceSequence />

      <section data-header-tone="dark" className="texture-soil relative overflow-hidden py-24 text-ivory md:py-36" aria-label="Client testimonial">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 font-display text-[24rem] leading-none text-ivory/[0.025]">“</div>
        <Container>
          <Reveal className="relative grid gap-10 rounded-[2.25rem] border border-ivory/10 bg-ivory/[0.035] p-8 backdrop-blur-sm md:rounded-[3.5rem] md:p-14 lg:grid-cols-[0.3fr_1.7fr] lg:p-20">
            <div>
              <p className="font-display text-5xl text-ochre">01</p>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-sand">Client note</p>
            </div>
            <div>
            <blockquote className="text-balance font-display text-[clamp(2.7rem,5.2vw,5.4rem)] leading-[0.96] text-ivory">
              “It made the whole house look newer. The property simply felt cared for again.”
            </blockquote>
              <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-ivory/10 pt-7">
                <span className="h-px w-12 bg-ochre" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ivory/55">Eleanor V. · Beaumont client</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="quote" className="luxe-wash relative scroll-mt-24 overflow-hidden py-24 md:py-36" aria-labelledby="quote-title">
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-oak/15 to-transparent" />
        <Container>
          <Reveal className="mx-auto mb-12 max-w-4xl text-center md:mb-14">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-ochre/40" />
              <span className="font-display text-2xl text-ochre">03</span>
              <Eyebrow>Instant quote</Eyebrow>
              <span className="h-px w-10 bg-ochre/40" />
            </div>
            <h2 id="quote-title" className="mt-5 text-balance font-display text-[clamp(3.15rem,5.4vw,5.6rem)] leading-[0.92] text-oak">
              Your property. Your care.
              <span className="block italic text-ochre">One clear estimate.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-soil/65 md:text-lg">
              Select the address, trace the service area, and tailor the visit without leaving this page.
            </p>
          </Reveal>
          <LazyQuoteBuilder services={services} />
        </Container>
      </section>

      <PartnerFeature />

      <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 md:py-40" aria-labelledby="contact-title">
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-0 font-display text-[22rem] leading-none text-oak/[0.025]">04</div>
        <Container>
          <Reveal className="grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div>
            <div className="flex items-center gap-4">
              <span className="font-display text-2xl text-ochre">04</span>
              <span className="h-px w-12 bg-ochre/40" />
              <Eyebrow>Contact</Eyebrow>
            </div>
            <h2 id="contact-title" className="mt-6 max-w-3xl text-balance font-display text-[clamp(3.2rem,6vw,6.1rem)] leading-[0.9] text-oak">
              Prefer a conversation?
              <span className="block italic text-ochre">We’re here.</span>
            </h2>
            </div>
            <p className="max-w-md text-base font-medium leading-relaxed text-soil/60 lg:justify-self-end">
              For questions, property details, or a more tailored scope, reach us directly. We reply with clarity and without pressure.
            </p>
          </Reveal>

          <div className="relative mt-14 grid gap-4 lg:grid-cols-12">
            <Reveal className="min-w-0 lg:col-span-7">
              <a href={`mailto:${site.email}`} className="group flex min-h-[21rem] w-full min-w-0 flex-col justify-between overflow-hidden rounded-[2.25rem] bg-soil p-8 text-ivory shadow-lift md:rounded-[3rem] md:p-12">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sand">Email Beaumont</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ivory/15 text-xl transition-all duration-500 group-hover:-rotate-45 group-hover:bg-ivory group-hover:text-soil">↗</span>
                </div>
                <span className="break-all font-display text-[clamp(2rem,4vw,4.5rem)] leading-[0.98] transition-colors group-hover:text-sand">{site.email}</span>
              </a>
            </Reveal>
            <Reveal delay={0.08} className="min-w-0 lg:col-span-5">
              <a href={site.instagram} target="_blank" rel="noreferrer" className="group flex min-h-[21rem] w-full min-w-0 flex-col justify-between overflow-hidden rounded-[2.25rem] border border-oak/10 bg-sand/35 p-8 text-oak shadow-[0_24px_70px_-42px_rgba(29,23,15,.6)] md:rounded-[3rem] md:p-10">
                <div className="flex items-center justify-between">
                  <InstagramMark />
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-oak/15 text-xl transition-all duration-500 group-hover:-rotate-45 group-hover:bg-oak group-hover:text-ivory">↗</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cinnamon">Follow our work</span>
                  <span className="mt-3 block break-all font-display text-[clamp(2rem,3vw,2.75rem)] leading-none tracking-[-0.02em]">{site.instagramHandle}</span>
                </div>
              </a>
            </Reveal>
          </div>

          <Reveal className="mt-5 flex flex-col justify-between gap-3 border-t border-oak/10 pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-soil/45 sm:flex-row">
            <span>Greater Montréal</span>
            <span>Monday–Saturday · Online estimates anytime</span>
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

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
