"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Monogram } from "@/components/ui";

const chapters = [
  {
    number: "01",
    eyebrow: "Arrival",
    title: "Your day keeps moving.",
    copy: "We arrive prepared, protect the surrounding landscape, and work around the rhythm of your property.",
  },
  {
    number: "02",
    eyebrow: "The ritual",
    title: "Every surface comes back to life.",
    copy: "Material-aware pressure, considered treatments, and eyes trained to see where buildup likes to hide.",
  },
  {
    number: "03",
    eyebrow: "The return",
    title: "And then, the exhale.",
    copy: "The stone looks brighter. The entrance feels cared for. Your home makes the right first impression again.",
  },
];

export function ExperienceSequence() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const firstOpacity = useTransform(scrollYProgress, [0, 0.08, 0.27, 0.36], [0, 1, 1, 0]);
  const secondOpacity = useTransform(scrollYProgress, [0.29, 0.39, 0.58, 0.67], [0, 1, 1, 0]);
  const thirdOpacity = useTransform(scrollYProgress, [0.61, 0.72, 1], [0, 1, 1]);
  const firstY = useTransform(scrollYProgress, [0, 0.36], [40, -35]);
  const secondY = useTransform(scrollYProgress, [0.29, 0.67], [40, -35]);
  const thirdY = useTransform(scrollYProgress, [0.61, 1], [40, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [24, -18]);
  const veilOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.56, 0.28, 0.08]);
  const monogramRotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const firstProgress = useTransform(scrollYProgress, [0, 0.33], [0, 1]);
  const secondProgress = useTransform(scrollYProgress, [0.33, 0.66], [0, 1]);
  const thirdProgress = useTransform(scrollYProgress, [0.66, 1], [0, 1]);

  const opacity = [firstOpacity, secondOpacity, thirdOpacity];
  const y = [firstY, secondY, thirdY];
  const chapterProgress = [firstProgress, secondProgress, thirdProgress];

  return (
    <section
      ref={ref}
      className="relative h-[270svh] bg-ivory motion-reduce:h-auto"
      aria-label="The Beaumont way"
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden py-20 motion-reduce:relative motion-reduce:min-h-0">
        <div className="pointer-events-none absolute -left-[12vw] top-[5vh] font-display text-[36vw] leading-none text-oak/[0.025]">
          B
        </div>

        <div className="mx-auto grid w-full max-w-shell items-center gap-12 px-6 md:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div className="relative z-10 min-h-[21rem] md:min-h-[25rem]">
            <p className="mb-12 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-cinnamon">
              <span className="h-px w-10 bg-cinnamon/50" />
              The Beaumont way
            </p>

            <div className="relative min-h-[17rem]">
              {chapters.map((chapter, index) => (
                <motion.article
                  key={chapter.number}
                  style={reduce ? undefined : { opacity: opacity[index], y: y[index] }}
                  className={reduce ? "mb-14" : "absolute inset-0"}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-2xl text-ochre">{chapter.number}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-soil/45">
                      {chapter.eyebrow}
                    </span>
                  </div>
                  <h2 className="mt-6 max-w-lg text-balance font-display text-[clamp(3rem,6vw,5.4rem)] leading-[0.92] text-oak">
                    {chapter.title}
                  </h2>
                  <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-soil/80 md:text-lg">
                    {chapter.copy}
                  </p>
                </motion.article>
              ))}
            </div>

            {!reduce && (
              <div className="absolute bottom-0 left-0 flex gap-2">
                {chapters.map((chapter, index) => (
                  <div key={chapter.number} className="h-px w-14 overflow-hidden bg-oak/15">
                    <motion.div
                      className="h-full origin-left bg-cinnamon"
                      style={{ scaleX: chapterProgress[index] }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <motion.div
            className="relative aspect-[4/5] max-h-[74svh] overflow-hidden rounded-[2rem] bg-oak shadow-lift md:rounded-[3.5rem]"
            style={reduce ? undefined : { y: imageY }}
          >
            <motion.div className="absolute inset-[-8%]" style={reduce ? undefined : { scale: imageScale }}>
              <Image
                src="/images/pressure-washed-patio-placeholder.png"
                alt="A freshly pressure-washed stone patio and pool surround"
                fill
                sizes="(min-width: 1024px) 54vw, 92vw"
                className="object-cover"
                priority={false}
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-soil/70 via-cinnamon/15 to-transparent"
              style={reduce ? undefined : { opacity: veilOpacity }}
            />
            <div className="absolute inset-5 rounded-[1.35rem] border border-ivory/25 md:inset-8 md:rounded-[2.6rem]" />
            <motion.div
              style={reduce ? undefined : { rotate: monogramRotate }}
              className="absolute bottom-9 right-9 flex h-20 w-20 items-center justify-center rounded-full border border-ivory/25 bg-soil/20 backdrop-blur-md md:h-28 md:w-28"
            >
              <Monogram className="h-10 w-10 md:h-14 md:w-14" size={56} />
            </motion.div>
            <p className="absolute left-9 top-9 max-w-[9rem] text-[9px] font-medium uppercase leading-relaxed tracking-[0.28em] text-ivory/75 md:left-12 md:top-12">
              Care that can be felt
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
