"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/config";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { HeroQuoteTeaser } from "@/components/hero-quote-teaser";
import { AnimatedBackdrop } from "@/components/animated-backdrop";

const ease = [0.22, 1, 0.36, 1] as const;

// Word-by-word reveal for the headline.
const line1 = ["A", "home", "returned", "to"];
const line2 = ["quiet", "perfection."];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Parallax: content drifts up slightly and fades as you scroll past.
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-soil text-ivory"
    >
      <AnimatedBackdrop />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto grid w-full max-w-shell items-center gap-12 px-6 py-28 md:px-8 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <Eyebrow>Luxury cleaning, reimagined</Eyebrow>
          </motion.div>

          <h1 className="mt-6 text-[clamp(2.75rem,7vw,5.25rem)] font-display leading-[1.0]">
            <span className="block overflow-hidden">
              {line1.map((w, i) => (
                <Word key={w} delay={0.15 + i * 0.08} reduce={reduce}>
                  {w}
                </Word>
              ))}
            </span>
            <span className="block overflow-hidden text-sand">
              {line2.map((w, i) => (
                <Word key={w} delay={0.15 + (line1.length + i) * 0.08} reduce={reduce}>
                  {w}
                </Word>
              ))}
            </span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
            className="mt-7 max-w-xl text-lg text-ivory/65"
          >
            {site.description}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.68 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <ButtonLink href="/quote" variant="light" size="lg" className="group">
              <span>Draw your space, get a price</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonLink>
            <ButtonLink
              href="/services"
              size="lg"
              className="border border-ivory/20 bg-ivory/0 text-ivory backdrop-blur-sm hover:bg-ivory hover:text-soil"
            >
              Our services
            </ButtonLink>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-9 flex items-center gap-2 text-sm text-ivory/40"
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sand" />
            Instant estimate in under a minute · No account required to start
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.4 }}
          className="hidden lg:block"
        >
          <HeroQuoteTeaser />
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      {!reduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-6 items-start justify-center rounded-full border border-ivory/25 p-1.5"
          >
            <span className="h-1.5 w-1 rounded-full bg-ivory/60" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

function Word({
  children,
  delay,
  reduce,
}: {
  children: string;
  delay: number;
  reduce: boolean | null;
}) {
  return (
    <span className="mr-[0.25em] inline-block">
      <motion.span
        className="inline-block"
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.8, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
