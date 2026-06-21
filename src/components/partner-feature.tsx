import Image from "next/image";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

const atlanticUrl = "https://atlantic.quebec/";

export function PartnerFeature() {
  return (
    <section
      id="partners"
      data-header-tone="dark"
      className="texture-soil relative overflow-hidden py-16 text-ivory md:py-24"
      aria-labelledby="partner-title"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 font-display text-[24rem] leading-none text-ivory/[0.025]">
        A
      </div>

      <Container>
        <Reveal className="relative grid overflow-hidden rounded-[2.25rem] border border-ivory/10 bg-ivory/[0.035] shadow-[0_35px_100px_-55px_rgba(0,0,0,.9)] md:rounded-[3.25rem] lg:grid-cols-[1.08fr_.92fr]">
          <div className="relative min-h-[22rem] overflow-hidden lg:min-h-[35rem]">
            <Image
              src="/images/atlantic-window-care-montreal.webp"
              alt="Professional purified-water window cleaning at a pale stone Montréal home"
              fill
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-soil/55 via-transparent to-soil/10" />
            <div className="pointer-events-none absolute inset-3 rounded-[1.55rem] border border-ivory/20 md:inset-4 md:rounded-[2.5rem]" />
            <div className="absolute bottom-7 left-7 flex items-center gap-3 rounded-full border border-ivory/15 bg-soil/55 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/80 backdrop-blur-md md:bottom-9 md:left-9">
              <span className="h-1.5 w-1.5 rounded-full bg-sand" />
              Montréal residential care
            </div>
          </div>

          <div className="flex flex-col justify-between p-8 md:p-12 lg:p-14">
            <div>
              <div className="flex items-center justify-between gap-6 border-b border-ivory/10 pb-7">
                <div className="flex items-center gap-4">
                  <Image
                    src="/partners/atlantic-logo.svg"
                    alt="Atlantic"
                    width={52}
                    height={52}
                    unoptimized
                    className="h-11 w-11 invert md:h-12 md:w-12"
                  />
                  <div>
                    <p className="text-lg font-semibold tracking-[0.16em] text-ivory">ATLANTIC</p>
                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-sand/70">Window & gutter cleaning</p>
                  </div>
                </div>
                <span className="hidden text-[9px] font-semibold uppercase tracking-[0.26em] text-ivory/35 sm:block">Partner 01</span>
              </div>

              <p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.3em] text-sand">A specialist finish</p>
              <h2 id="partner-title" className="mt-4 text-balance font-display text-[clamp(2.75rem,4.6vw,4.9rem)] leading-[0.92]">
                Clarity,
                <span className="block italic text-sand">to the last detail.</span>
              </h2>
              <p className="mt-6 max-w-xl text-sm font-medium leading-relaxed text-ivory/60 md:text-base">
                For the glass, frames, and sills that complete an exterior, Atlantic brings purified-water window care to Montréal homes—chemical-free, streak-free, and performed from ground level with a water-fed pole system.
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-3 divide-x divide-ivory/10 border-y border-ivory/10 py-5 text-center">
                <PartnerDetail title="Pure water" detail="Zero residue" />
                <PartnerDetail title="Frames & sills" detail="Included" />
                <PartnerDetail title="30 ft reach" detail="Ground level" />
              </div>
              <a
                href={atlanticUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex items-center gap-3 text-sm font-semibold text-ivory transition-colors hover:text-sand"
              >
                Discover Atlantic
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 transition-all duration-300 group-hover:-rotate-45 group-hover:border-sand/40">↗</span>
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function PartnerDetail({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="px-2 md:px-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ivory/80">{title}</p>
      <p className="mt-1 text-[10px] font-medium text-ivory/40">{detail}</p>
    </div>
  );
}
