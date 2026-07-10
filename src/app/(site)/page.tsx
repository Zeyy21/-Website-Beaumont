import { Hero } from "@/components/hero";
import { ExperienceSequence } from "@/components/home-experience";
import { ServiceGallery } from "@/components/service-gallery";
import { SeasonalCycle } from "@/components/seasonal-cycle";
import { BeforeAfter } from "@/components/before-after";
import { QuoteBuilder } from "@/components/quote/quote-builder";
import { Reveal } from "@/components/motion";
import { DynamicAttribution } from "@/components/dynamic-attribution";
import { Container, Eyebrow } from "@/components/ui";
import { getServices, getCurrentUser } from "@/lib/data";
import { accountFromUser } from "@/lib/quote-account";
import { site } from "@/lib/config";
import { getDict } from "@/lib/i18n/server";

export default async function HomePage() {
  const [dict, services, user] = await Promise.all([
    getDict(),
    getServices(),
    getCurrentUser(),
  ]);

  return (
    <>
      <Hero />

      <ServiceGallery services={services} />

      <section className="proof-wash relative overflow-hidden py-24 text-oak md:py-36" aria-labelledby="proof-title">
        <Container>
          <Reveal className="mb-10 flex items-end justify-between gap-8 md:mb-14">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cinnamon/70">02</p>
              <h2 id="proof-title" className="mt-5 font-display text-[clamp(3.25rem,6vw,6.25rem)] leading-[0.88]">
                {dict.admin.gallery.before} <span className="italic text-ochre">/ {dict.admin.gallery.after}</span>
              </h2>
            </div>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-soil/42 md:block">{dict.servicesSection.details.driveways}</p>
          </Reveal>
          <BeforeAfter
            beforeUrl="/images/pressure-washing-before.png"
            afterUrl="/images/pressure-washing-after.png"
            beforeLabel={dict.admin.gallery.before}
            afterLabel={dict.admin.gallery.after}
            immersive
            autoSweep
          />
        </Container>
      </section>

      <ExperienceSequence />

      <section data-header-tone="dark" className="texture-soil relative overflow-hidden py-24 text-ivory md:py-36" aria-label={dict.testimonialSection.sectionLabel}>
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 font-display text-[24rem] leading-none text-ivory/[0.025]">&ldquo;</div>
        <Container>
          <Reveal className="relative grid gap-10 rounded-[2.25rem] border border-ivory/10 bg-ivory/[0.035] p-8 backdrop-blur-sm md:rounded-[3.5rem] md:p-14 lg:grid-cols-[0.3fr_1.7fr] lg:p-20">
            <div>
              <p className="font-display text-5xl text-ochre">01</p>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-sand">{dict.testimonialSection.clientNote}</p>
            </div>
            <div>
            <blockquote className="text-balance font-display text-[clamp(2.7rem,5.2vw,5.4rem)] leading-[0.96] text-ivory">
              &ldquo;{dict.testimonialSection.quote}&rdquo;
            </blockquote>
              <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-ivory/10 pt-7">
                <span className="h-px w-12 bg-ochre" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ivory/55">
                  <DynamicAttribution name="Eleanor V." />
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="quote" className="luxe-wash relative scroll-mt-24 overflow-hidden pb-24 pt-16 md:pb-32 md:pt-20" aria-labelledby="quote-title">
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-oak/15 to-transparent" />
        <Container>
          <div className="mx-auto max-w-[96rem]">
            <QuoteBuilder services={services} account={accountFromUser(user)} />
          </div>
        </Container>
      </section>

      <SeasonalCycle services={services} />

      <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 md:py-40" aria-labelledby="contact-title">
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-0 font-display text-[22rem] leading-none text-oak/[0.025]">04</div>
        <Container>
          <Reveal className="grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div>
            <div className="flex items-center gap-4">
              <span className="font-display text-2xl text-ochre">04</span>
              <span className="h-px w-12 bg-ochre/40" />
              <Eyebrow>{dict.contact.eyebrow}</Eyebrow>
            </div>
            <h2 id="contact-title" className="mt-6 max-w-3xl text-balance font-display text-[clamp(3.2rem,6vw,6.1rem)] leading-[0.9] text-oak">
              {dict.contact.titleA}
              <span className="block italic text-ochre">{dict.contact.titleB}</span>
            </h2>
            </div>
            <p className="max-w-md text-base font-medium leading-relaxed text-soil/60 lg:justify-self-end">
              {dict.contact.body}
            </p>
          </Reveal>

          <div className="relative mt-14 grid gap-4 lg:grid-cols-12">
            <Reveal className="min-w-0 lg:col-span-7">
              <a
                href={`mailto:${site.email}`}
                className="group relative flex h-full min-h-[22rem] w-full min-w-0 flex-col justify-between overflow-hidden rounded-[2.25rem] bg-soil p-8 text-ivory shadow-lift md:rounded-[3rem] md:p-11"
              >
                <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 font-display text-[15rem] leading-none text-ivory/[0.04] md:text-[19rem]">@</div>
                <div className="relative flex items-start justify-between gap-6">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sand">{dict.contact.emailLabel}</span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/20 text-lg transition-all duration-500 group-hover:-rotate-45 group-hover:border-ivory group-hover:bg-ivory group-hover:text-soil md:h-12 md:w-12 md:text-xl">↗</span>
                </div>
                <div className="relative">
                  <p className="font-display text-[clamp(2.6rem,4.4vw,4rem)] italic leading-[0.9] text-ivory/95">Write to us</p>
                  <span className="mt-5 block break-words font-display text-[clamp(1.35rem,2.1vw,2rem)] leading-[1.05] tracking-[-0.01em] text-sand transition-colors group-hover:text-ivory">
                    {site.email}
                  </span>
                  <span className="mt-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-ivory/45">
                    <span className="h-px w-8 bg-ivory/25" />
                    {dict.contact.hours}
                  </span>
                </div>
              </a>
            </Reveal>
            <Reveal delay={0.08} className="min-w-0 lg:col-span-5">
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="group relative flex h-full min-h-[22rem] w-full min-w-0 flex-col justify-between overflow-hidden rounded-[2.25rem] border border-oak/10 bg-sand/40 p-8 text-oak shadow-[0_24px_70px_-42px_rgba(28,28,26,.6)] transition-colors duration-500 hover:bg-sand/55 md:rounded-[3rem] md:p-11"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-oak/15 text-cinnamon md:h-12 md:w-12">
                    <InstagramMark />
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-oak/20 text-lg transition-all duration-500 group-hover:-rotate-45 group-hover:border-oak group-hover:bg-oak group-hover:text-ivory md:h-12 md:w-12 md:text-xl">↗</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cinnamon">{dict.contact.followLabel}</span>
                  <span className="mt-3 block break-words font-display text-[clamp(2rem,3vw,2.75rem)] leading-[0.95] tracking-[-0.02em]">{site.instagramHandle}</span>
                  <span className="mt-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-soil/45">
                    <span className="h-px w-8 bg-oak/20" />
                    {dict.common.montreal}
                  </span>
                </div>
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

    </>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
