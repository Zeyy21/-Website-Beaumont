"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import type { ServiceCard } from "@/lib/data";
import { QuoteBuilder } from "./quote-builder";

export function LazyQuoteBuilder({ services }: { services: ServiceCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useInView(ref, { once: true, margin: "500px 0px" });

  return (
    <div ref={ref}>
      {ready ? (
        <QuoteBuilder services={services} initialZone={null} />
      ) : (
        <div className="grid min-h-[44rem] gap-8 lg:grid-cols-[1.4fr_1fr]" aria-label="Quote builder loading">
          <div className="rounded-3xl border border-oak/10 bg-ivory/60 p-8">
            <div className="h-2 w-36 rounded-full bg-oak/10" />
            <div className="mt-10 h-[30rem] rounded-3xl bg-oak/5" />
          </div>
          <div className="h-72 rounded-3xl bg-soil/90" />
        </div>
      )}
    </div>
  );
}
