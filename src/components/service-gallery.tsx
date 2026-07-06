"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useRef, useState } from "react";
import { Container, Eyebrow } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";
import type { ServiceCard } from "@/lib/data";

const serviceImages = [
  "/images/montreal-driveway-pressure-washing.webp",
  "/images/montreal-deck-pressure-washing.webp",
  "/images/montreal-home-hero.png",
  "/images/atlantic-window-care-montreal.webp",
];

const ease = [0.22, 1, 0.36, 1] as const;

export function ServiceGallery({ services }: { services: ServiceCard[] }) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { dict } = useT();
  const t = dict.servicesSection;
  const details = [t.details.driveways, t.details.decks, t.details.houses, t.details.windows];
  const types = [t.types.pressure, t.types.pressure, t.types.soft, t.types.windows];

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 24,
    mass: 0.42,
  });

  useMotionValueEvent(smoothProgress, "change", (value) => {
    if (!services.length) return;
    const next = Math.min(
      services.length - 1,
      Math.max(0, Math.floor(value * services.length)),
    );
    setActive((current) => (current === next ? current : next));
  });

  if (!services.length) return null;

  return (
    <section
      ref={section}
      id="services"
      className="relative scroll-mt-24 bg-ivory"
      style={{ height: `${services.length * 90 + 100}vh` }}
      aria-labelledby="services-title"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ivory">
        <Container className="relative z-10 flex h-full flex-col pb-5 pt-28 md:pb-8 md:pt-32">
          <motion.div
            className="grid shrink-0 gap-3 border-b border-oak/10 pb-5 md:gap-5 md:pb-7 lg:grid-cols-[.65fr_1.35fr] lg:items-end"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease }}
          >
            <div>
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl text-ochre">01</span>
                <span className="h-px w-12 bg-ochre/40" />
                <Eyebrow>{t.eyebrow}</Eyebrow>
              </div>
              <p className="mt-3 line-clamp-2 max-w-md text-xs font-medium leading-relaxed text-soil/58 md:mt-4 md:line-clamp-none md:text-sm">
                {t.intro}
              </p>
            </div>
            <h2
              id="services-title"
              className="max-w-4xl text-balance font-display text-[2.35rem] leading-[0.92] text-oak md:text-[clamp(3.25rem,5vw,5.5rem)]"
            >
              {t.titleA} <span className="italic text-ochre">{t.titleB}</span>
            </h2>
          </motion.div>

          <motion.div
            className="mt-5 flex min-h-0 flex-1 flex-col gap-2 lg:mt-8 lg:flex-row lg:gap-3.5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease }}
          >
            {services.map((service, index) => (
              <ScrollAccordionCard
                key={service.id}
                service={service}
                index={index}
                detail={details[index]}
                type={types[index]}
                label={t.service}
                active={active === index}
              />
            ))}
          </motion.div>

          <div className="flex shrink-0 items-end justify-between gap-6 pt-3 md:pt-5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.27em] text-soil/48">
                {t.scrollHint}
              </p>
              <p className="mt-1 hidden text-xs font-medium text-soil/55 sm:block" aria-live="polite">
                {services[active]?.name}
              </p>
            </div>
            <div className="flex w-full max-w-[15rem] items-center gap-2" aria-hidden="true">
              {services.map((service, index) => (
                <div key={service.id} className="h-px flex-1 overflow-hidden bg-oak/12">
                  <motion.div
                    className="h-full origin-left bg-cinnamon"
                    animate={{ scaleX: index <= active ? 1 : 0 }}
                    transition={{ duration: 0.55, ease }}
                  />
                </div>
              ))}
              <span className="ml-1 font-display text-sm text-cinnamon">
                {String(active + 1).padStart(2, "0")}/{String(services.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

function ScrollAccordionCard({
  service,
  index,
  detail,
  type,
  label,
  active,
}: {
  service: ServiceCard;
  index: number;
  detail: string;
  type: string;
  label: string;
  active: boolean;
}) {
  const flexGrow = active ? 5.4 : 1;

  return (
    <Link
      href="#quote"
      data-service-card
      data-active-service={active ? "true" : "false"}
      aria-label={`${service.name} — ${detail}`}
      className="group relative block min-h-0 min-w-0 overflow-hidden rounded-[1.35rem] bg-soil text-ivory shadow-[0_26px_75px_-42px_rgba(28,28,26,.74)] transition-[flex-grow] duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[flex-grow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon focus-visible:ring-offset-4 md:rounded-[2.25rem]"
      style={{ flexGrow, flexBasis: 0 }}
    >
      <Image
        src={serviceImages[index % serviceImages.length]}
        alt=""
        fill
        sizes={active ? "(min-width: 1024px) 68vw, 100vw" : "(min-width: 1024px) 14vw, 100vw"}
        className={`object-cover transition-transform duration-[1500ms] ease-out ${active ? "scale-[1.045]" : "scale-100"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-soil/94 via-soil/26 to-soil/10" />
      <div className={`absolute inset-0 bg-gradient-to-t from-soil/98 via-soil/82 to-soil/18 backdrop-blur-[2px] transition-opacity duration-700 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <div className={`absolute inset-x-0 top-0 h-px bg-sand/30 transition-opacity duration-500 lg:inset-y-0 lg:left-0 lg:h-auto lg:w-px ${active ? "opacity-0" : "opacity-100"}`} />
      <div className="pointer-events-none absolute inset-2 rounded-[.95rem] border border-ivory/14 md:inset-4 md:rounded-[1.7rem]" />

      <div
        className={`absolute inset-0 flex items-center justify-between gap-4 px-5 text-center transition-opacity duration-300 lg:inset-x-0 lg:bottom-0 lg:top-auto lg:flex-col lg:justify-center lg:gap-5 lg:p-7 ${active ? "pointer-events-none opacity-0" : "opacity-100 delay-200"}`}
      >
        <span className="font-display text-lg italic leading-none text-sand lg:text-2xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-balance font-display text-[1.05rem] leading-none text-ivory lg:whitespace-nowrap lg:text-[1.65rem] lg:[writing-mode:vertical-rl] lg:[transform:rotate(180deg)]">
          {service.name}
        </span>
      </div>

      <div
        className={`absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[8px] font-semibold uppercase tracking-[0.21em] text-ivory/68 transition-opacity duration-500 md:p-6 lg:p-9 lg:text-[9px] lg:tracking-[0.24em] ${active ? "opacity-100 delay-150" : "opacity-0"}`}
      >
        <span className="whitespace-nowrap">{detail}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-500 md:p-6 lg:p-10 ${active ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <div className="flex items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.21em] text-sand/88 lg:text-[9px] lg:tracking-[0.26em]">
          <span>{label}</span>
          <span className="h-px w-6 bg-sand/40 lg:w-8" />
          <span className="whitespace-nowrap">{type}</span>
        </div>
        <div className="mt-2.5 flex items-end justify-between gap-6 lg:mt-4 lg:gap-8">
          <div className="min-w-0">
            <h3 className="font-display text-[clamp(1.65rem,7vw,4.6rem)] leading-[0.94]">
              {service.name}
            </h3>
            <p className="mt-2 line-clamp-3 max-w-2xl text-[11px] font-medium leading-relaxed text-ivory/68 sm:text-sm lg:mt-3 lg:line-clamp-none lg:text-base">
              {service.description}
            </p>
          </div>
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ivory/25 text-xl lg:flex" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>
    </Link>
  );
}
