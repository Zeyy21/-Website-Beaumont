import Link from "next/link";
import { getServices } from "@/lib/data";
import { site, rewards } from "@/lib/config";
import { formatCurrency } from "@/lib/pricing";
import {
  ButtonLink,
  Container,
  Eyebrow,
  SectionHeading,
  Wordmark,
} from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { BeforeAfter } from "@/components/before-after";
import { HeroQuoteTeaser } from "@/components/hero-quote-teaser";

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      {/* ─────────── HERO ─────────── */}
      <section className="texture-soil relative overflow-hidden text-ivory">
        <Container className="relative grid min-h-[92vh] items-center gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <Eyebrow>Luxury cleaning, reimagined</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
                A home returned to
                <span className="block text-sand">quiet perfection.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-lg text-ivory/70">
                {site.description}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/quote" variant="light" size="lg">
                  Draw your space — get a price
                </ButtonLink>
                <ButtonLink
                  href="/services"
                  size="lg"
                  className="border border-ivory/25 bg-transparent text-ivory hover:bg-ivory hover:text-soil"
                >
                  Our services
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <p className="mt-8 text-sm text-ivory/45">
                Instant estimate in under a minute · No account required to start
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="hidden lg:block">
            <HeroQuoteTeaser />
          </Reveal>
        </Container>
      </section>

      {/* ─────────── TRUST STRIP ─────────── */}
      <section className="border-b border-oak/10 bg-ivory">
        <Container>
          <Stagger className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
            {[
              { k: "Insured & vetted", v: "Every specialist" },
              { k: "Eco-considered", v: "Premium products" },
              { k: "Satisfaction", v: "Or we re-clean" },
              { k: "Rewarded", v: "Points on every job" },
            ].map((s) => (
              <StaggerItem key={s.k} className="text-center md:text-left">
                <p className="font-display text-2xl text-oak">{s.k}</p>
                <p className="mt-1 text-sm text-soil/60">{s.v}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────── SERVICES ─────────── */}
      <section className="py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title="Services tailored to your home"
              intro="From weekly upkeep to white-glove estate care — every visit held to the same meticulous standard."
            />
          </Reveal>

          <Stagger className="mt-14 grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <StaggerItem key={s.id}>
                <Link
                  href="/quote"
                  className="group flex h-full flex-col justify-between rounded-2xl border border-oak/10 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-ochre/40 hover:shadow-lift"
                >
                  <div>
                    <h3 className="text-2xl text-oak">{s.name}</h3>
                    <p className="mt-3 text-soil/70">{s.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-soil/60">
                      From {formatCurrency(s.base_price)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-cinnamon transition-transform group-hover:translate-x-1">
                      Get a quote
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────── BEFORE / AFTER ─────────── */}
      <section className="bg-sand/30 py-24">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="The Beaumont difference"
              title="See the transformation"
              intro="Drag to reveal the result. This is the standard we bring to every room, every visit."
            />
            <ButtonLink href="/services" className="mt-8">
              Explore all services
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <BeforeAfter caption="Signature Deep Clean — kitchen" />
          </Reveal>
        </Container>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="py-24">
        <Container>
          <Reveal>
            <SectionHeading
              center
              eyebrow="Effortless"
              title="Three steps to a spotless home"
            />
          </Reveal>
          <Stagger className="mt-16 grid gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Draw your space",
                d: "Find your address and trace the area on the map. We estimate instantly from the square footage.",
              },
              {
                n: "02",
                t: "Choose your care",
                d: "Pick a service, frequency, and any extras. Watch your transparent price update live.",
              },
              {
                n: "03",
                t: "Book & relax",
                d: "Save it to your profile, request a final quote, and pay by card, transfer, or cash.",
              },
            ].map((step) => (
              <StaggerItem key={step.n}>
                <div className="relative rounded-2xl border border-oak/10 bg-white p-8">
                  <span className="font-display text-5xl text-sand">{step.n}</span>
                  <h3 className="mt-4 text-2xl text-oak">{step.t}</h3>
                  <p className="mt-3 text-soil/70">{step.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────── REWARDS TEASER ─────────── */}
      <section className="py-12">
        <Container>
          <Reveal>
            <div className="texture-soil overflow-hidden rounded-3xl px-8 py-14 text-center text-ivory md:px-16">
              <Eyebrow>Beaumont Rewards</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-2xl text-4xl md:text-5xl">
                Every clean earns you more
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-ivory/70">
                Collect points on signup, completed jobs, and referrals — then
                redeem them as a discount on future visits. Refer a friend and
                you both earn {rewards.referralSuccess.toLocaleString()} points.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/login" variant="light" size="lg">
                  Create your account
                </ButtonLink>
                <ButtonLink
                  href="/quote"
                  size="lg"
                  className="border border-ivory/25 bg-transparent text-ivory hover:bg-ivory hover:text-soil"
                >
                  Start a quote
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─────────── CLOSING ─────────── */}
      <section className="py-24">
        <Container className="text-center">
          <Reveal>
            <Wordmark dark className="mx-auto h-10 opacity-80" />
            <p className="mx-auto mt-6 max-w-xl font-display text-3xl text-oak">
              {site.promise}
            </p>
            <ButtonLink href="/quote" size="lg" className="mt-8">
              Get your instant quote
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
