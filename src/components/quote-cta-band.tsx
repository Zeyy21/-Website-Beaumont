"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Secondary quote calls-to-action placed between content sections so the quote
 * is never more than a glance away. Two on-brand variants:
 *  - "band":   a warm Off-white strip that breaks up the dark testimonial → quote
 *              stretch and re-surfaces the offer after social proof.
 *  - "process": a compact inline prompt closing the how-it-works sequence.
 * Both deep-link to /quote.
 */
export function QuoteCtaBand({ variant = "band" }: { variant?: "band" | "process" }) {
  const reduce = useReducedMotion();
  const { dict } = useT();
  const t = dict.cta[variant];

  const inner =
    variant === "band" ? (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-cinnamon/15 bg-sand px-7 py-9 shadow-[0_30px_80px_-50px_rgba(28,28,26,.6)] md:rounded-[2.25rem] md:px-12 md:py-11">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(31,73,52,.12)_0%,transparent_70%)] blur-2xl"
        />
        <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cinnamon">
              {(t as typeof dict.cta.band).eyebrow}
            </p>
            <p className="mt-3 font-display text-[2rem] leading-[1.04] text-oak md:text-[2.6rem]">
              {(t as typeof dict.cta.band).title}
            </p>
          </div>
          <Link
            href="/quote"
            className="group/btn inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-cinnamon px-8 py-4 text-sm font-semibold tracking-wide text-ivory shadow-[0_18px_45px_-20px_rgba(31,73,52,.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-oak focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
          >
            {t.button}
            <Arrow className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-5 rounded-[1.5rem] border border-oak/10 bg-ivory/70 px-7 py-7 text-center shadow-[0_24px_70px_-50px_rgba(28,28,26,.5)] sm:flex-row sm:justify-center sm:gap-7 sm:text-left md:px-10">
        <p className="font-display text-2xl leading-snug text-oak md:text-[1.75rem]">
          {(t as typeof dict.cta.process).text}
        </p>
        <Link
          href="/quote"
          className="group/btn inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-cinnamon px-7 py-3.5 text-sm font-semibold tracking-wide text-ivory shadow-[0_16px_40px_-20px_rgba(31,73,52,.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-oak focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          {t.button}
          <Arrow className="transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    );

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.8, ease }}
    >
      <Container>{inner}</Container>
    </motion.div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className ?? ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
