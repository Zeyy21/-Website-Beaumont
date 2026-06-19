import Link from "next/link";
import { getServices } from "@/lib/data";
import { site, rewards } from "@/lib/config";
import { formatCurrency } from "@/lib/pricing";
import { ButtonLink, Container, SectionHeading, Wordmark } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { BeforeAfter } from "@/components/before-after";
import { CountUp } from "@/components/count-up";
import { Testimonials } from "@/components/testimonials";
import { RewardsShowcase } from "@/components/rewards-showcase";
import { WebglHero } from "@/components/webgl-hero";

const stats = [
  { value: 12000, suffix: "+", label: "Sanctuaries Restored" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Client Satisfaction" },
  { value: 1500, suffix: "hrs", label: "Time Given Back to You" },
  { value: 60, prefix: "<", suffix: "s", label: "To book your peace of mind" },
];

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      <WebglHero />

      {/* This invisible spacer forces the page to scroll, allowing the WebGL shader to run its 0->1 transition. */}
      <div className="relative z-10 h-[150vh]" />

      <div className="relative z-10 bg-ivory">
        {/* ─────────── THE EXPERIENCE INTRO ─────────── */}
        <section className="py-32">
          <Container className="text-center">
            <Reveal>
              <h2 className="mx-auto max-w-4xl font-display text-4xl leading-tight text-oak md:text-6xl">
                We don’t just clean surfaces.<br />
                <span className="text-cinnamon">We restore your sanctuary.</span>
              </h2>
              <p className="mx-auto mt-8 max-w-2xl text-xl text-soil/70 leading-relaxed">
                Imagine walking through your front door after a long trip. 
                The air is perfectly still, carrying a faint, clean scent. 
                The floors gleam, the surfaces are immaculate, and every object is perfectly in its place. 
                That immediate drop in your shoulders—that exhale of pure relief—is what Beaumont delivers.
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ─────────── STATS STRIP ─────────── */}
        <section className="border-y border-oak/10 bg-sand/10">
          <Container>
            <Stagger className="grid grid-cols-2 gap-y-10 py-16 md:grid-cols-4">
              {stats.map((s) => (
                <StaggerItem
                  key={s.label}
                  className="border-oak/10 text-center md:border-r md:last:border-r-0"
                >
                  <p className="font-display text-5xl text-oak md:text-6xl">
                    <CountUp
                      value={s.value}
                      decimals={s.decimals ?? 0}
                      prefix={s.prefix ?? ""}
                      suffix={s.suffix ?? ""}
                    />
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-widest text-ochre">
                    {s.label}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>

        {/* ─────────── THE BEAUMONT STANDARD ─────────── */}
        <section className="relative overflow-hidden py-32">
          <Container className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow="The Standard"
                title="A meticulous return to perfection."
                intro="Our specialists are trained to see what others miss. From the quietest corners of your estate to the high-traffic pathways, we treat your home like the masterpiece it is."
              />
              <ul className="mt-10 space-y-5">
                {[
                  { title: "Invisible Presence", desc: "We operate with absolute discretion, ensuring your daily rhythm is entirely undisturbed." },
                  { title: "Curated Elements", desc: "Only the most refined, sustainably-sourced solutions touch your home's delicate surfaces." },
                  { title: "Uncompromising Precision", desc: "A rigorous multi-point inspection follows every visit. Perfection is the baseline." },
                ].map((p) => (
                  <li key={p.title} className="flex items-start gap-4 text-soil/80">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cinnamon/10 text-cinnamon">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="font-display text-xl text-oak">{p.title}</h4>
                      <p className="mt-1 text-soil/60">{p.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <BeforeAfter caption="The Beaumont transformation." />
            </Reveal>
          </Container>
        </section>

        {/* ─────────── EFFORTLESS JOURNEY ─────────── */}
        <section className="bg-sand/20 py-32">
          <Container>
            <Reveal>
              <SectionHeading
                center
                eyebrow="Effortless"
                title="Your time is your ultimate luxury."
                intro="We’ve engineered our booking experience to be entirely frictionless. No lengthy consultations. No hidden fees. Just peace of mind, instantly."
              />
            </Reveal>
            <div className="relative mt-24">
              <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-ochre/40 to-transparent md:block" />
              <Stagger className="grid gap-12 md:grid-cols-3">
                {[
                  {
                    t: "Define your space",
                    d: "Interact with our intelligent mapping tool. Trace your property and receive an instantaneous, pinpoint-accurate estimate.",
                  },
                  {
                    t: "Curate your care",
                    d: "Select the frequency and depth of care your home requires. The pricing is entirely transparent and adjusts in real-time.",
                  },
                  {
                    t: "Reclaim your time",
                    d: "Confirm your appointment securely. From that moment forward, the preservation of your home is entirely in our hands.",
                  },
                ].map((step, i) => (
                  <StaggerItem key={step.t} className="relative text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ochre/30 bg-ivory font-display text-2xl text-cinnamon shadow-soft">
                      {i + 1}
                    </div>
                    <h3 className="mt-6 text-2xl text-oak">{step.t}</h3>
                    <p className="mx-auto mt-3 max-w-xs text-soil/70">{step.d}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <Reveal className="mt-16 text-center">
              <ButtonLink href="/quote" size="lg">
                Experience it now
              </ButtonLink>
            </Reveal>
          </Container>
        </section>

        {/* ─────────── TESTIMONIALS ─────────── */}
        <Testimonials />

        {/* ─────────── REWARDS ─────────── */}
        <RewardsShowcase referralPoints={rewards.referralSuccess} />

        {/* ─────────── CLOSING ─────────── */}
        <section className="py-32">
          <Container className="text-center">
            <Reveal>
              <Wordmark dark className="mx-auto h-12 opacity-80" />
              <p className="mx-auto mt-8 max-w-2xl font-display text-4xl leading-tight text-oak md:text-5xl">
                {site.promise}
              </p>
              <ButtonLink href="/quote" size="lg" className="mt-12">
                Begin your journey
              </ButtonLink>
            </Reveal>
          </Container>
        </section>
      </div>
    </>
  );
}
