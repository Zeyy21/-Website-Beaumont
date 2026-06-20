"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { HeroQuoteTeaser } from "@/components/hero-quote-teaser";
import { AnimatedBackdrop } from "@/components/animated-backdrop";

const ease = [0.22, 1, 0.36, 1] as const;

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
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <Eyebrow>Luxury home care · Quietly delivered</Eyebrow>
          </motion.div>

          <motion.h1 
            className="mt-6 text-[clamp(3.2rem,8vw,6.5rem)] font-display leading-[0.9] tracking-[-0.01em]"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.2 }}
          >
            Come home to
            <span className="mt-2 block italic text-sand">nothing left to do.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
            className="mt-8 max-w-xl text-lg text-ivory/80 md:text-xl font-medium leading-relaxed"
          >
            Not simply a cleaner driveway. A brighter arrival, restored curb appeal, and one less thing asking for your time.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <ButtonLink href="/quote" variant="light" size="lg" className="group">
              <span>Begin your reset</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonLink>
            <ButtonLink
              href="/about"
              size="lg"
              className="border border-ivory/20 bg-ivory/0 text-ivory backdrop-blur-sm hover:bg-ivory hover:text-soil"
            >
              Our philosophy
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
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
          transition={{ delay: 1 }}
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-[26px] items-start justify-center rounded-full border border-ivory/25 p-1.5"
          >
            <span className="h-2 w-[3px] rounded-full bg-ivory/60" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
