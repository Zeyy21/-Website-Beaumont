"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";
import type { ServiceCard } from "@/lib/data";

const images = [
  "/images/SEASONAL PICTURES/SPRING.jpg",
  "/images/SEASONAL PICTURES/SUMMER.jpg",
  "/images/SEASONAL PICTURES/AUTUMN.jpg",
];

const ease = [0.22, 1, 0.36, 1] as const;
// Symmetric ease-in-out for cross-fades — no end-snap, so transitions read as a
// slow premium dissolve rather than a bounce.
const calm = [0.4, 0, 0.2, 1] as const;

export function SeasonalCycle({ services }: { services: ServiceCard[] }) {
  const { dict, locale } = useT();
  const [desktop, setDesktop] = useState(false);

  const seasons =
    locale === "fr"
      ? ["Printemps", "Été", "Automne"]
      : ["Spring", "Summer", "Autumn"];

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const pinned = desktop;

  // The pinned experience owns its own useScroll so the scroll target mounts at
  // the same time the hook initializes. Mounting the ref'd <section> only after
  // a state flip (as a conditional branch would) leaves Framer measuring a stale
  // layout and skews scrollYProgress.
  if (!pinned) {
    return <SeasonalStatic seasons={seasons} services={services} dict={dict} />;
  }

  return <PinnedSeasons seasons={seasons} services={services} dict={dict} />;
}

