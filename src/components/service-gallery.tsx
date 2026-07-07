"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  const [active, setActive] = useState(0);
  const [touch, setTouch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { dict } = useT();
  const t = dict.servicesSection;

  useEffect(() => {
    // Coarse pointer (phones/tablets) can't hover, so the accordion expands on
    // tap instead. matchMedia keeps it reactive if the pointer type changes.
    const query = window.matchMedia("(hover: none)");
    const update = () => setTouch(query.matches);
    update();
    query.addEventListener("change", update);
    
    const mQuery = window.matchMedia("(max-width: 639px)");
    const mUpdate = () => setIsMobile(mQuery.matches);
    mUpdate();
    mQuery.addEventListener("change", mUpdate);
    
    return () => {
      query.removeEventListener("change", update);
      mQuery.removeEventListener("change", mUpdate);
    };
  }, []);

  const details = [t.details.driveways, t.details.decks, t.details.houses, t.details.windows];
  const types = [t.types.pressure, t.types.pressure, t.types.soft, t.types.windows];

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  
  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 26,
    mass: 0.4,
  });

  useMotionValueEvent(smooth, "change", (v) => {
    if (isMobile) {
      const next = Math.min(
        services.length - 1,
        Math.max(0, Math.floor(v * services.length)),
      );
      setActive((prev) => (prev === next ? prev : next));
    }
  });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 md:py-32"
      aria-labelledby="services-title"
      style={isMobile ? { height: `${services.length * 75}vh` } : undefined}
    >
      <Container className="relative z-10">
        <motion.div
            className="grid gap-6 border-b border-oak/10 pb-8 lg:grid-cols-[.65fr_1.35fr] lg:items-end"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.75, ease }}
          >
            <div>
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl text-ochre">01</span>
                <span className="h-px w-12 bg-ochre/40" />
                <Eyebrow>{t.eyebrow}</Eyebrow>
              </div>
              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-soil/58">{t.intro}</p>
            </div>
            <h2 id="services-title" className="max-w-4xl text-balance font-display text-[clamp(2.9rem,5vw,5.5rem)] leading-[0.92] text-oak">
              {t.titleA} <span className="italic text-ochre">{t.titleB}</span>
            </h2>
          </motion.div>
      </Container>

      <div className={isMobile ? "sticky top-24 flex h-[calc(100vh-6rem)] flex-col overflow-hidden" : ""}>
        <Container className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            className="mt-6 mb-6 flex flex-1 min-h-0 w-full flex-col gap-2.5 sm:mb-0 sm:mt-10 sm:h-[38rem] sm:flex-none sm:flex-row sm:gap-3 lg:h-[46rem] lg:gap-3.5"
            onMouseLeave={touch && !isMobile ? undefined : () => {
              if (!isMobile) setActive(0);
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease }}
          >
            {services.map((service, index) => (
              <ExpandingCard
                key={service.id}
                service={service}
                index={index}
                detail={details[index]}
                type={types[index]}
                label={t.service}
                active={active === index}
                touch={touch}
                isMobile={isMobile}
                onActivate={() => {
                  if (!isMobile) setActive(index);
                }}
              />
            ))}
          </motion.div>
        </Container>
      </div>
    </section>
  );
}

function ExpandingCard({
  service,
  index,
  detail,
  type,
  label,
  active,
  touch,
  isMobile,
  onActivate,
}: {
  service: ServiceCard;
  index: number;
  detail: string;
  type: string;
  label: string;
  active: boolean;
  touch: boolean;
  isMobile: boolean;
  onActivate: () => void;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (touch && !isMobile && !active) {
      e.preventDefault();
      onActivate();
    }
  };

  const flexGrow = active ? 4.4 : 1;

  return (
    <Link
      href="#quote"
      onMouseEnter={touch || isMobile ? undefined : onActivate}
      onFocus={isMobile ? undefined : onActivate}
      onClick={handleClick}
      aria-label={`${service.name} — ${detail}`}
      className="group relative block h-full min-h-[4.25rem] sm:min-h-0 min-w-0 overflow-hidden rounded-[1.5rem] bg-soil text-ivory shadow-[0_30px_90px_-45px_rgba(28,28,26,.68)] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[flex-grow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon focus-visible:ring-offset-4 md:rounded-[2.25rem]"
      style={{ flexGrow, flexBasis: 0 }}
    >
      <Image
        src={serviceImages[index % serviceImages.length]}
        alt=""
        fill
        sizes={active ? "80vw" : "22vw"}
        className={`object-cover transition-transform duration-[1400ms] ease-out ${active ? "scale-[1.04]" : "scale-100 group-hover:scale-[1.03]"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-soil/94 via-soil/24 to-soil/10" />
      <div className={`absolute inset-0 bg-gradient-to-t from-soil/98 via-soil/85 to-soil/20 backdrop-blur-[2px] transition-all duration-700 ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
      <div className={`absolute inset-x-0 top-0 h-px bg-sand/30 transition-opacity duration-500 sm:inset-y-0 sm:left-0 sm:h-auto sm:w-px ${active ? "opacity-0" : "opacity-100"}`} />
      <div className="pointer-events-none absolute inset-2.5 rounded-[1.1rem] border border-ivory/14 md:inset-4 md:rounded-[1.7rem]" />

      <div
        className={`absolute inset-0 flex flex-row items-center justify-center gap-4 px-4 py-2 text-center transition-opacity duration-300 sm:inset-x-0 sm:bottom-0 sm:top-auto sm:flex-col sm:gap-5 sm:p-7 ${active ? "pointer-events-none opacity-0" : "opacity-100 delay-200"}`}
      >
        <span className="font-display text-xl italic leading-none text-sand sm:text-2xl shrink-0">{String(index + 1).padStart(2, "0")}</span>
        <span
          className="truncate text-balance font-display text-[1.25rem] leading-[1.1] tracking-[-0.01em] text-ivory sm:overflow-visible sm:whitespace-nowrap sm:text-[1.65rem] sm:leading-none sm:[writing-mode:vertical-rl] sm:[transform:rotate(180deg)]"
        >
          {service.name}
        </span>
      </div>

      <div
        className={`absolute inset-x-0 top-0 flex items-center justify-between p-5 text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/68 transition-opacity duration-500 sm:p-8 md:p-9 ${active ? "opacity-100 delay-150" : "opacity-0"}`}
      >
        <span className="whitespace-nowrap">{detail}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 p-5 transition-all duration-500 sm:p-8 md:p-10 ${active ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <div className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-sand/88 sm:gap-4">
          <span>{label}</span>
          <span className="h-px w-6 bg-sand/40 sm:w-8" />
          <span className="whitespace-nowrap">{type}</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-6 sm:mt-4 sm:gap-8">
          <div className="min-w-0">
            <h3 className="font-display text-[clamp(1.9rem,7vw,4.6rem)] leading-[0.94]">{service.name}</h3>
            <p className="mt-2.5 max-w-2xl text-sm font-medium leading-relaxed text-ivory/66 sm:mt-3 md:text-base">{service.description}</p>
          </div>
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ivory/25 text-xl transition-all duration-500 group-hover:-rotate-45 group-hover:bg-ivory group-hover:text-soil sm:flex" aria-hidden="true">↗</span>
        </div>
      </div>
    </Link>
  );
}
