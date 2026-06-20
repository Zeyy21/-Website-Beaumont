import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Beaumont is a premium exterior-care company built on restraint, craft, and a more thoughtful standard of pressure washing.",
};

const principles = [
  {
    number: "01",
    title: "Restraint is part of the craft.",
    copy: "More pressure is not more care. We match method, treatment, and force to the material in front of us.",
  },
  {
    number: "02",
    title: "The whole property matters.",
    copy: "Stone is restored while gardens, joints, finishes, furniture, and neighbouring surfaces remain protected.",
  },
  {
    number: "03",
    title: "Clarity comes before arrival.",
    copy: "Visible area-based estimates, a defined scope, and no surprise additions after the work begins.",
  },
  {
    number: "04",
    title: "We finish with the details.",
    copy: "Edges, runoff, furniture placement, and the final walkthrough receive the same attention as the main surface.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-soil text-ivory">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_16%_18%,rgba(122,67,39,.7),transparent_34%),radial-gradient(circle_at_80%_76%,rgba(161,121,79,.24),transparent_32%)]" />
        <Container className="relative grid min-h-[82svh] items-center gap-14 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-24">
          <Reveal>
            <Eyebrow className="text-sand">Who we are</Eyebrow>
            <h1 className="mt-7 max-w-3xl text-balance font-display text-[clamp(3.8rem,7vw,7.2rem)] leading-[0.88] tracking-[-0.02em]">
              Care for the
              <span className="block italic text-sand">first impression.</span>
            </h1>
            <p className="mt-9 max-w-xl text-lg font-medium leading-relaxed text-ivory/80 md:text-xl">
              Beaumont was created around a simple idea: exterior restoration can feel considered, composed, and genuinely effortless—not loud, rushed, or transactional.
            </p>
            <div className="mt-10 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-sand">
              <span className="h-px w-12 bg-sand/60" />
              Pressure washing, reimagined
            </div>
          </Reveal>

          <Reveal delay={0.08} className="relative mx-auto w-full max-w-[36rem] lg:ml-auto">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-ivory/15 shadow-lift md:rounded-[4rem]">
              <Image
                src="/images/pressure-washed-patio-placeholder.png"
                alt="A meticulously restored stone terrace and pool surround"
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-soil/75 via-transparent to-soil/10" />
              <div className="absolute inset-6 rounded-[1.8rem] border border-ivory/25 md:inset-9 md:rounded-[3rem]" />
              <p className="absolute bottom-10 left-10 max-w-[14rem] text-sm font-medium leading-relaxed text-ivory/90 md:bottom-14 md:left-14">
                A quieter kind of transformation—measured in how the property feels when the water settles.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="overflow-hidden bg-ivory py-28 md:py-40">
        <Container className="grid gap-14 lg:grid-cols-[0.38fr_1.62fr] lg:gap-20">
          <Reveal>
            <p className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-cinnamon">
              <span className="h-px w-10 bg-cinnamon/60" />
              Our conviction
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="max-w-5xl text-balance font-display text-[clamp(3.2rem,6.7vw,7rem)] leading-[0.9] text-oak">
              Pressure is only powerful
              <span className="block italic text-ochre">when it is precise.</span>
            </h2>
            <div className="mt-12 grid gap-8 border-t border-oak/15 pt-8 md:grid-cols-2">
              <p className="max-w-xl text-lg font-medium leading-relaxed text-soil/80">
                Every surface has a history and a limit. Concrete, natural stone, pavers, stucco, and wood each ask for a different hand.
              </p>
              <p className="max-w-xl text-lg font-medium leading-relaxed text-soil/80">
                Our standard is restoration without compromise: brighter surfaces, protected surroundings, and a property that feels whole again.
              </p>
            </div>
          </Reveal>
        </Container>

        <Container className="mt-24 grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="relative min-h-[28rem] overflow-hidden rounded-[2.5rem] md:min-h-[38rem] md:rounded-[3.5rem]">
            <Image src="/images/pressure-washed-driveway-placeholder.png" alt="A restored limestone driveway" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-soil/55 via-transparent to-transparent" />
            <p className="absolute bottom-8 left-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory md:bottom-12 md:left-12">The arrival · Restored</p>
          </Reveal>
          <Reveal delay={0.08} className="relative min-h-[24rem] overflow-hidden rounded-[2.5rem] md:min-h-[38rem] md:rounded-[3.5rem]">
            <Image src="/images/pressure-washed-entry-placeholder.png" alt="A clean stone entrance approach" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-soil/55 via-transparent to-transparent" />
            <p className="absolute bottom-8 left-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory md:bottom-12 md:left-12">The approach · Considered</p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-sand/25 py-28 md:py-40">
        <Container>
          <Reveal className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <Eyebrow>The Beaumont standard</Eyebrow>
              <p className="mt-5 max-w-sm text-base font-medium leading-relaxed text-soil/75">
                Four principles shape every estimate, every arrival, and every finished surface.
              </p>
            </div>
            <h2 className="max-w-4xl text-balance font-display text-[clamp(3.2rem,6vw,6.4rem)] leading-[0.9] text-oak">
              A better result begins
              <span className="block italic text-ochre">with better judgement.</span>
            </h2>
          </Reveal>

          <Stagger className="mt-20 border-t border-oak/20">
            {principles.map((principle) => (
              <StaggerItem key={principle.number}>
                <article className="group grid gap-5 border-b border-oak/20 py-9 md:grid-cols-[0.25fr_0.9fr_1fr] md:items-start md:py-12">
                  <span className="font-display text-2xl text-cinnamon">{principle.number}</span>
                  <h3 className="max-w-md font-display text-3xl leading-tight text-oak md:text-4xl">{principle.title}</h3>
                  <p className="max-w-lg text-base font-medium leading-relaxed text-soil/80 md:text-lg">{principle.copy}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-ivory px-4 py-4 md:px-6 md:py-6">
        <div className="relative min-h-[70svh] overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem]">
          <Image src="/images/pressure-washed-entry-placeholder.png" alt="A welcoming restored front entrance" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-soil/95 via-soil/70 to-soil/15" />
          <Container className="relative flex min-h-[70svh] items-center py-20 text-ivory">
            <Reveal className="max-w-3xl">
              <Eyebrow className="text-sand">The next arrival</Eyebrow>
              <h2 className="mt-6 text-balance font-display text-[clamp(3.3rem,6.5vw,6.8rem)] leading-[0.9]">
                Let the property make
                <span className="block italic text-sand">the right impression.</span>
              </h2>
              <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-ivory/85">Start with a clear, area-based estimate and see what a more considered exterior-care experience feels like.</p>
              <ButtonLink href="/quote" variant="light" size="lg" className="mt-10">Begin your estimate</ButtonLink>
            </Reveal>
          </Container>
        </div>
      </section>
    </>
  );
}
