import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";
import { site } from "@/lib/config";

export function generateMetadata(): Metadata {
  const t = getDict().hiring.page;
  return { title: t.metaTitle, description: t.metaDescription };
}

export default function HiringPage() {
  const t = getDict().hiring.page;
  const technicianMail = applicationHref("Exterior Care Technician");
  const salesMail = applicationHref("Sales Representative");

  return (
    <main className="overflow-hidden bg-ivory">
      <section data-header-tone="dark" className="texture-soil relative flex min-h-[78svh] items-center pb-24 pt-32 text-ivory md:pb-32 md:pt-40">
        <div className="pointer-events-none absolute -right-20 top-20 font-display text-[18rem] leading-none text-ivory/[0.025] md:text-[30rem]">H</div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(110,148,118,.2),transparent_34rem)]" />
        <Container className="relative">
          <div className="max-w-5xl">
            <Eyebrow className="text-ochre">{t.eyebrow}</Eyebrow>
            <h1 className="mt-7 max-w-5xl text-balance font-display text-[clamp(4.2rem,9vw,9rem)] leading-[0.8] tracking-[-0.03em]">
              {t.titleA}
              <span className="block italic text-sand">{t.titleB}</span>
            </h1>
            <p className="mt-9 max-w-2xl text-base font-medium leading-relaxed text-ivory/62 md:text-xl">
              {t.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <RoleJump href="#technicians">{t.techniciansTitle}</RoleJump>
              <RoleJump href="#sales-representatives">{t.repsTitle}</RoleJump>
            </div>
          </div>
        </Container>
      </section>

      <section className="proof-wash py-24 md:py-32" aria-labelledby="hiring-principles">
        <Container>
          <p id="hiring-principles" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cinnamon">{t.principlesLabel}</p>
          <div className="mt-9 grid gap-px overflow-hidden rounded-[2rem] border border-oak/10 bg-oak/10 md:grid-cols-3 md:rounded-[2.75rem]">
            <Principle number="01" title={t.principleOneTitle} body={t.principleOneBody} />
            <Principle number="02" title={t.principleTwoTitle} body={t.principleTwoBody} />
            <Principle number="03" title={t.principleThreeTitle} body={t.principleThreeBody} />
          </div>
        </Container>
      </section>

      <section id="technicians" className="scroll-mt-20 bg-ivory py-24 md:py-36" aria-labelledby="technicians-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>{t.techniciansEyebrow}</Eyebrow>
              <h2 id="technicians-title" className="mt-6 text-balance font-display text-[clamp(3.5rem,6.5vw,6.5rem)] leading-[0.86] text-oak">
                {t.techniciansTitle}
              </h2>
              <p className="mt-7 max-w-lg text-base font-medium leading-relaxed text-soil/60 md:text-lg">{t.techniciansIntro}</p>
            </div>
            <div className="rounded-[2.25rem] bg-soil p-7 text-ivory shadow-lift md:rounded-[3rem] md:p-12">
              <RolePoint number="01" text={t.techniciansPointOne} />
              <RolePoint number="02" text={t.techniciansPointTwo} />
              <RolePoint number="03" text={t.techniciansPointThree} />
              <div className="mt-10 rounded-[1.5rem] border border-ivory/10 bg-ivory/[0.045] p-6 md:p-8">
                <h3 className="font-display text-2xl text-sand md:text-3xl">{t.techniciansFitTitle}</h3>
                <p className="mt-4 text-sm font-medium leading-relaxed text-ivory/55 md:text-base">{t.techniciansFitBody}</p>
              </div>
              <ApplicationLink href={technicianMail}>{t.techniciansCta}</ApplicationLink>
              <p className="mt-4 text-xs text-ivory/40">{t.emailNote}</p>
            </div>
          </div>
        </Container>
      </section>

      <section id="sales-representatives" data-header-tone="dark" className="texture-soil relative scroll-mt-20 py-24 text-ivory md:py-36" aria-labelledby="reps-title">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(110,148,118,.18),transparent_32rem)]" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <Eyebrow className="text-ochre">{t.repsEyebrow}</Eyebrow>
              <h2 id="reps-title" className="mt-6 text-balance font-display text-[clamp(3.5rem,6.5vw,6.5rem)] leading-[0.86] text-ivory">
                {t.repsTitle}
              </h2>
              <p className="mt-7 max-w-lg text-base font-medium leading-relaxed text-ivory/60 md:text-lg">{t.repsIntro}</p>
            </div>
            <div>
              <div className="rounded-[2.25rem] border border-ochre/25 bg-ochre/10 p-7 md:rounded-[3rem] md:p-11">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ochre">{t.partnershipLabel}</p>
                <h3 className="mt-6 font-display text-3xl leading-tight text-sand md:text-5xl">{t.partnershipTitle}</h3>
                <p className="mt-6 text-base font-medium leading-relaxed text-ivory/65">{t.partnershipBody}</p>
              </div>
              <div className="mt-6 rounded-[2.25rem] border border-ivory/10 bg-ivory/[0.04] p-7 md:rounded-[3rem] md:p-11">
                <RolePoint number="01" text={t.repsPointOne} />
                <RolePoint number="02" text={t.repsPointTwo} />
                <RolePoint number="03" text={t.repsPointThree} />
                <ApplicationLink href={salesMail}>{t.repsCta}</ApplicationLink>
                <p className="mt-4 text-xs text-ivory/40">{t.emailNote}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function applicationHref(role: string) {
  const subject = encodeURIComponent(`Beaumont application — ${role}`);
  return `mailto:${site.email}?subject=${subject}`;
}

function RoleJump({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex h-12 items-center gap-2 rounded-full border border-ivory/15 bg-ivory/[0.06] px-6 text-sm font-semibold text-ivory transition-colors hover:bg-ivory hover:text-soil">{children} <span aria-hidden="true">↓</span></Link>;
}

function Principle({ number, title, body }: { number: string; title: string; body: string }) {
  return <article className="bg-ivory/90 p-7 md:min-h-[17rem] md:p-10"><p className="font-display text-3xl text-ochre">{number}</p><h2 className="mt-10 font-display text-3xl leading-tight text-oak">{title}</h2><p className="mt-4 text-sm font-medium leading-relaxed text-soil/55">{body}</p></article>;
}

function RolePoint({ number, text }: { number: string; text: string }) {
  return <div className="flex gap-5 border-b border-ivory/10 py-6 first:pt-0"><span className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-ochre">{number}</span><p className="font-display text-xl leading-snug text-ivory md:text-2xl">{text}</p></div>;
}

function ApplicationLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="mt-9 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-ivory px-7 text-sm font-semibold tracking-wide text-soil shadow-soft transition-colors hover:bg-sand">{children} <span aria-hidden="true">↗</span></Link>;
}
