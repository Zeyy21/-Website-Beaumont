"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useT } from "@/components/i18n/locale-provider";

/**
 * Mobile-only quote bar pinned to the bottom of the viewport, keeping the quote
 * one tap away on phones (where the section was being scrolled past). Hidden on
 * desktop and on the quote flow itself, appears once the visitor scrolls past
 * the hero, and retreats while the footer is in view so it never sits on top of
 * the footer's own CTA.
 */
export function StickyQuoteBar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { dict } = useT();
  const t = dict.cta.sticky;
  const [visible, setVisible] = useState(false);

  // Routes where a floating quote prompt would be redundant or in the way.
  const suppressed = pathname === "/quote" || pathname.startsWith("/login");

  useEffect(() => {
    if (suppressed) {
      setVisible(false);
      return;
    }

    const footer = document.querySelector("footer");
    let footerVisible = false;

    const observer = footer
      ? new IntersectionObserver(
          (entries) => {
            footerVisible = entries[0]?.isIntersecting ?? false;
            update();
          },
          { rootMargin: "0px 0px -10% 0px" },
        )
      : null;
    observer?.observe(footer as Element);

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrolledPastHero = window.scrollY > window.innerHeight * 0.85;
        setVisible(scrolledPastHero && !footerVisible);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [suppressed, pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden"
          initial={reduce ? { opacity: 0 } : { y: "110%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "110%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="pointer-events-auto mx-3 mb-3 flex items-center gap-3 rounded-2xl border border-ivory/10 bg-soil/95 px-4 py-3 shadow-[0_18px_50px_-18px_rgba(0,0,0,.85)] backdrop-blur-xl">
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
                <Spark />
                <span className="truncate">{t.label}</span>
              </span>
            </span>
            <Link
              href="/quote"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-sm font-semibold text-soil shadow-soft transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-soil"
            >
              {t.button}
              <Arrow />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 3c.5 4.6 2.9 7 7.5 7.5-4.6.5-7 2.9-7.5 7.5-.5-4.6-2.9-7-7.5-7.5C9.1 10 11.5 7.6 12 3Z" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
