"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { saveQuote, type SaveQuotePayload } from "@/app/(site)/quote/actions";
import { useT } from "@/components/i18n/locale-provider";
import { ButtonLink, Container, Eyebrow, Monogram } from "@/components/ui";
import { site } from "@/lib/config";

interface StoredQuoteRequest extends SaveQuotePayload {
  expiresAt: number;
}

type Delivery = "sent" | "saved" | null;
type Phase = "ready" | "saving" | "error";

const pendingQuoteKey = "beaumont:pending-quote";
const dashboardPath = "/dashboard/quotes";
const resumePath = "/quote/thankyou?completeQuote=1";

export function QuoteThankYouLetter({
  signedIn,
  autoProceed,
  completePendingQuote,
  initialDelivery,
}: {
  signedIn: boolean;
  autoProceed: boolean;
  completePendingQuote: boolean;
  initialDelivery: Delivery;
}) {
  const { dict } = useT();
  const t = dict.quoteThankYou;
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(completePendingQuote ? "saving" : "ready");
  const [delivery, setDelivery] = useState<Delivery>(initialDelivery);
  const [seconds, setSeconds] = useState(reduceMotion ? 2 : 4);
  const [error, setError] = useState("");

  const signupPath = useMemo(
    () => `/login?mode=signup&quote=ready&next=${encodeURIComponent(resumePath)}`,
    [],
  );
  const destination = signedIn ? dashboardPath : signupPath;

  const finishPendingQuote = useCallback(async () => {
    if (!completePendingQuote) return;
    if (!signedIn) {
      window.location.replace(signupPath);
      return;
    }

    const raw = window.localStorage.getItem(pendingQuoteKey);
    if (!raw) {
      setError(t.resumeMissing);
      setPhase("error");
      return;
    }

    try {
      const stored = JSON.parse(raw) as StoredQuoteRequest;
      if (!stored.expiresAt || stored.expiresAt < Date.now()) {
        window.localStorage.removeItem(pendingQuoteKey);
        setError(t.resumeExpired);
        setPhase("error");
        return;
      }
      const response = await saveQuote({
        requestId: stored.requestId,
        serviceId: stored.serviceId,
        selectedServiceIds: stored.selectedServiceIds,
        address: stored.address,
        areaM2: 0,
        frequency: stored.frequency,
        addOnIds: stored.addOnIds,
        propertySize: stored.propertySize,
        condition: stored.condition,
        conditions: stored.conditions,
        scopeDetails: stored.scopeDetails,
        sourceZone: stored.sourceZone,
        fullName: stored.fullName,
        email: stored.email,
        phone: stored.phone,
      });
      if (!response.ok) {
        if (response.needsAuth) {
          window.location.replace(signupPath);
          return;
        }
        throw new Error(response.error || t.resumeError);
      }
      window.localStorage.removeItem(pendingQuoteKey);
      setDelivery(response.notificationStatus === "sent" ? "sent" : "saved");
      setPhase("ready");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.resumeError);
      setPhase("error");
    }
  }, [completePendingQuote, signedIn, signupPath, t]);

  useEffect(() => {
    void finishPendingQuote();
  }, [finishPendingQuote]);

  useEffect(() => {
    if (!autoProceed || phase !== "ready") return;
    const delay = reduceMotion ? 1800 : 4200;
    const started = Date.now();
    const ticker = window.setInterval(() => {
      setSeconds(Math.max(1, Math.ceil((delay - (Date.now() - started)) / 1000)));
    }, 250);
    const timer = window.setTimeout(() => window.location.assign(destination), delay);
    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(timer);
    };
  }, [autoProceed, destination, phase, reduceMotion]);

  const status = phase === "saving"
    ? t.preparingStatus
    : signedIn
      ? t.clientRedirectStatus
      : t.signupRedirectStatus;

  return (
    <main className="relative min-h-screen overflow-hidden bg-soil pb-24 pt-32 text-ivory md:pb-32 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,rgba(110,148,118,.28),transparent_34rem),radial-gradient(circle_at_90%_75%,rgba(31,73,52,.35),transparent_32rem)]" />
      <div className="hero-film-grain pointer-events-none absolute inset-0 opacity-[.1]" />
      <Container className="relative">
        <motion.article
          initial={reduceMotion ? false : { opacity: 0, y: 34, rotateX: 3 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-oak/10 bg-ivory px-6 py-12 text-soil shadow-[0_45px_120px_-45px_rgba(0,0,0,.9)] md:rounded-[3rem] md:px-14 md:py-16"
        >
          <div className="pointer-events-none absolute inset-3 rounded-[1.4rem] border border-oak/[0.07] md:inset-5 md:rounded-[2.2rem]" />
          <div className="pointer-events-none absolute -right-12 -top-24 font-display text-[20rem] leading-none text-oak/[0.025]">B</div>
          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <motion.div
              initial={reduceMotion ? false : { scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-24 w-24 items-center justify-center rounded-full border border-cinnamon/20 bg-sand/35"
            >
              <div className="absolute inset-2 rounded-full border border-oak/10" />
              {phase === "saving" ? <Spinner /> : <CheckMark animate={!reduceMotion} />}
            </motion.div>
            <Eyebrow className="mt-8 text-cinnamon">{t.eyebrow}</Eyebrow>
            <h1 className="mt-5 text-balance font-display text-[clamp(3.6rem,7.4vw,7.2rem)] leading-[0.82] tracking-[-0.025em] text-oak">
              {t.titleA}
              <span className="mt-2 block italic text-cinnamon">{t.titleB}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base font-medium leading-relaxed text-soil/60 md:text-lg">{t.body}</p>
            {phase === "error" ? (
              <div className="mt-7 max-w-xl rounded-2xl border border-red-900/15 bg-red-50 px-5 py-4 text-sm font-medium text-red-900">
                {error}
              </div>
            ) : (
              <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-cinnamon/15 bg-cinnamon/[0.06] px-5 py-3 text-sm font-medium text-cinnamon">
                <span className="h-2 w-2 rounded-full bg-ochre shadow-[0_0_0_5px_rgba(110,148,118,.13)]" />
                {delivery === "sent" ? t.notificationSent : delivery === "saved" ? t.notificationSaved : status}
              </div>
            )}
          </div>

          <section className="relative mx-auto mt-14 max-w-4xl border-t border-oak/10 pt-9" aria-labelledby="next-steps-title">
            <p id="next-steps-title" className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-cinnamon">{t.nextLabel}</p>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <NextStep number="01" title={t.stepOneTitle} body={t.stepOneBody} />
              <NextStep number="02" title={t.stepTwoTitle} body={t.stepTwoBody} />
              <NextStep number="03" title={t.stepThreeTitle} body={t.stepThreeBody} />
            </div>
          </section>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {phase === "error" ? (
              <ButtonLink href="/quote" size="lg">{t.returnToQuote}</ButtonLink>
            ) : (
              <ButtonLink href={destination} size="lg" className={phase === "saving" ? "pointer-events-none opacity-50" : ""}>
                {signedIn ? t.continueToPanel : t.continueToSignup} <span aria-hidden="true">→</span>
              </ButtonLink>
            )}
            <ButtonLink href="/" variant="ghost" size="lg">{t.returnHome}</ButtonLink>
          </div>
          {autoProceed && phase === "ready" && (
            <p className="relative mt-5 text-center text-xs font-medium text-soil/40">{t.redirectCountdown.replace("{seconds}", String(seconds))}</p>
          )}
          <p className="relative mt-8 text-center text-sm text-soil/45">
            {t.support}{" "}<Link href={`mailto:${site.email}`} className="text-cinnamon underline decoration-cinnamon/20 underline-offset-4">{site.email}</Link>
          </p>
          <div className="relative mt-12 flex justify-center opacity-20"><Monogram size={42} dark /></div>
        </motion.article>
      </Container>
    </main>
  );
}

function NextStep({ number, title, body }: { number: string; title: string; body: string }) {
  return <article className="rounded-[1.35rem] border border-oak/10 bg-sand/20 p-5 md:min-h-[11rem] md:p-6"><p className="text-[10px] font-semibold tracking-[0.24em] text-ochre">{number}</p><h2 className="mt-6 font-display text-2xl leading-tight text-oak">{title}</h2><p className="mt-3 text-sm font-medium leading-relaxed text-soil/50">{body}</p></article>;
}

function CheckMark({ animate }: { animate: boolean }) {
  return <svg viewBox="0 0 48 48" className="relative h-11 w-11 text-cinnamon" fill="none" aria-hidden="true"><motion.path d="m11 25 8.2 8L38 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" initial={animate ? { pathLength: 0, opacity: 0 } : false} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 0.55, duration: 0.75, ease: "easeOut" }} /></svg>;
}

function Spinner() {
  return <span className="h-9 w-9 animate-spin rounded-full border-2 border-cinnamon/20 border-t-cinnamon" aria-label="Loading" />;
}
