import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Container, Eyebrow, Monogram } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";
import { site } from "@/lib/config";

export function generateMetadata(): Metadata {
  const t = getDict().quoteThankYou;
  return { title: t.metaTitle, description: t.metaDescription };
}

export default function QuoteThankYouPage({
  searchParams,
}: {
  searchParams: { delivery?: string };
}) {
  const t = getDict().quoteThankYou;
  const emailConfirmed = searchParams.delivery === "sent";

  return (
    <main className="relative min-h-screen overflow-hidden bg-soil pb-24 pt-32 text-ivory md:pb-32 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,rgba(110,148,118,.28),transparent_34rem),radial-gradient(circle_at_90%_75%,rgba(31,73,52,.35),transparent_32rem)]" />
      <div className="hero-film-grain pointer-events-none absolute inset-0 opacity-[.1]" />
      <div className="pointer-events-none absolute inset-x-4 bottom-5 top-24 rounded-[2rem] border border-ivory/10 md:inset-x-6 md:bottom-7 md:top-28 md:rounded-[3rem]" />

      <Container className="relative">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-ochre/35 bg-ivory/[0.06] shadow-[0_24px_70px_-26px_rgba(110,148,118,.8)] backdrop-blur md:h-28 md:w-28">
              <div className="absolute inset-2 rounded-full border border-ivory/10" />
              <CheckMark />
            </div>
            <Eyebrow className="mt-8 text-ochre">{t.eyebrow}</Eyebrow>
            <h1 className="mt-5 text-balance font-display text-[clamp(4rem,8vw,7.5rem)] leading-[0.82] tracking-[-0.025em]">
              {t.titleA}
              <span className="mt-2 block italic text-sand">{t.titleB}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base font-medium leading-relaxed text-ivory/65 md:text-lg">
              {t.body}
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-ochre/20 bg-ochre/10 px-5 py-3 text-sm font-medium text-sand">
              <span className="h-2 w-2 rounded-full bg-ochre shadow-[0_0_0_5px_rgba(110,148,118,.12)]" />
              {emailConfirmed ? t.notificationSent : t.notificationSaved}
            </div>
          </div>

          <section className="mt-16 rounded-[2.25rem] border border-ivory/10 bg-ivory/[0.045] p-6 backdrop-blur-sm md:mt-20 md:rounded-[3rem] md:p-10" aria-labelledby="next-steps-title">
            <div className="flex items-center gap-4">
              <span className="font-display text-3xl text-ochre">01</span>
              <span className="h-px w-10 bg-ochre/45" />
              <p id="next-steps-title" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sand">
                {t.nextLabel}
              </p>
            </div>
            <div className="mt-8 grid gap-px overflow-hidden rounded-[1.5rem] border border-ivory/10 bg-ivory/10 md:grid-cols-3">
              <NextStep number="01" title={t.stepOneTitle} body={t.stepOneBody} />
              <NextStep number="02" title={t.stepTwoTitle} body={t.stepTwoBody} />
              <NextStep number="03" title={t.stepThreeTitle} body={t.stepThreeBody} />
            </div>
          </section>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/dashboard/quotes" variant="light" size="lg">
              {t.viewQuotes} <span aria-hidden="true">→</span>
            </ButtonLink>
            <ButtonLink href="/" variant="ghost" size="lg" className="text-ivory hover:bg-ivory/10 hover:text-ivory">
              {t.returnHome}
            </ButtonLink>
          </div>
          <p className="mt-9 text-center text-sm text-ivory/45">
            {t.support}{" "}
            <Link href={`mailto:${site.email}`} className="text-sand underline decoration-ivory/20 underline-offset-4 hover:text-ivory">
              {site.email}
            </Link>
          </p>

          <div className="mt-16 flex justify-center opacity-25">
            <Monogram size={44} />
          </div>
        </div>
      </Container>
    </main>
  );
}

function NextStep({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <article className="bg-soil/75 p-6 md:min-h-[13rem] md:p-8">
      <p className="text-[10px] font-semibold tracking-[0.26em] text-ochre">{number}</p>
      <h2 className="mt-8 font-display text-2xl leading-tight text-ivory md:text-3xl">{title}</h2>
      <p className="mt-3 text-sm font-medium leading-relaxed text-ivory/50">{body}</p>
    </article>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 48 48" className="relative h-11 w-11 text-sand" fill="none" aria-hidden="true">
      <path d="m11 25 8.2 8L38 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
