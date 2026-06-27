import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { QuoteBuilder } from "@/components/quote/quote-builder";
import { QuoteResumeAnchor } from "@/components/quote/quote-resume-anchor";
import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui";
import { getServices } from "@/lib/data";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Free estimate",
  description:
    "Build your Beaumont exterior-care request in about two minutes. A specialist reviews every detail and replies with a clear written quote, usually within 24 hours.",
};

const nextSteps = [
  [
    "01",
    "Send your request",
    "Confirm the property, choose the exterior services, and add any notes. No payment, no obligation.",
  ],
  [
    "02",
    "We review by hand",
    "Beaumont considers access, materials, surface condition, and route before pricing anything.",
  ],
  [
    "03",
    "A clear quote",
    "You receive a written quote to accept on your terms — usually within 24 hours.",
  ],
] as const;

const trustChips = ["No measurements", "No payment to request", "Reviewed within 24h"];

export default async function QuotePage() {
  const services = await getServices();

  return (
    <>
      <QuoteResumeAnchor />

      {/* Cinematic hero */}
      <section
        data-header-tone="dark"
        className="relative isolate overflow-hidden bg-soil text-ivory"
        aria-labelledby="quote-hero-title"
      >
        <AnimatedBackdrop />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 rounded-[1.75rem] border border-ivory/10 md:inset-6 md:rounded-[2.5rem]"
        />

        <Container className="relative z-10 pb-24 pt-40 md:pb-32 md:pt-52">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-ivory/60 transition-colors hover:text-ivory"
            >
              <ArrowLeft />
              Back to Beaumont
            </Link>
          </Reveal>

          <Reveal delay={0.05} className="mt-10 flex items-center gap-4">
            <span className="font-display text-2xl text-ochre">03</span>
            <span className="h-px w-12 bg-ochre/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sand">
              Free estimate
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1
              id="quote-hero-title"
              className="mt-6 max-w-4xl text-balance font-display text-[clamp(3.2rem,7vw,6.9rem)] leading-[0.88] tracking-[-0.02em]"
            >
              Tell us what home needs.
              <span className="mt-1 block italic text-sand">We’ll take it from here.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-ivory/75">
              A guided, two-minute request with no measuring and no payment. Every detail is
              reviewed by a person and answered with a clear written quote.
            </p>
          </Reveal>

          <Reveal delay={0.22} className="mt-9 flex flex-wrap gap-2.5">
            {trustChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-ivory/15 bg-ivory/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory/70 backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </Reveal>
        </Container>

        {/* Fade the backdrop into the ivory section below */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ivory"
        />
      </section>

      {/* The working onboarding flow, framed as a layered experience */}
      <section className="luxe-wash relative pb-24 pt-14 md:pb-36 md:pt-20">
        <Container>
          <div id="estimate" className="relative z-10 scroll-mt-28">
            <Reveal>
              <QuoteBuilder services={services} />
            </Reveal>
          </div>

          {/* What happens next */}
          <div className="mt-20 md:mt-28">
            <Reveal className="flex items-center gap-4">
              <span className="font-display text-2xl text-ochre">→</span>
              <span className="h-px w-12 bg-ochre/40" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cinnamon">
                What happens next
              </span>
            </Reveal>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {nextSteps.map(([number, title, copy], index) => (
                <Reveal
                  key={number}
                  delay={index * 0.08}
                  className="group h-full rounded-[1.75rem] border border-oak/10 bg-ivory/70 p-7 shadow-[0_24px_70px_-50px_rgba(29,23,15,.7)] transition-colors duration-500 hover:bg-ivory md:rounded-[2rem] md:p-9"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-oak/10 font-display text-xl text-ochre transition-colors duration-500 group-hover:bg-oak group-hover:text-ivory">
                    {number}
                  </span>
                  <h3 className="mt-6 font-display text-2xl leading-tight text-oak md:text-3xl">{title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-soil/65">{copy}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Prefer to talk */}
          <Reveal className="mt-6 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] border border-oak/10 bg-sand/25 p-7 sm:flex-row sm:items-center md:rounded-[2rem] md:px-10 md:py-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-cinnamon">
                Prefer a conversation?
              </p>
              <p className="mt-2 font-display text-2xl text-oak md:text-3xl">
                We reply with clarity, never pressure.
              </p>
            </div>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-oak/25 px-6 py-3 text-sm font-semibold text-oak transition-colors hover:bg-oak hover:text-ivory"
            >
              Email Beaumont <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
