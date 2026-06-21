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
        <div className="overflow-hidden rounded-[2rem] border border-oak/10 bg-ivory/70 shadow-soft md:rounded-[2.75rem]" aria-label="Quote builder loading">
          <div className="h-20 border-b border-oak/10 bg-ivory/80" />
          <div className="grid min-h-[34rem] lg:grid-cols-[1.55fr_.75fr]">
            <div className="p-8 md:p-10">
              <div className="h-2 w-32 rounded-full bg-oak/10" />
              <div className="mt-7 h-10 w-2/3 rounded-full bg-oak/5" />
              <div className="mt-8 h-64 rounded-[1.5rem] bg-sand/20" />
            </div>
            <div className="h-72 bg-soil/90 lg:h-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
