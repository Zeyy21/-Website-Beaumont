"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative hero card: a stylized quote-review panel that hints at the real
 * request flow without showing area pricing or map tools.
 */
export function HeroQuoteTeaser() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="relative overflow-hidden rounded-3xl border border-ivory/15 bg-oak/40 p-1 shadow-lift backdrop-blur">
        <div className="relative h-44 overflow-hidden rounded-[20px] bg-gradient-to-br from-ochre/40 to-soil p-5">
          <div className="absolute inset-0 opacity-25">
            <svg className="h-full w-full" viewBox="0 0 320 180" aria-hidden="true">
              <g stroke="#F9F8E7" strokeOpacity="0.3" fill="none">
                <path d="M0 62 H320 M0 122 H320 M70 0 V180 M172 0 V180 M258 0 V180" />
              </g>
            </svg>
          </div>
          <div className="relative">
            <span className="rounded-full bg-soil/60 px-3 py-1 text-xs text-ivory/80">
              Scope received
            </span>
            <p className="mt-8 font-display text-4xl leading-tight text-ivory">
              Exterior care review
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ivory/60">
              Driveway, deck, house wash, and windows ready for confirmation.
            </p>
          </div>
        </div>

        <div className="space-y-3 p-5">
          {[
            { l: "Services selected", w: "76%" },
            { l: "Access reviewed", w: "52%" },
            { l: "Quote pending", w: "34%" },
          ].map((row, i) => (
            <div key={row.l} className="flex items-center gap-3">
              <motion.div
                className="h-1.5 rounded-full bg-sand"
                initial={reduce ? false : { width: 0 }}
                animate={{ width: row.w }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
              />
              <span className="whitespace-nowrap text-xs text-ivory/50">
                {row.l}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
