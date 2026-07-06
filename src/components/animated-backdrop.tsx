"use client";

import {
  motion,
  type TargetAndTransition,
} from "framer-motion";

/**
 * Premium animated hero backdrop, no video/image asset required:
 *  - deep soil base
 *  - three large gold/cinnamon gradient orbs drifting on slow independent loops
 *  - a faint perspective grid
 *  - a fine grain/noise overlay (inline SVG turbulence) for tactile depth
 *  - a vignette to focus the center
 * All GPU-friendly (transform/opacity). Honors reduced-motion (orbs hold still).
 */
export function AnimatedBackdrop() {
  const orb = (anim: TargetAndTransition) => ({
    animate: anim,
    transition: {
      duration: 18,
      repeat: Infinity,
      ease: "easeInOut" as const,
      repeatType: "mirror" as const,
    },
  });

  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      {/* base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-oak/40 via-soil to-soil" />

      {/* drifting orbs */}
      <motion.div
        className="absolute -left-32 -top-24 h-[42rem] w-[42rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,75,0.22), transparent 60%)",
        }}
        {...orb({ x: [0, 60, 0], y: [0, 40, 0] })}
      />
      <motion.div
        className="absolute right-[-10rem] top-1/4 h-[38rem] w-[38rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(122,67,39,0.45), transparent 60%)",
        }}
        {...orb({ x: [0, -50, 0], y: [0, 60, 0] })}
      />
      <motion.div
        className="absolute bottom-[-12rem] left-1/3 h-[40rem] w-[40rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(161,121,79,0.30), transparent 60%)",
        }}
        {...orb({ x: [0, 40, 0], y: [0, -40, 0] })}
      />

      {/* perspective grid */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,248,231,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,248,231,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(to top, black, transparent), radial-gradient(ellipse at center, black 40%, transparent 75%)",
          WebkitMaskImage:
            "linear-gradient(to top, black, transparent), radial-gradient(ellipse at center, black 40%, transparent 75%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
          transform: "perspective(600px) rotateX(55deg)",
          transformOrigin: "bottom",
        }}
      />

      {/* grain overlay */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay">
        <filter id="hero-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(29,23,15,0.55) 100%)",
        }}
      />
    </div>
  );
}
