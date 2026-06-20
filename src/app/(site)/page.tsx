import Image from "next/image";
import { Hero } from "@/components/hero";
import { ExperienceSequence } from "@/components/home-experience";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink, Container, Monogram } from "@/components/ui";

const feelings = [
  {
    number: "01",
    title: "An arrival restored",
    copy: "The kind of curb appeal that makes the whole property feel considered again.",
  },
  {
    number: "02",
    title: "Time, given back",
    copy: "No rented equipment, lost weekends, or guessing which pressure is safe for the surface.",
  },
  {
    number: "03",
    title: "The finish you feel",
    copy: "Not merely washed—stone, concrete, and pavers returned to a brighter, cared-for state.",
  },
];

const care = [
  {
    label: "The arrival",
    title: "A driveway worth coming home to.",
    copy: "Built-up grime and organic staining lifted with a treatment tailored to the surface beneath.",
    image: "/images/pressure-washed-driveway-placeholder.png",
    alt: "Freshly pressure-washed stone driveway at golden hour",
  },
  {
    label: "The outdoor room",
    title: "A patio ready to be lived in again.",
    copy: "Pool surrounds, terraces, and pavers restored for long afternoons and effortless hosting.",
    image: "/images/pressure-washed-patio-placeholder.png",
    alt: "Restored stone patio and pool surround",
  },
  {
    label: "The first impression",
    title: "An entrance that feels cared for.",
    copy: "Walkways, steps, and front approaches brightened without compromising stone, joints, or gardens.",
    image: "/images/pressure-washed-entry-placeholder.png",
    alt: "Clean stone walkway leading to an elegant front entrance",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="relative overflow-hidden bg-ivory py-28 md:py-40">
        <Container>
          <Reveal className="mx-auto max-w-5xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-cinnamon">
              Beyond surface clean
            </p>
            <h2 className="mt-7 text-balance font-display text-[clamp(3.2rem,7vw,7rem)] leading-[0.9] text-oak">
              We don’t simply wash
              <span className="block italic text-ochre">a driveway.</span>
              We leave a feeling.
            </h2>
            <p className="mx-auto mt-9 max-w-2xl text-lg font-medium leading-relaxed text-soil/80 md:text-xl">
              Beaumont is exterior care designed around the moment after: the water settles, the stone brightens, and your entire property feels renewed.
            </p>
          </Reveal>

          <Stagger className="mt-24 grid border-y border-oak/15 md:grid-cols-3">
            {feelings.map((feeling) => (
              <StaggerItem
                key={feeling.number}
                className="group border-b border-oak/15 px-2 py-10 last:border-b-0 md:border-b-0 md:border-r md:px-9 md:last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-ochre">{feeling.number}</span>
                  <span className="h-2 w-2 rounded-full border border-cinnamon transition-colors duration-500 group-hover:bg-cinnamon" />
                </div>
                <h3 className="mt-14 font-display text-3xl leading-tight text-oak md:text-4xl">
                  {feeling.title}
                </h3>
                <p className="mt-5 text-sm font-medium leading-relaxed text-soil/80 md:text-base">{feeling.copy}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <ExperienceSequence />

      <section className="relative overflow-hidden bg-soil py-28 text-ivory md:py-40">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_18%_12%,rgba(122,67,39,.65),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(161,121,79,.25),transparent_38%)]" />
        <Container className="relative">
          <Reveal className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
            <div>
              <Monogram className="h-16 w-16 opacity-80" size={64} />
              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.34em] text-sand">
                Care, curated
              </p>
            </div>
            <h2 className="max-w-4xl text-balance font-display text-[clamp(3.3rem,7vw,7.2rem)] leading-[0.88] text-ivory">
              One standard.
              <span className="block italic text-sand">Your rhythm.</span>
            </h2>
          </Reveal>

          <div className="mt-20 border-t border-ivory/15">
            {care.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.06}>
                <article className="group grid gap-6 border-b border-ivory/20 py-9 transition-colors duration-500 hover:bg-ivory/[0.05] md:grid-cols-[0.5fr_0.8fr_1fr_1fr_auto] md:items-center md:px-4 md:py-12">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sand">
                    {item.label}
                  </p>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ivory/20 bg-oak">
                    <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 180px, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-soil/10" />
                  </div>
                  <h3 className="max-w-sm font-display text-3xl leading-[1.05] text-ivory md:text-4xl">
                    {item.title}
                  </h3>
                  <p className="max-w-sm text-sm font-medium leading-relaxed text-ivory/80 md:text-base">{item.copy}</p>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 text-sand transition-all duration-500 group-hover:border-sand group-hover:bg-sand group-hover:text-soil">
                    <Arrow />
                  </span>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex justify-end">
            <ButtonLink href="/services" variant="light" size="lg">
              Explore your care
              <Arrow />
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      <section className="bg-sand/25 py-28 md:py-40">
        <Container>
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cinnamon">
              Felt, not announced
            </p>
            <blockquote className="mt-7 text-balance font-display text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.96] text-oak">
              “It made the whole house look newer. I didn’t realize how much the driveway was changing the way the property felt.”
            </blockquote>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-soil/70">Eleanor V. · Beaumont client</p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ivory px-4 py-4 md:px-6 md:py-6">
        <div className="relative min-h-[82svh] overflow-hidden rounded-[2rem] md:rounded-[3.5rem]">
          <Image
            src="/images/pressure-washed-entry-placeholder.png"
            alt="A restored stone walkway and welcoming home entrance"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soil/95 via-soil/72 to-soil/25" />
          <Container className="relative flex min-h-[82svh] items-center py-20">
            <Reveal className="max-w-2xl text-ivory">
              <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-sand">
                Your time is waiting
              </p>
              <h2 className="mt-6 text-balance font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.88]">
                Leave the exterior to us.
                <span className="mt-2 block italic text-sand">Keep the weekend.</span>
              </h2>
              <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-ivory/85">
                Tell us about your space and receive a tailored estimate in under a minute. No calls, no waiting, no guesswork.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/quote" variant="light" size="lg">
                  Begin your reset
                  <Arrow />
                </ButtonLink>
                <ButtonLink
                  href="/contact"
                  size="lg"
                  className="border border-ivory/25 bg-transparent text-ivory hover:bg-ivory hover:text-soil"
                >
                  Speak to concierge
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </div>
      </section>
    </>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
