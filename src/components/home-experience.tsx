"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";

const ease = [0.22, 1, 0.36, 1] as const;

export function ExperienceSequence() {
  const { dict } = useT();
  const t = dict.approach;
  const chapters = [
    { number: "01", ...t.chapters.arrival },
    { number: "02", ...t.chapters.work },
    { number: "03", ...t.chapters.return },
  ];

  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden bg-sand/20 py-24 md:py-40" aria-labelledby="approach-title">
      <div aria-hidden="true" className="pointer-events-none absolute -left-12 top-10 font-display text-[20rem] leading-none text-oak/[0.025] md:text-[30rem]">02</div>
      <Container>
        <div className="relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.9, ease }}
            >
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl text-ochre">02</span>
                <span className="h-px w-12 bg-ochre/40" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cinnamon">{t.eyebrow}</p>
              </div>
              <h2 id="approach-title" className="mt-6 text-balance font-display text-[clamp(3.2rem,5.7vw,5.9rem)] leading-[0.9] text-oak">
                {t.titleA}
                <span className="block italic text-ochre">{t.titleB}</span>
              </h2>
              <p className="mt-7 max-w-lg text-lg font-medium leading-relaxed text-soil/75">
                {t.intro}
              </p>
            </motion.div>

            <motion.div
              className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[2rem] bg-oak shadow-lift md:rounded-[3rem]"
              initial={{ opacity: 0, scale: 0.975 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1.05, ease, delay: 0.08 }}
            >
              <Image
                src="/images/montreal-deck-pressure-washing.webp"
                alt={t.imageAlt}
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-soil/60 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-3 rounded-[1.45rem] border border-ivory/15 md:inset-4 md:rounded-[2.3rem]" />
              <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between gap-4 md:bottom-9 md:left-9 md:right-9">
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-ivory/80">{t.imageCaption}</p>
                <span className="font-display text-2xl text-sand">B.</span>
              </div>
            </motion.div>
          </div>

          <ol className="space-y-4">
            {chapters.map((chapter, index) => (
              <motion.li
                key={chapter.number}
                className="group grid gap-6 rounded-[2rem] border border-oak/10 bg-ivory/55 p-7 shadow-[0_20px_60px_-46px_rgba(28,28,26,.7)] transition-colors duration-500 hover:bg-ivory/85 md:grid-cols-[5rem_1fr] md:rounded-[2.5rem] md:p-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.85, ease, delay: index * 0.08 }}
              >
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-oak/10 font-display text-xl text-ochre transition-colors duration-500 group-hover:bg-oak group-hover:text-ivory">{chapter.number}</span>
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
