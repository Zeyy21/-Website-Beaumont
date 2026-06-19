"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatCurrency } from "@/lib/pricing";

/**
 * Decorative hero card: a stylized "instant quote" that animates a price
 * counting up, hinting at the real tool. Purely visual.
 */
export function HeroQuoteTeaser() {
  const reduce = useReducedMotion();
  const target = 184;
  const [value, setValue] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* faux map */}
      <div className="relative overflow-hidden rounded-3xl border border-ivory/15 bg-oak/40 p-1 shadow-lift backdrop-blur">
        <div className="relative h-44 overflow-hidden rounded-[20px] bg-gradient-to-br from-ochre/40 to-soil">
          <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 320 180">
            <g stroke="#F9F8E7" strokeOpacity="0.25" fill="none">
              <path d="M0 60 H320 M0 120 H320 M80 0 V180 M180 0 V180 M260 0 V180" />
            </g>
            <motion.polygon
              points="120,60 210,70 200,130 110,120"
              fill="#F9F8E7"
              fillOpacity="0.18"
              stroke="#F9F8E7"
              strokeWidth="2"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </svg>
          <span className="absolute left-3 top-3 rounded-full bg-soil/60 px-3 py-1 text-xs text-ivory/80">
            Your home · 142 m²
          </span>
        </div>

        {/* price readout */}
        <div className="space-y-3 p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-ivory/60">Estimated visit</span>
            <span className="font-display text-4xl text-ivory tabular-nums">
              {formatCurrency(value)}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { l: "Signature Deep Clean", w: "70%" },
              { l: "Bi-weekly · 142 m²", w: "45%" },
              { l: "Interior windows", w: "25%" },
            ].map((row, i) => (
              <div key={row.l} className="flex items-center gap-3">
                <motion.div
                  className="h-1.5 rounded-full bg-sand"
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: row.w }}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.15 }}
                />
                <span className="whitespace-nowrap text-xs text-ivory/50">
                  {row.l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