function PinnedSeasons({
  seasons,
  services,
  dict,
}: {
  seasons: string[];
  services: ServiceCard[];
  dict: ReturnType<typeof useT>["dict"];
}) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  // Gently smooth the raw scroll so the image cross-fade glides instead of
  // tracking every scroll tick. Both the layers and the active word read from
  // this so they stay perfectly in sync.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 26,
    mass: 0.4,
  });

  // Track which season is "active" from scroll depth so the typography and meta
  // line swap in tandem with the cross-fading image (word flips at each slice
  // boundary, i.e. the midpoint of the corresponding image blend).
  useMotionValueEvent(smooth, "change", (v) => {
    const next = Math.min(
      seasons.length - 1,
      Math.max(0, Math.floor(v * seasons.length)),
    );
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section
      ref={section}
      data-header-tone="dark"
      className="relative bg-soil text-ivory"
      style={{ height: `${seasons.length * 135}vh` }}
      aria-labelledby="seasonal-title"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="hero-film-grain pointer-events-none absolute inset-0 opacity-[.1]" aria-hidden="true" />

        {/* Cross-fading image stage */}
        <div className="absolute inset-0">
          {images.map((src, index) => (
            <SeasonLayer key={src} src={src} index={index} progress={smooth} count={seasons.length} />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(28,28,26,.28),rgba(17,15,12,.72)_78%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-soil/92 via-soil/28 to-soil/48" />
          <div className="pointer-events-none absolute inset-5 rounded-[2.25rem] border border-ivory/12 md:inset-8" />
        </div>

        <Container className="relative z-10 flex h-full flex-col justify-between py-16 md:py-20">
          {/* Header */}
          <motion.div
            className="flex items-end justify-between gap-7 border-b border-ivory/12 pb-8"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.75, ease }}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-sand">{dict.frequencies.monthly.label}</p>
              <p className="mt-4 max-w-md text-balance font-display text-[clamp(1.6rem,2.3vw,2.5rem)] leading-[1.02]">
                {dict.frequencies.monthly.note}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-display text-2xl italic text-sand/70">01</span>
              <span className="h-px w-12 bg-ivory/18" />
              <span className="font-display text-2xl italic text-sand/70">0{seasons.length}</span>
            </div>
          </motion.div>

          {/* Center: cross-fading season word */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative h-[1.05em] font-display text-[clamp(4.5rem,15vw,13rem)] italic leading-none tracking-[-0.02em] drop-shadow-lg">
              {/* Sizing ghost keeps the container width to the longest word */}
              <span className="invisible whitespace-nowrap" aria-hidden="true">
                {seasons.reduce((a, b) => (b.length > a.length ? b : a))}
              </span>
              {seasons.map((season, index) => (
                <motion.h2
                  key={season}
                  id={index === 0 ? "seasonal-title" : undefined}
                  className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-center text-ivory will-change-[opacity,transform]"
                  aria-hidden={active !== index}
                  animate={{
                    opacity: active === index ? 1 : 0,
                    // A whisper of scale + blur only — no vertical travel, so the
                    // words dissolve into one another instead of springing.
                    scale: active === index ? 1 : 1.045,
                    filter: active === index ? "blur(0px)" : "blur(10px)",
                  }}
                  transition={{
                    opacity: { duration: 1.1, ease: calm },
                    scale: { duration: 1.3, ease: calm },
                    filter: { duration: 1.1, ease: calm },
                  }}
                >
                  {season}
                </motion.h2>
              ))}
            </div>
          </div>

          {/* Footer: active meta + progress */}
          <div className="flex flex-col gap-6">
            <div className="relative h-5 overflow-hidden">
              {seasons.map((season, index) => (
                <motion.div
                  key={season}
                  className="absolute inset-0 flex items-center justify-center gap-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-ivory/70"
                  animate={{ opacity: active === index ? 1 : 0, y: active === index ? 0 : 6 }}
                  transition={{ duration: 0.9, ease: calm }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="h-px w-8 bg-sand/45" />
                  <span>{services[index % services.length]?.name}</span>
                </motion.div>
              ))}
            </div>

            <div className="mx-auto flex w-full max-w-3xl items-center gap-4">
              {seasons.map((season, index) => (
                <div key={season} className="flex flex-1 flex-col items-center gap-2.5">
                  <div className="h-px w-full overflow-hidden bg-ivory/12">
                    <SegmentFill index={index} count={seasons.length} progress={smooth} />
                  </div>
                  <span
                    className={`text-[9px] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 ${
                      active === index ? "text-sand" : "text-ivory/35"
                    }`}
                  >
                    {season}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/** One cross-fading full-bleed season image, opacity driven by scroll depth. */
function SeasonLayer({
  src,
  index,
  progress,
  count,
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
  count: number;
}) {
  // Each season owns a 1/count slice, fully opaque through its middle. At every
  // slice boundary the outgoing season fades 1→0 while the incoming one fades
  // 0→1 over the SAME narrow band, so exactly one season is ever fully visible
  // (they only blend within the band, and never both sit at full opacity).
  const step = 1 / count;
  const half = step * 0.42; // half-width of each cross-fade band (wider = softer blend)
  const inStart = index * step - half; // boundary before this slice
  const inEnd = index * step + half;
  const outStart = (index + 1) * step - half; // boundary after this slice
  const outEnd = (index + 1) * step + half;

  const opacity = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [index === 0 ? 1 : 0, 1, 1, index === count - 1 ? 1 : 0],
    { clamp: true },
  );
  const center = index * step + step / 2;
  const scale = useTransform(
    progress,
    [center - step, center, center + step],
    [1.08, 1, 1.08],
    { clamp: true },
  );

  return (
    <motion.div className="absolute inset-0 will-change-[opacity,transform]" style={{ opacity }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

/** Per-season progress bar segment that fills only within that season's slice. */
function SegmentFill({
  index,
  count,
  progress,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const step = 1 / count;
  const scaleX = useTransform(
    progress,
    [index * step, (index + 1) * step],
    [0, 1],
    { clamp: true },
  );
  return <motion.div className="h-full origin-left bg-sand" style={{ scaleX }} />;
}

/** Mobile / reduced-motion fallback: simple stacked season cards. */
function SeasonalStatic({
  seasons,
  services,
  dict,
}: {
  seasons: string[];
  services: ServiceCard[];
  dict: ReturnType<typeof useT>["dict"];
}) {
  return (
    <section data-header-tone="dark" className="relative overflow-hidden bg-soil py-24 text-ivory md:py-32" aria-labelledby="seasonal-title">
      <Container>
        <div className="border-b border-ivory/12 pb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-sand">{dict.frequencies.monthly.label}</p>
          <h2 id="seasonal-title" className="mt-5 max-w-3xl text-balance font-display text-[clamp(3.1rem,5.5vw,6rem)] leading-[0.9]">
            {dict.frequencies.monthly.note}
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {seasons.map((season, index) => (
            <motion.article
              key={season}
              className="relative flex flex-col min-h-[24rem] overflow-hidden rounded-[1.75rem] border border-ivory/10 bg-soil shadow-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.75, delay: (index % 2) * 0.08, ease }}
            >
              <div className="relative h-[16rem] w-full shrink-0">
                <Image src={images[index]} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-end p-8 bg-oak/10">
                <p className="font-display text-[clamp(3rem,12vw,4.5rem)] italic leading-none drop-shadow-md">{season}</p>
                <div className="mt-5 flex items-center gap-4 border-t border-ivory/16 pt-4 text-[9px] font-semibold uppercase tracking-[0.23em] text-ivory/65 drop-shadow-sm">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="h-px w-7 bg-sand/45" />
                  <span>{services[index % services.length]?.name}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
