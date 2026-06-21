"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef } from "react";
import { ButtonLink, Container } from "@/components/ui";

const ease = [0.22, 1, 0.36, 1] as const;

const copy: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.18 },
  },
};

const line: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -32]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 34]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative -mt-[72px] min-h-[100svh] overflow-hidden bg-soil text-ivory"
      aria-labelledby="hero-title"
    >
      <motion.div
        className="absolute -inset-y-10 inset-x-0 will-change-transform"
        initial={reduce ? false : { scale: 1.055, opacity: 0.72 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 1.8, ease }}
        style={{ y: imageY }}
      >
        <Image
          src="/images/montreal-home-hero.png"
          alt="Pale stone Montreal home with a restored interlocking driveway"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] md:object-center"
        />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,12,8,.93)_0%,rgba(17,12,8,.76)_42%,rgba(17,12,8,.2)_78%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,12,8,.5)_0%,transparent_34%,transparent_68%,rgba(17,12,8,.68)_100%)]" />

      <Container className="relative flex min-h-[100svh] items-end pb-16 pt-36 md:items-center md:pb-24 md:pt-32">
        <motion.div
          className="max-w-[58rem] will-change-transform"
          variants={copy}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: false, amount: 0.28 }}
          style={{ y: contentY }}
        >
          <motion.p variants={line} className="text-[10px] font-semibold uppercase tracking-[0.34em] text-sand md:text-[11px] md:tracking-[0.4em]">
            Luxury home care <span aria-hidden="true">·</span> Quietly delivered
          </motion.p>
          <motion.h1
            variants={line}
            id="hero-title"
            className="mt-6 text-balance font-display text-[clamp(3.45rem,7.7vw,7.6rem)] font-normal leading-[0.86] tracking-[-0.025em]"
          >
            Come home to
            <span className="mt-2 block italic text-sand">nothing left to do.</span>
          </motion.h1>
          <motion.p variants={line} className="mt-8 max-w-xl text-base font-medium leading-relaxed text-ivory/80 md:text-lg">
            Not simply a cleaner driveway. A brighter arrival, restored curb appeal,
            and one less thing asking for your time.
          </motion.p>
          <motion.div variants={line} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#quote" variant="light" size="lg">
              Begin your estimate
              <Arrow />
            </ButtonLink>
            <ButtonLink
              href="#about"
              size="lg"
              className="border border-ivory/35 bg-soil/20 text-ivory backdrop-blur-sm hover:bg-ivory hover:text-soil"
            >
              Our approach
            </ButtonLink>
          </motion.div>
        </motion.div>
      </Container>

      <motion.div
        className="absolute bottom-7 right-8 hidden items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-ivory/60 md:flex"
        initial={reduce ? false : { opacity: 0, x: 18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.9, ease, delay: 0.9 }}
      >
        <span className="h-px w-12 bg-sand/60" />
        Greater Montréal
      </motion.div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
