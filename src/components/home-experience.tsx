"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui";

const ease = [0.22, 1, 0.36, 1] as const;

const chapters = [
  {
    number: "01",
    eyebrow: "Arrival",
    title: "Prepared around your property.",
    copy: "We arrive with the right treatment, protect the surrounding landscape, and set a clear scope before water touches stone.",
  },
  {
    number: "02",
    eyebrow: "The work",
    title: "Pressure, precisely applied.",
    copy: "Concrete, pavers, natural stone, and siding each receive a method chosen for the material—not a one-setting-fits-all wash.",
  },
  {
    number: "03",
    eyebrow: "The return",
    title: "Nothing left but the result.",
    copy: "Edges are finished, runoff is managed, and the property is returned brighter, orderly, and ready to enjoy.",
  },
];

export function ExperienceSequence() {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="scroll-mt-20 overflow-hidden bg-sand/20 py-24 md:py-36" aria-labelledby="approach-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, ease }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cinnamon">Who we are</p>
              <h2 id="approach-title" className="mt-6 text-balance font-display text-[clamp(3.2rem,5.7vw,5.9rem)] leading-[0.9] text-oak">
                Quiet service.
                <span className="block italic text-ochre">Exacting care.</span>
              </h2>
              <p className="mt-7 max-w-lg text-lg font-medium leading-relaxed text-soil/75">
                Beaumont is exterior restoration without the noise, guesswork, or unnecessary theatre. Every visit is considered from arrival to final walkthrough.
              </p>
            </motion.div>

            <motion.div
              className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[2rem] bg-oak shadow-lift md:rounded-[3rem]"
              initial={reduce ? false : { opacity: 0, scale: 0.975 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.05, ease, delay: 0.08 }}
            >
              <Image
                src="/images/pressure-washed-patio-placeholder.png"
                alt="A carefully restored stone patio and pool surround"
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-soil/60 via-transparent to-transparent" />
              <p className="absolute bottom-7 left-7 text-[9px] font-semibold uppercase tracking-[0.28em] text-ivory/80 md:bottom-9 md:left-9">
                Material-aware exterior care
              </p>
            </motion.div>
          </div>

          <ol className="border-t border-oak/15">
            {chapters.map((chapter, index) => (
              <motion.li
                key={chapter.number}
                className="grid gap-6 border-b border-oak/15 py-10 md:grid-cols-[5rem_1fr] md:py-14"
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.85, ease, delay: index * 0.08 }}
              >
                <div>
                  <span className="font-display text-2xl text-ochre">{chapter.number}</span>
                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.26em] text-soil/45">{chapter.eyebrow}</p>
                </div>
                <div>
                  <h3 className="max-w-lg font-display text-4xl leading-[0.98] text-oak md:text-5xl">{chapter.title}</h3>
                  <p className="mt-5 max-w-lg text-base font-medium leading-relaxed text-soil/70 md:text-lg">{chapter.copy}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
