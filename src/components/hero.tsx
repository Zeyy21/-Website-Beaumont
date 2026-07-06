"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { ButtonLink, Container } from "@/components/ui";
import { LandingStats } from "@/components/landing-stats";
import { HeroVideo } from "@/components/hero-video";
import { useT } from "@/components/i18n/locale-provider";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { dict, locale } = useT();
  const t = dict.hero;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  useEffect(() => {
    if (window.location.hash) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    let secondFrame = 0;
    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    reset();
    const firstFrame = window.requestAnimationFrame(() => {
      reset();
      secondFrame = window.requestAnimationFrame(reset);
    });
    const settle = window.setTimeout(reset, 240);
    window.addEventListener("pagehide", reset);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(settle);
      window.removeEventListener("pagehide", reset);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return (
    <section
      ref={ref}
      id="top"
      data-header-tone="dark"
      className="relative -mt-[84px] min-h-[100svh] overflow-hidden bg-soil text-ivory"
      aria-labelledby="hero-title"
    >
      <motion.div
        className="absolute -inset-5 will-change-[clip-path]"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1.45, ease }}
      >
        <HeroVideo  />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(28,28,26,.18),rgba(17,15,12,.62)_72%,rgba(17,15,12,.82)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,15,12,.46)_0%,rgba(17,15,12,.12)_30%,rgba(17,15,12,.38)_68%,rgba(17,15,12,.78)_100%)]" />
      <div className="hero-film-grain absolute inset-0 opacity-[.13]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 top-[100px] rounded-[1.5rem] border border-ivory/14 md:bottom-6 md:left-6 md:right-6 md:top-[108px] md:rounded-[2.25rem]" />

      <Container className="relative flex min-h-[100svh] items-center justify-center pb-[12rem] pt-32 md:pb-[15rem] md:pt-32">
        <motion.div
          className="mx-auto flex max-w-[74rem] flex-col items-center text-center"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <h1
            id="hero-title"
            className={`${locale === "fr" ? "text-[2rem]" : "text-[2.65rem]"} font-display font-normal leading-[0.91] tracking-[-0.025em] drop-shadow-md sm:text-5xl md:text-[clamp(3rem,5vw,5.9rem)]`}
          >
            <span className="block overflow-hidden pb-[.08em]">
              <motion.span
                className="block whitespace-nowrap"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease }}
              >
                {t.titleA}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[.08em] text-sand">
              <motion.span
                className="block whitespace-nowrap"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.95, delay: 0.48, ease }}
              >
                {t.titleB}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[.12em] text-sand">
              <motion.span
                className="block whitespace-nowrap"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.95, delay: 0.6, ease }}
              >
                {t.titleC}
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-base font-medium leading-relaxed text-ivory/78 md:text-lg drop-shadow"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.72, ease }}
          >
            {t.body}
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.82, ease }}
          >
            <ButtonLink href="#quote" variant="light" size="lg">
              {t.ctaPrimary}
              <Arrow />
            </ButtonLink>
          </motion.div>
        </motion.div>
      </Container>

      <motion.div
        className="absolute inset-x-0 bottom-6 z-20 md:bottom-9"
        style={{ opacity: contentOpacity }}
      >
        <div className="mb-5 hidden items-center justify-center gap-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-ivory/55 md:flex">
          <span className="h-px w-10 bg-sand/45" />
          {dict.common.montreal}
          <span className="h-px w-10 bg-sand/45" />
        </div>
        <LandingStats />
      </motion.div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
