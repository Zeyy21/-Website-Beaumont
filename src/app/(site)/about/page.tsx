import type { Metadata } from "next";
import { site } from "@/lib/config";
import {
  ButtonLink,
  Container,
  Eyebrow,
  SectionHeading,
  Wordmark,
} from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Beaumont is a premium cleaning service built on craft, discretion, and an obsession with detail.",
};

const values = [
  {
    t: "Craft over speed",
    d: "We measure success in detail, not minutes. Every specialist is trained to a single, exacting standard.",
  },
  {
    t: "Quiet discretion",
    d: "We move through your home with respect and care, leaving only calm and order behind.",
  },
  {
    t: "Honest pricing",
    d: "Area-based quotes you can see and understand. No hidden fees, no pressure — ever.",
  },
  {
    t: "Lasting relationships",
    d: "Rewards, referrals, and a dedicated team that learns your home over time.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="texture-soil text-ivory">
        <Container className="grid items-center gap-12 py-24 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Who we are</Eyebrow>
            <h1 className="mt-4 text-5xl leading-tight md:text-6xl">
              A higher standard of clean
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ivory/70">
              {site.name} began with a simple conviction: that a truly clean
              home should feel like a luxury, delivered effortlessly. We pair
              meticulous craft with technology that makes booking the easiest
              part of your day.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex justify-center">
            <Wordmark className="h-16 opacity-90" />
          </Reveal>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <Reveal>
            <SectionHeading
              center
              eyebrow="What we believe"
              title="The principles behind every visit"
            />
          </Reveal>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2">
            {values.map((v) => (
              <StaggerItem key={v.t}>
                <div className="h-full rounded-2xl border border-oak/10 bg-white p-8">
                  <h3 className="text-2xl text-oak">{v.t}</h3>
                  <p className="mt-3 text-soil/70">{v.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-sand/30 py-24">
        <Container>
          <Stagger className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { n: "12k+", l: "Homes cared for" },
              { n: "4.9★", l: "Average rating" },
              { n: "98%", l: "Return clients" },
              { n: "100%", l: "Satisfaction promise" },
            ].map((s) => (
              <StaggerItem key={s.l}>
                <p className="font-display text-5xl text-oak">{s.n}</p>
                <p className="mt-2 text-sm text-soil/60">{s.l}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-24">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-display text-4xl text-oak">
              Experience the difference
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-soil/70">
              See what meticulous really means. Start with an instant estimate.
            </p>
            <ButtonLink href="/quote" size="lg" className="mt-8">
              Get your quote
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
