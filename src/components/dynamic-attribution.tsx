"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const regions = [
  "Westmount",
  "Nun's Island",
  "Outremont",
  "Mount Royal",
  "Hampstead",
  "Beaconsfield",
  "Pointe-Claire",
];

export function DynamicAttribution({ name }: { name: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % regions.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-flex gap-1 items-center">
      {name} ·{" "}
      <span className="relative inline-flex items-center overflow-hidden h-[1.2em]">
        <AnimatePresence mode="wait">
          <motion.span
            key={regions[index]}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            {regions[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
