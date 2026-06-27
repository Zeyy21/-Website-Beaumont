"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Darkened montage of real Beaumont exterior-care work, tiled behind the CTA
 * the way the reference design layers a gallery behind its headline.
 */
const montage = [
  "/images/montreal-driveway-pressure-washing.webp",
  "/images/montreal-deck-pressure-washing.webp",
  "/images/atlantic-window-care-montreal.webp",
  "/images/luxury-home.png",
  "/images/atlantic-window-care-montreal.webp",
  "/images/montreal-driveway-pressure-washing.webp",
  "/images/luxury-home.png",
  "/images/montreal-deck-pressure-washing.webp",
];

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease, delay: 0.1 + i * 0.09 },
  }),
};

/**
 * Full-width "Get Quote" call to action. A single immersive dark panel that
 * carries the free-estimate headline and routes visitors to the dedicated
 * /quote onboarding experience, replacing the old inline quote builder.
 */
export function QuoteCta() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      data-header-tone="dark"
      initial={reduce ? false : { opacity: 0, y: 36, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 1, ease }}
      className="group relative isolate overflow-hidden rounded-[2.25rem] bg-soil text-ivory shadow-[0_60px_150px_-65px_rgba(29,23,15,.9)] md:rounded-[3rem]"
    >
      {/* Drifting image montage */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        initial={reduce ? false : { scale: 1.08 }}
        animate={reduce ? undefined : { scale: 1.16 }}
        transition={
          reduce
            ? undefined
            : { duration: 26, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
        }
      >
        {montage.map((src, index) => (
          <div key={`${src}-${index}`} className="relative overflow-hidden">
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </motion.div>

      {/* Tonal scrims keep the white type legible over any tile */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-soil/82" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_4%,rgba(29,23,15,.55)_58%,rgba(29,23,15,.94)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-soil via-soil/25 to-soil/55"
      />

      {/* Inner editorial frame, matching the service cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-[1.7rem] border border-ivory/15 md:inset-5 md:rounded-[2.45rem]"
      />

      {/* Quiet corner markers, echoing the reference composition */}
      <div className="pointer-events-none absolute left-7 top-7 z-10 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-ivory/55 md:flex">
        <span className="h-px w-7 bg-sand/50" />
        Greater Montréal
      </div>
      <div className="pointer-events-none absolute right-8 top-7 z-10 hidden font-display text-2xl text-sand/70 md:block">
        B.
      </div>

      {/* Centered content */}
      <div className="relative z-10 mx-auto flex min-h-[40rem] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center md:min-h-[48rem] md:py-32">
        <motion.div
          custom={0}
          variants={reveal}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          <span className="font-display text-2xl text-ochre">03</span>
          <span className="h-px w-10 bg-sand/40" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sand">Free estimate</span>
          <span className="h-px w-10 bg-sand/40" />
        </motion.div>

        <motion.h2
          id="quote-title"
          custom={1}
          variants={reveal}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.6 }}
          className="mt-7 text-balance font-display text-[clamp(3rem,6.6vw,6.25rem)] leading-[0.9] tracking-[-0.01em]"
        >
          Your property. Your care.
          <span className="mt-1 block italic text-sand/85">One reviewed quote.</span>
        </motion.h2>

        <motion.p
          custom={2}
          variants={reveal}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.6 }}
          className="mx-auto mt-7 max-w-xl text-base font-medium leading-relaxed text-ivory/75 md:text-lg"
        >
          Select your address, choose the exterior services you need, and send the scope for
          review — in a few quiet steps.
        </motion.p>

        <motion.div
          custom={3}
          variants={reveal}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory/55"
        >
          <span className="inline-flex items-center gap-2">
            <Spark />
            No payment to request
          </span>
          <span className="hidden h-3 w-px bg-ivory/20 sm:block" />
          <span>A written quote within 24 hours</span>
        </motion.div>

        <motion.div
          custom={4}
          variants={reveal}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.6 }}
          className="mt-11"
        >
          <Link
            href="/quote"
            className="group/btn inline-flex items-center gap-3 rounded-full border border-ivory/45 bg-ivory/[0.16] px-9 py-5 text-base font-semibold tracking-wide text-ivory shadow-[0_24px_60px_-26px_rgba(0,0,0,.85)] ring-1 ring-inset ring-ivory/10 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-ivory hover:bg-ivory hover:text-soil hover:shadow-[0_30px_70px_-24px_rgba(0,0,0,.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-soil"
          >
            <Tag />
            Get Quote
            <Arrow className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Tag() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M3.5 11.3V5.5A2 2 0 0 1 5.5 3.5h5.8a2 2 0 0 1 1.42.59l7 7a2 2 0 0 1 0 2.83l-5.8 5.8a2 2 0 0 1-2.83 0l-7-7a2 2 0 0 1-.59-1.42Z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.35" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-sand" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" strokeLinecap="round" />
    </svg>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className ?? ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
