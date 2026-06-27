"use client";

import { useEffect } from "react";

/**
 * When a visitor returns to /quote?completeQuote=1 after authenticating, the
 * QuoteBuilder replays their saved request automatically. This nudges the page
 * down to the builder so the resumed result is the first thing they see,
 * instead of the hero. No-op for a normal visit.
 */
export function QuoteResumeAnchor() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("completeQuote") !== "1") return;
    const target = document.getElementById("estimate");
    if (!target) return;
    const timer = window.setTimeout(
      () => target.scrollIntoView({ behavior: "smooth", block: "start" }),
      350,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
