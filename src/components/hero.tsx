import Image from "next/image";
import { ButtonLink, Container } from "@/components/ui";

export function Hero() {
  return (
    <section
      className="relative -mt-[72px] min-h-[100svh] overflow-hidden bg-soil text-ivory"
      aria-labelledby="home-hero-title"
    >
      <Image
        src="/images/montreal-home-hero.png"
        alt="Pale stone Montreal home with a freshly restored interlocking driveway"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,9,.94)_0%,rgba(18,13,9,.78)_38%,rgba(18,13,9,.34)_68%,rgba(18,13,9,.2)_100%)] md:bg-[linear-gradient(90deg,rgba(18,13,9,.9)_0%,rgba(18,13,9,.64)_43%,rgba(18,13,9,.12)_78%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,13,9,.48)_0%,transparent_28%,transparent_68%,rgba(18,13,9,.68)_100%)]" />

      <Container className="relative flex min-h-[100svh] items-end pb-12 pt-36 md:items-center md:pb-20 md:pt-32">
        <div className="max-w-[58rem]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-sand md:text-[11px] md:tracking-[0.38em]">
            Luxury home care <span aria-hidden="true">·</span> Quietly delivered
          </p>
          <h1
            id="home-hero-title"
            className="mt-5 text-balance font-display text-[clamp(3.4rem,7.5vw,7.5rem)] font-normal leading-[0.86] tracking-[-0.025em] text-ivory"
          >
            Come home to
            <span className="mt-2 block italic text-sand">nothing left to do.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base font-medium leading-relaxed text-ivory/80 md:mt-8 md:text-lg">
            Not simply a cleaner driveway. A brighter arrival, restored curb appeal,
            and one less thing asking for your time.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/quote" variant="light" size="lg">
              Get an instant quote
              <Arrow />
            </ButtonLink>
            <ButtonLink
              href="/services"
              size="lg"
              className="border border-ivory/40 bg-soil/35 text-ivory backdrop-blur-sm hover:bg-ivory hover:text-soil"
            >
              View services
            </ButtonLink>
          </div>
        </div>
      </Container>

      <p className="absolute bottom-5 right-6 hidden text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/65 md:block">
        Exterior care · Greater Montréal
      </p>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
