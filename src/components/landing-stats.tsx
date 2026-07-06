"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";

const ease = [0.22, 1, 0.36, 1] as const;

export function LandingStats() {
  const { locale } = useT();
  const stats = locale === "fr"
    ? [
        { value: "250+", label: "Maisons entretenues", note: "Et ce nombre continue de croître" },
        { value: "5 / 5", label: "Satisfaction globale", note: "La norme que nous protégeons" },
      ]
    : [
        { value: "250+", label: "Homes serviced", note: "And quietly counting" },
        { value: "5 / 5", label: "Overall satisfaction", note: "The standard we protect" },
      ];

  return (
    <Container className="px-0">
      <motion.div
        className="relative overflow-hidden rounded-[1.5rem] border border-ivory/12 bg-soil/45 shadow-[0_30px_90px_-48px_rgba(0,0,0,.9)] backdrop-blur-xl md:rounded-[1.9rem]"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 1.05, ease }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(244,241,236,.14),transparent_36%),linear-gradient(120deg,rgba(28,28,26,.3),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-3 top-2 h-px bg-gradient-to-r from-transparent via-sand/25 to-transparent md:inset-x-4" />
        <div className="relative grid grid-cols-2 divide-x divide-ivory/12">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              className="group relative px-3 py-5 text-center md:px-8 md:py-7 md:text-left"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.18 + index * 0.09, ease }}
            >
              <div className="flex items-center justify-center gap-3 md:items-start md:justify-between md:gap-5">
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-sand/70">0{index + 1}</span>
                {index === 1 && <span className="hidden md:block"><Stars /></span>}
              </div>
              <div className="mt-3 flex flex-col items-center gap-1 md:mt-4 md:flex-row md:items-end md:justify-between md:gap-5">
                <div>
                  <p className="font-display text-[clamp(1.7rem,7vw,3.6rem)] leading-none tracking-[-0.02em] text-ivory">{stat.value}</p>
                  <p className="mt-2 text-[8px] font-semibold uppercase leading-tight tracking-[0.18em] text-ivory/72 md:mt-2.5 md:text-[10px] md:tracking-[0.24em]">{stat.label}</p>
                </div>
                <p className="hidden max-w-[9rem] text-right text-xs font-medium leading-relaxed text-ivory/45 lg:block">{stat.note}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </Container>
  );
}

function Stars() {
  return (
    <div className="flex gap-1 text-[11px] tracking-[.08em] text-ochre" aria-hidden="true">
      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
    </div>
  );
}
