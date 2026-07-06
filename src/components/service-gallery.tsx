"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
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
  const [active, setActive] = useState(0);
  const { dict } = useT();
  const t = dict.servicesSection;

  const details = [t.details.driveways, t.details.decks, t.details.houses, t.details.windows];
  const types = [t.types.pressure, t.types.pressure, t.types.soft, t.types.windows];

  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 md:py-32"
      aria-labelledby="services-title"
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

      <Container className="relative z-10">
        <MobileServiceRail
          services={services}
          details={details}
          types={types}
          label={t.service}
          swipeHint={t.swipeHint}
        />

        <motion.div
          className="mt-10 hidden h-[46rem] gap-3.5 lg:flex"
          onMouseLeave={() => setActive(0)}
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
              onActivate={() => setActive(index)}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function MobileServiceRail({
  services,
  details,
  types,
  label,
  swipeHint,
}: {
  services: ServiceCard[];
  details: string[];
  types: string[];
  label: string;
  swipeHint: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollXProgress } = useScroll({ container: rail });
  const progress = useSpring(scrollXProgress, {
    stiffness: 110,
    damping: 25,
    mass: 0.35,
  });

  const updateActive = () => {
    if (!rail.current) return;
    const center = rail.current.scrollLeft + rail.current.clientWidth / 2;
    let next = 0;
    let nearest = Number.POSITIVE_INFINITY;
    rail.current.querySelectorAll<HTMLElement>("[data-service-card]").forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (distance < nearest) {
        nearest = distance;
        next = index;
      }
    });
    setActive((current) => (current === next ? current : next));
  };

  const goTo = (index: number) => {
    const card = rail.current?.querySelectorAll<HTMLElement>("[data-service-card]")[index];
    if (!rail.current || !card) return;
    rail.current.scrollTo({
      left: card.offsetLeft - (rail.current.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-10 lg:hidden">
      <div
        ref={rail}
        onScroll={updateActive}
        className="mobile-service-rail -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4"
        aria-label={swipeHint}
      >
        {services.map((service, index) => (
          <motion.article
            data-service-card
            key={service.id}
            className="w-[calc(100vw-3.5rem)] max-w-[34rem] shrink-0 snap-center"
            initial={{ opacity: 0.35, y: 18, scale: 0.975 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ root: rail, amount: 0.6 }}
            transition={{ duration: 0.72, ease }}
          >
            <Link
              href="#quote"
              aria-label={`${service.name} — ${details[index]}`}
              className="group relative block h-[34rem] overflow-hidden rounded-[2rem] bg-soil text-ivory shadow-[0_28px_75px_-38px_rgba(28,28,26,.88)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon focus-visible:ring-offset-4"
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.075 }}
                whileInView={{ scale: 1 }}
                viewport={{ root: rail, amount: 0.6 }}
                transition={{ duration: 1.35, ease }}
              >
                <Image
                  src={serviceImages[index % serviceImages.length]}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 88vw, 34rem"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-soil via-soil/54 to-soil/10" />
              <div className="absolute inset-3 rounded-[1.45rem] border border-ivory/16" />

              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-7 text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/72">
                <span>{details[index]}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-7 pb-8">
                <div className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-sand/90">
                  <span>{label}</span>
                  <span className="h-px w-7 bg-sand/45" />
                  <span>{types[index]}</span>
                </div>
                <h3 className="mt-4 max-w-[18rem] font-display text-[2.65rem] leading-[0.93] text-ivory">
                  {service.name}
                </h3>
                <p className="mt-4 line-clamp-4 text-sm font-medium leading-relaxed text-ivory/72">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-sand">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/24 text-base transition-transform duration-500 group-hover:-rotate-45">↗</span>
                  <span>{String(index + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
        <span aria-hidden="true" className="w-3 shrink-0" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-6">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.27em] text-soil/48">{swipeHint}</p>
          <div className="mt-3 h-px w-28 overflow-hidden bg-oak/12">
            <motion.div className="h-full origin-left bg-cinnamon" style={{ scaleX: progress }} />
          </div>
        </div>
        <div className="flex items-center gap-2" aria-label={swipeHint}>
          {services.map((service, index) => (
            <button
              key={service.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={service.name}
              aria-current={active === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-500 ${
                active === index ? "w-7 bg-cinnamon" : "w-2 bg-oak/18 hover:bg-oak/35"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Desktop accordion card: grows on hover or keyboard focus while its
 * neighbours compress. */
function ExpandingCard({
  service,
  index,
  detail,
  type,
  label,
  active,
  onActivate,
}: {
  service: ServiceCard;
  index: number;
  detail: string;
  type: string;
  label: string;
  active: boolean;
  onActivate: () => void;
}) {
  const flexGrow = active ? 4.4 : 1;

  return (
    <Link
      href="#quote"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-label={`${service.name} — ${detail}`}
      className="group relative block h-full min-w-0 overflow-hidden rounded-[1.5rem] bg-soil text-ivory shadow-[0_30px_90px_-45px_rgba(28,28,26,.68)] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[flex-grow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon focus-visible:ring-offset-4 md:rounded-[2.25rem]"
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
      {/* Seam accent visible when collapsed */}
      <div className={`absolute inset-x-0 top-0 h-px bg-sand/30 transition-opacity duration-500 sm:inset-y-0 sm:left-0 sm:h-auto sm:w-px ${active ? "opacity-0" : "opacity-100"}`} />
      <div className="pointer-events-none absolute inset-2.5 rounded-[1.1rem] border border-ivory/14 md:inset-4 md:rounded-[1.7rem]" />

      {/* Collapsed spine label — vertical text on desktop, horizontal on mobile */}
      <div
        className={`absolute inset-0 flex flex-row items-center justify-center gap-4 p-4 text-center transition-opacity duration-300 sm:inset-x-0 sm:bottom-0 sm:top-auto sm:flex-col sm:gap-5 sm:p-7 ${active ? "pointer-events-none opacity-0" : "opacity-100 delay-200"}`}
      >
        <span className="font-display text-xl italic leading-none text-sand sm:text-2xl">{String(index + 1).padStart(2, "0")}</span>
        <span
          className="whitespace-normal text-balance font-display text-[1.25rem] leading-[1.1] tracking-[-0.01em] text-ivory sm:whitespace-nowrap sm:text-[1.65rem] sm:leading-none sm:[writing-mode:vertical-rl] sm:[transform:rotate(180deg)]"
        >
          {service.name}
        </span>
      </div>

      {/* Expanded content — revealed as the card grows */}
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
