"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container, Eyebrow } from "@/components/ui";

const quotes = [
  {
    quote:
      "The most thorough clean we have ever had. The instant quote took a minute and the team was flawless.",
    name: "Eleanor V.",
    detail: "Estate & Luxury Care",
  },
  {
    quote:
      "Drawing my apartment on the map and getting a price on the spot felt like magic. Booking was effortless.",
    name: "Marcus T.",
    detail: "Bi-weekly Residential",
  },
  {
    quote:
      "Discreet, meticulous, and genuinely premium. The reward points are a lovely touch I did not expect.",
    name: "Priya S.",
    detail: "Signature Deep Clean",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-cinnamon">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.5L6 21l1.5-7L2 9.5 9 9z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const reduce = useReducedMotion();
  return (
    <section className="texture-soil relative overflow-hidden py-28 text-ivory">
      <Container>
        <div className="text-center">
          <Eyebrow>Loved by discerning homes</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl text-ivory md:text-5xl">
            A standard our clients feel
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between rounded-3xl border border-ivory/10 bg-ivory/5 p-8 backdrop-blur-sm"
            >
              <div>
                <Stars />
                <blockquote className="mt-5 font-display text-xl leading-relaxed text-ivory/90">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-6 border-t border-ivory/10 pt-5">
                <p className="font-medium text-ivory">{q.name}</p>
                <p className="text-sm text-ivory/50">{q.detail}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
