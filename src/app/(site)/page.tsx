import Link from "next/link";
import { getServices } from "@/lib/data";
import { site, rewards } from "@/lib/config";
import { formatCurrency } from "@/lib/pricing";
import { ButtonLink, Container, SectionHeading, Wordmark } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { BeforeAfter } from "@/components/before-after";
import { Hero } from "@/components/hero";
import { CountUp } from "@/components/count-up";
import { Testimonials } from "@/components/testimonials";
import { RewardsShowcase } from "@/components/rewards-showcase";

const stats = [
  { value: 12000, suffix: "+", label: "Homes cared for" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Average rating" },
  { value: 98, suffix: "%", label: "Return clients" },
  { value: 60, prefix: "<", suffix: "s", label: "To an instant quote" },
];

const serviceIcons = [
  "M3 9.5 12 3l9 6.5V21H3z", // home
  "M12 3v18M5 8h14M5 16h14", // detail
  "M4 7h16v13H4zM4 7 12 2l8 5", // move box
  "M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.5L6 21l1.5-7L2 9.5 9 9z", // estate star
];

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      <Hero />

      {/* ─────────── STATS STRIP ─────────── */}
      <section className="border-b border-oak/10 bg-ivory">
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

      {/* ─────────── SERVICES ─────────── */}
      <section className="py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title="Services tailored to your home"
              intro="From weekly upkeep to white-glove estate care, every visit is held to the same meticulous standard."
            />
          </Reveal>

          <Stagger className="mt-16 grid gap-6 md:grid-cols-2">
            {services.map((s, i) => (
              <StaggerItem key={s.id}>
                <Link
                  href="/quote"
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-oak/10 bg-white p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-ochre/40 hover:shadow-lift"
                >
                  {/* hover wash */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sand/0 to-sand/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-oak/5 text-cinnamon transition-colors duration-500 group-hover:bg-cinnamon group-hover:text-ivory">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d={serviceIcons[i % serviceIcons.length]} />
                      </svg>
                    </div>
                    <h3 className="mt-5 text-2xl text-oak">{s.name}</h3>
                    <p className="mt-3 text-soil/70">{s.description}</p>
                  </div>
                  <div className="relative mt-6 flex items-center justify-between border-t border-oak/10 pt-5">
                    <span className="text-sm text-soil/60">
                      From{" "}
                      <span className="font-display text-lg text-oak">
                        {formatCurrency(s.base_price)}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-cinnamon transition-transform duration-300 group-hover:translate-x-1">
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
      <section className="relative overflow-hidden bg-sand/30 py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="The Beaumont difference"
              title="See the transformation"
              intro="Drag to reveal the result. This is the standard we bring to every room, on every visit."
            />
            <ul className="mt-8 space-y-3">
              {[
                "Trained, vetted, insured specialists",
                "Premium, eco-considered products",
                "Satisfaction promise, or we re-clean",
              ].map((p) => (
                <li key={p} className="flex items-center gap-3 text-soil/80">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cinnamon/10 text-cinnamon">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink href="/services" className="mt-9">
              Explore all services
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <BeforeAfter caption="Signature Deep Clean, kitchen" />
          </Reveal>
        </Container>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="py-28">
        <Container>
          <Reveal>
            <SectionHeading
              center
              eyebrow="Effortless"
              title="Three steps to a spotless home"
            />
          </Reveal>
          <div className="relative mt-20">
            {/* connecting line */}
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-ochre/40 to-transparent md:block" />
            <Stagger className="grid gap-12 md:grid-cols-3">
              {[
                {
                  t: "Draw your space",
                  d: "Find your address and trace the area on the map. We estimate instantly from the square footage.",
                },
                {
                  t: "Choose your care",
                  d: "Pick a service, frequency, and any extras. Watch your transparent price update live.",
                },
                {
                  t: "Book & relax",
                  d: "Save it to your profile, request a final quote, and pay by card, transfer, or cash.",
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
          <Reveal className="mt-14 text-center">
            <ButtonLink href="/quote" size="lg">
              Start your instant quote
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* ─────────── TESTIMONIALS ─────────── */}
      <Testimonials />

      {/* ─────────── REWARDS ─────────── */}
      <RewardsShowcase referralPoints={rewards.referralSuccess} />

      {/* ─────────── CLOSING ─────────── */}
      <section className="py-28">
        <Container className="text-center">
          <Reveal>
            <Wordmark dark className="mx-auto h-10 opacity-80" />
            <p className="mx-auto mt-7 max-w-xl font-display text-3xl text-oak md:text-4xl">
              {site.promise}
            </p>
            <ButtonLink href="/quote" size="lg" className="mt-9">
              Get your instant quote
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
