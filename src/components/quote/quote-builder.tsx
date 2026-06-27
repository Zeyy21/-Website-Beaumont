"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { addOns, frequencies, type FrequencyId } from "@/lib/config";
import type { ServiceCard } from "@/lib/data";
import { Button, Monogram } from "@/components/ui";
import { AddressSearch } from "./address-search";
import { saveQuote, type SaveQuotePayload } from "@/app/(site)/quote/actions";

interface Place {
  label: string;
  lat: number;
  lon: number;
}

interface StoredQuoteRequest extends SaveQuotePayload {
  place: Place;
  expiresAt: number;
}

const pendingQuoteKey = "beaumont:pending-quote";
const quoteContactKey = "beaumont:quote-contact";
const quoteReturnPath = "/quote?completeQuote=1";

const steps = [
  { label: "Property", shortLabel: "Home" },
  { label: "Services", shortLabel: "Care" },
  { label: "Details", shortLabel: "Details" },
  { label: "Contact", shortLabel: "You" },
] as const;

const sceneCopy = [
  {
    eyebrow: "A simple beginning",
    title: "Your address tells us more than a measurement ever could.",
    copy: "It lets our team review the property, access, and route before we prepare anything.",
  },
  {
    eyebrow: "Built around your home",
    title: "Choose what you notice. We’ll connect the dots.",
    copy: "Select one service or create a complete exterior refresh. Nothing is booked today.",
  },
  {
    eyebrow: "No tape measure needed",
    title: "A quick impression is more than enough.",
    copy: "Best guesses are welcome. A Beaumont specialist verifies every detail before quoting.",
  },
  {
    eyebrow: "The human touch",
    title: "A real person reviews every request.",
    copy: "You’ll receive a clear written quote—usually within 24 hours, with no payment or pressure.",
  },
] as const;

const quoteAudio = [
  "/audio/quote/step-1-property.mp3",
  "/audio/quote/step-2-services.mp3",
  "/audio/quote/step-3-details.mp3",
  "/audio/quote/step-4-contact.mp3",
] as const;

const quoteSignatureAudio = "/audio/quote/beaumont-signature.mp3";

const propertySizes = [
  { id: "entry", label: "A small area", note: "Entry, steps, or front walk", icon: "entry" },
  { id: "single", label: "One main surface", note: "Driveway, deck, patio, or facade", icon: "single" },
  { id: "multi", label: "A few areas", note: "Two or more exterior surfaces", icon: "multi" },
  { id: "full", label: "The full exterior", note: "A whole-property refresh", icon: "full" },
] as const;

const conditionOptions = [
  { id: "refresh", label: "A seasonal refresh", note: "Light, everyday buildup" },
  { id: "organic", label: "Algae or grime", note: "Green, black, or slippery areas" },
  { id: "stains", label: "Stubborn stains", note: "Oil, rust, or marked spots" },
  { id: "delicate", label: "A delicate surface", note: "Older, painted, wood, or soft-wash only" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function QuoteBuilder({
  services,
  initialZone,
}: {
  services: ServiceCard[];
  initialZone?: string | null;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [place, setPlace] = useState<Place | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [propertySize, setPropertySize] =
    useState<(typeof propertySizes)[number]["id"]>("single");
  const [conditions, setConditions] =
    useState<(typeof conditionOptions)[number]["id"][]>(["refresh"]);
  const [frequency, setFrequency] = useState<FrequencyId>("one_time");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [scopeDetails, setScopeDetails] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<null | {
    ok: boolean;
    title: string;
    message?: string;
    needsAccount?: boolean;
  }>(null);
  const [pending, startTransition] = useTransition();
  const resumedRequest = useRef(false);
  const requestId = useRef("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMounted = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioTimerRef = useRef<number | null>(null);
  const audioPhaseRef = useRef<"signature" | "narration" | null>("signature");
  const audioGuideEnabledRef = useRef(true);
  const hasPlayedSignature = useRef(false);
  const currentStepRef = useRef(step);
  const [audioGuideEnabled, setAudioGuideEnabled] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const selectedServices = useMemo(
    () => services.filter((item) => selectedServiceIds.includes(item.id)),
    [services, selectedServiceIds],
  );
  const primaryService = selectedServices[0] ?? services[0];
  const propertySizeLabel =
    propertySizes.find((item) => item.id === propertySize)?.label ?? "Not selected";
  const conditionLabel = conditions.length
    ? conditionOptions
        .filter((item) => conditions.includes(item.id))
        .map((item) => item.label)
        .join(", ")
    : "Not selected";
  const frequencyLabel =
    frequencies.find((item) => item.id === frequency)?.label ?? "Not selected";
  const serviceSummary = selectedServices.length
    ? selectedServices.map((item) => item.name).join(", ")
    : "Not selected";
  const canAdvance =
    step === 0 ? Boolean(place) : step === 1 ? selectedServiceIds.length > 0 : true;
  const contactIsValid =
    fullName.trim().length > 1 && /^\S+@\S+\.\S+$/.test(email.trim()) && phone.trim().length > 6;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(quoteContactKey);
      if (!raw) return;
      const cached = JSON.parse(raw) as { fullName?: string; email?: string };
      if (cached.fullName) setFullName((current) => current || cached.fullName || "");
      if (cached.email) setEmail((current) => current || cached.email || "");
    } catch {
      window.localStorage.removeItem(quoteContactKey);
    }
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const frame = window.requestAnimationFrame(() => headingRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  const clearAudioTimer = useCallback(() => {
    if (audioTimerRef.current !== null) {
      window.clearTimeout(audioTimerRef.current);
      audioTimerRef.current = null;
    }
  }, []);

  const playAudio = useCallback(
    (src: string, phase: "signature" | "narration") => {
      const audio = audioRef.current;
      if (!audio || !audioGuideEnabledRef.current) return;

      clearAudioTimer();
      audio.pause();
      audio.currentTime = 0;
      const targetSrc = new URL(src, window.location.origin).href;
      if (audio.src !== targetSrc) audio.src = src;
      audio.volume = phase === "signature" ? 0.92 : 0.95;
      audioPhaseRef.current = phase;
      void audio.play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch((err) => {
          console.warn("Autoplay block or audio interrupt:", err);
          setAudioPlaying(false);
          if (phase === "signature") {
            hasPlayedSignature.current = false;
          }
        });
    },
    [clearAudioTimer],
  );

  const playStepNarration = useCallback(
    (targetStep: number) => playAudio(quoteAudio[targetStep], "narration"),
    [playAudio],
  );

  const startAudioGuide = useCallback(() => {
    audioGuideEnabledRef.current = true;
    setAudioGuideEnabled(true);
    if (!hasPlayedSignature.current) {
      hasPlayedSignature.current = true;
      playAudio(quoteSignatureAudio, "signature");
    } else {
      playStepNarration(currentStepRef.current);
    }
  }, [playAudio, playStepNarration]);

  const stopAudioGuide = useCallback(() => {
    audioGuideEnabledRef.current = false;
    clearAudioTimer();
    audioPhaseRef.current = null;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setAudioPlaying(false);
    setAudioGuideEnabled(false);
  }, [clearAudioTimer]);

  const toggleAudioGuide = useCallback(() => {
    if (audioGuideEnabledRef.current) stopAudioGuide();
    else startAudioGuide();
  }, [startAudioGuide, stopAudioGuide]);

  const replayAudioGuide = useCallback(() => {
    if (!audioGuideEnabledRef.current) {
      startAudioGuide();
      return;
    }

    playStepNarration(currentStepRef.current);
  }, [playStepNarration, startAudioGuide]);

  const handleAudioEnded = useCallback(() => {
    setAudioPlaying(false);
    if (
      audioPhaseRef.current !== "signature" ||
      !audioGuideEnabledRef.current
    ) {
      return;
    }

    audioPhaseRef.current = null;
    audioTimerRef.current = window.setTimeout(() => {
      playStepNarration(currentStepRef.current);
    }, 280);
  }, [playStepNarration]);

  // Handle step narration changes (only after signature has played)
  useEffect(() => {
    currentStepRef.current = step;
    if (
      !audioGuideEnabledRef.current ||
      audioPhaseRef.current === "signature" ||
      !hasPlayedSignature.current
    ) {
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    clearAudioTimer();
    audioTimerRef.current = window.setTimeout(() => {
      playStepNarration(step);
    }, 420);

    return clearAudioTimer;
  }, [clearAudioTimer, playStepNarration, step]);

  // Request playback during the initial commit. This preserves transient user
  // activation when /quote was opened from an in-app link and also works for
  // browsers where the visitor has already granted autoplay permission.
  useLayoutEffect(() => {
    if (!audioGuideEnabledRef.current) return;

    const startSignature = () => {
      if (!hasPlayedSignature.current) {
        hasPlayedSignature.current = true;
        playAudio(quoteSignatureAudio, "signature");
      }
    };

    const startOnInteraction = () => {
      startSignature();
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("pointerdown", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
    };

    window.addEventListener("click", startOnInteraction);
    window.addEventListener("pointerdown", startOnInteraction);
    window.addEventListener("touchstart", startOnInteraction, { passive: true });
    window.addEventListener("keydown", startOnInteraction);

    startSignature();

    return cleanup;
  }, [playAudio]);

  useEffect(
    () => () => {
      clearAudioTimer();
      audioRef.current?.pause();
    },
    [clearAudioTimer],
  );

  const sendRequest = useCallback((request: StoredQuoteRequest) => {
    startTransition(async () => {
      try {
        const payload: SaveQuotePayload = {
          requestId: request.requestId,
          serviceId: request.serviceId,
          selectedServiceIds: request.selectedServiceIds,
          address: request.address,
          areaM2: 0,
          frequency: request.frequency,
          addOnIds: request.addOnIds,
          propertySize: request.propertySize,
          condition: request.condition,
          conditions: request.conditions,
          scopeDetails: request.scopeDetails,
          sourceZone: request.sourceZone,
          fullName: request.fullName,
          email: request.email,
          phone: request.phone,
        };
        const response = await saveQuote(payload);
        if (response.needsAuth) {
          window.localStorage.setItem(
            pendingQuoteKey,
            JSON.stringify({ ...request, expiresAt: Date.now() + 60 * 60 * 1000 }),
          );
          window.localStorage.setItem(
            quoteContactKey,
            JSON.stringify({
              fullName: request.fullName.trim(),
              email: request.email.trim().toLowerCase(),
              updatedAt: Date.now(),
            }),
          );
          setResult({
            ok: true,
            needsAccount: true,
            title: "Your quote request is created.",
            message:
              "Create your free account to save this request and receive Beaumont's written quote. Your name and email are already filled in.",
          });
          return;
        }
        if (response.ok) {
          window.localStorage.removeItem(pendingQuoteKey);
          window.history.replaceState({}, "", window.location.pathname);
          const delivered = response.notificationStatus === "sent";
          setResult({
            ok: true,
            title: "Your request is in good hands.",
            message: delivered
              ? "A Beaumont specialist will review everything and reply with your written quote, usually within 24 hours."
              : "Your request is safely saved. Beaumont can see every detail while the notification is retried.",
          });
        } else {
          setResult({
            ok: false,
            title: "We couldn’t send that just yet.",
            message: response.error ?? "Something went wrong. Please try again.",
          });
        }
      } catch {
        setResult({
          ok: false,
          title: "We couldn’t send that just yet.",
          message: "Your details are still here. Please try once more.",
        });
      }
    });
  }, []);

  useEffect(() => {
    if (resumedRequest.current) return;
    if (new URLSearchParams(window.location.search).get("completeQuote") !== "1") return;
    resumedRequest.current = true;

    const raw = window.localStorage.getItem(pendingQuoteKey);
    if (!raw) {
      setStep(3);
      setResult({
        ok: false,
        title: "Your saved details have expired.",
        message: "Please complete the request again—it only takes a moment.",
      });
      return;
    }

    try {
      const stored = JSON.parse(raw) as StoredQuoteRequest;
      if (!stored.requestId) stored.requestId = window.crypto.randomUUID();
      if (!stored.expiresAt || stored.expiresAt < Date.now()) {
        window.localStorage.removeItem(pendingQuoteKey);
        setStep(3);
        setResult({
          ok: false,
          title: "Your saved details have expired.",
          message: "Please complete the request again—it only takes a moment.",
        });
        return;
      }

      const restoredServiceIds = stored.selectedServiceIds?.length
        ? stored.selectedServiceIds
        : stored.serviceId
          ? [stored.serviceId]
          : [];
      setPlace(stored.place);
      setSelectedServiceIds(restoredServiceIds);
      setPropertySize(isPropertySize(stored.propertySize) ? stored.propertySize : "single");
      const restoredConditions = stored.conditions?.filter(isCondition) ?? [];
      setConditions(
        restoredConditions.length
          ? restoredConditions
          : isCondition(stored.condition)
            ? [stored.condition]
            : ["refresh"],
      );
      setFrequency(stored.frequency ?? "one_time");
      setSelectedAddOns(stored.addOnIds ?? []);
      setScopeDetails(stored.scopeDetails ?? "");
      setFullName(stored.fullName ?? "");
      setEmail(stored.email ?? "");
      setPhone(stored.phone ?? "");
      requestId.current = stored.requestId;
      setStep(3);
      sendRequest(stored);
    } catch {
      window.localStorage.removeItem(pendingQuoteKey);
      setStep(3);
      setResult({
        ok: false,
        title: "We couldn’t restore your request.",
        message: "Please complete it again—your previous request was not sent.",
      });
    }
  }, [sendRequest]);

  const toggleService = (id: string) => {
    setSelectedServiceIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleCondition = (id: (typeof conditionOptions)[number]["id"]) => {
    setConditions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const submit = () => {
    if (!primaryService || !place || selectedServiceIds.length === 0) return;
    if (!requestId.current) requestId.current = window.crypto.randomUUID();
    window.localStorage.setItem(
      quoteContactKey,
      JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        updatedAt: Date.now(),
      }),
    );
    sendRequest({
      requestId: requestId.current,
      serviceId: primaryService.id,
      selectedServiceIds,
      address: place.label,
      areaM2: 0,
      frequency,
      addOnIds: selectedAddOns,
      propertySize,
      condition: conditions[0],
      conditions,
      scopeDetails,
      sourceZone: initialZone ?? null,
      fullName,
      email,
      phone,
      place,
      expiresAt: Date.now() + 60 * 60 * 1000,
    });
  };

  const reset = () => {
    requestId.current = "";
    setPlace(null);
    setSelectedServiceIds([]);
    setPropertySize("single");
    setConditions(["refresh"]);
    setFrequency("one_time");
    setSelectedAddOns([]);
    setScopeDetails("");
    setPhone("");
    setResult(null);
    setStep(0);
  };

  const activeScene = sceneCopy[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="quote-experience min-w-0 overflow-hidden rounded-[1.75rem] border border-ivory/10 bg-soil shadow-[0_38px_110px_-42px_rgba(29,23,15,.75)] md:rounded-[2.75rem]">
      <audio
        ref={audioRef}
        src={quoteSignatureAudio}
        autoPlay
        playsInline
        preload="auto"
        onPlay={() => {
          hasPlayedSignature.current = true;
          setAudioPlaying(true);
        }}
        onPause={() => setAudioPlaying(false)}
        onEnded={handleAudioEnded}
      />
      <div className="relative border-b border-ivory/10 bg-soil px-5 pb-4 pt-5 text-ivory md:px-8 md:pb-5 md:pt-6 lg:px-10">
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ivory/15 bg-ivory/[0.06]">
              <Monogram size={24} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.25em] text-sand/70">
                Personal estimate
              </span>
              <span className="mt-0.5 block text-xs font-medium text-ivory/55">
                About 2 minutes · no payment
              </span>
            </span>
          </div>

          <ol className="hidden items-center gap-1 md:flex" aria-label="Estimate progress">
            {steps.map((item, index) => {
              const active = index === step;
              const complete = index < step;
              return (
                <li key={item.label} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => index <= step && !result && setStep(index)}
                    disabled={index > step || Boolean(result)}
                    aria-current={active ? "step" : undefined}
                    className={`group flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "bg-ivory text-oak"
                        : complete
                          ? "text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
                          : "cursor-default text-ivory/25"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] ${
                        active
                          ? "border-oak/15 bg-sand/45"
                          : complete
                            ? "border-sand/35 text-sand"
                            : "border-ivory/15"
                      }`}
                    >
                      {complete ? <Check /> : index + 1}
                    </span>
                    {item.label}
                  </button>
                  {index < steps.length - 1 && (
                    <span className="mx-1 h-px w-3 bg-ivory/10" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>

          <span className="shrink-0 text-xs font-semibold text-ivory/60 md:hidden">
            {step + 1} / {steps.length}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-ivory/10 pt-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                audioGuideEnabled
                  ? "border-sand/45 bg-sand/15 text-sand"
                  : "border-ivory/10 bg-ivory/[0.04] text-ivory/45"
              }`}
            >
              <SoundWaveIcon active={audioPlaying} />
            </span>
            <span className="min-w-0">
              <span className="block whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.22em] text-sand/75">
                Audio guide
              </span>
              <span className="mt-0.5 hidden truncate text-[11px] font-medium text-ivory/45 sm:block">
                A quiet cue for each step
              </span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {audioGuideEnabled && (
              <button
                type="button"
                onClick={replayAudioGuide}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/65 transition-colors hover:border-sand/40 hover:bg-ivory/[0.06] hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand/60"
                aria-label={`Replay the ${steps[step].label.toLowerCase()} guide`}
                title="Replay this step"
              >
                <ReplayIcon />
              </button>
            )}
            <button
              type="button"
              onClick={toggleAudioGuide}
              aria-pressed={audioGuideEnabled}
              className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand/60 ${
                audioGuideEnabled
                  ? "border-sand/35 bg-sand/15 text-sand hover:bg-sand/20"
                  : "border-ivory/15 bg-ivory/[0.05] text-ivory/75 hover:border-sand/35 hover:text-sand"
              }`}
            >
              {audioGuideEnabled ? <MutedIcon /> : <PlayIcon />}
              {audioGuideEnabled ? "Mute" : "Unmute"}
            </button>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-[2px] bg-ivory/10"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-label={`Step ${step + 1} of ${steps.length}: ${steps[step].label}`}
        >
          <motion.span
            className="block h-full bg-sand"
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduce ? 0 : 0.55, ease }}
          />
        </div>
      </div>

      <div className="grid bg-ivory lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,.65fr)]">
        <div className="flex min-w-0 flex-col">
          <div className="min-w-0 flex-1 px-5 pb-4 pt-8 sm:px-8 md:px-12 md:pb-6 md:pt-12 lg:px-14 lg:pt-14">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={reduce ? false : { opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -18 }}
                transition={{ duration: 0.46, ease }}
              >
                {step === 0 && (
                  <div>
                    <StepHeading
                      headingRef={headingRef}
                      overline="First, the property"
                      title="Where are we caring for?"
                      copy="Start with an address. That’s all we need to understand the home and prepare the right next questions."
                    />

                    <div className="mt-8 md:mt-10">
                      <AddressSearch
                        initialValue={place?.label ?? ""}
                        onSelect={setPlace}
                        onInputChange={(value) => {
                          if (place && value !== place.label) setPlace(null);
                        }}
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {place && (
                        <motion.div
                          initial={reduce ? false : { opacity: 0, y: 12, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -6, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 flex items-start gap-4 rounded-[1.25rem] border border-cinnamon/20 bg-sand/20 p-4 sm:items-center sm:p-5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cinnamon text-ivory shadow-soft">
                              <Check />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-cinnamon">
                                Property found
                              </span>
                              <span className="mt-1 block font-display text-xl leading-tight text-oak sm:text-2xl">
                                {place.label}
                              </span>
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-oak/10 pt-5 text-xs font-medium text-soil/55">
                      <TrustNote icon={<ShieldIcon />}>Kept private</TrustNote>
                      <TrustNote icon={<SparkIcon />}>No exact measurements</TrustNote>
                      <TrustNote icon={<ClockIcon />}>Reply within 24h</TrustNote>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <StepHeading
                      headingRef={headingRef}
                      overline="Shape your visit"
                      title="What would you like to refresh?"
                      copy="Choose everything you’re considering. You can select more than one, and nothing is booked today."
                    />

                    <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10">
                      {services.map((item, index) => {
                        const selected = selectedServiceIds.includes(item.id);
                        return (
                          <motion.button
                            type="button"
                            key={item.id}
                            onClick={() => toggleService(item.id)}
                            aria-pressed={selected}
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.42, delay: reduce ? 0 : index * 0.05, ease }}
                            className={`group relative min-h-[10.5rem] overflow-hidden rounded-[1.35rem] border p-5 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 ${
                              selected
                                ? "border-cinnamon bg-cinnamon text-ivory shadow-[0_18px_45px_-28px_rgba(64,38,26,.9)]"
                                : "border-oak/10 bg-white/65 text-oak hover:border-cinnamon/30 hover:bg-white"
                            }`}
                          >
                            <span className="relative z-10 flex h-full flex-col">
                              <span className="flex items-start justify-between gap-4">
                                <span
                                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                                    selected
                                      ? "border-ivory/20 bg-ivory/10 text-sand"
                                      : "border-oak/10 bg-sand/20 text-cinnamon"
                                  }`}
                                >
                                  <ServiceIcon id={item.id} />
                                </span>
                                <span
                                  className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                                    selected
                                      ? "border-sand bg-sand text-oak"
                                      : "border-oak/15 text-transparent group-hover:border-cinnamon/40"
                                  }`}
                                >
                                  <Check />
                                </span>
                              </span>
                              <span className="mt-5 block font-display text-2xl leading-[1.05]">
                                {shortServiceName(item.name)}
                              </span>
                              <span
                                className={`mt-2 block text-xs font-medium leading-relaxed ${
                                  selected ? "text-ivory/65" : "text-soil/50"
                                }`}
                              >
                                {shortServiceDescription(item.id, item.description)}
                              </span>
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <p className="mt-5 text-center text-xs font-medium text-soil/45">
                      {selectedServices.length
                        ? `${selectedServices.length} service${selectedServices.length === 1 ? "" : "s"} selected`
                        : "Select at least one to continue"}
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <StepHeading
                      headingRef={headingRef}
                      overline="The quick picture"
                      title="Help us see what you see."
                      copy="No measuring and no technical language. Pick the answers that feel closest—we’ll verify the rest."
                    />

                    <QuestionBlock number="01" title="How much of the property needs care?">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {propertySizes.map((item) => (
                          <ChoiceCard
                            key={item.id}
                            label={item.label}
                            note={item.note}
                            selected={propertySize === item.id}
                            onClick={() => setPropertySize(item.id)}
                            icon={<ScopeIcon type={item.icon} />}
                          />
                        ))}
                      </div>
                    </QuestionBlock>

                    <QuestionBlock
                      number="02"
                      title="What stands out right now?"
                      hint="Select all that apply"
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        {conditionOptions.map((item) => (
                          <ChoiceCard
                            key={item.id}
                            label={item.label}
                            note={item.note}
                            selected={conditions.includes(item.id)}
                            onClick={() => toggleCondition(item.id)}
                          />
                        ))}
                      </div>
                    </QuestionBlock>

                    <QuestionBlock number="03" title="Is this a one-time visit or ongoing care?">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {frequencies.map((item) => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setFrequency(item.id)}
                            aria-pressed={frequency === item.id}
                            className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
                              frequency === item.id
                                ? "border-cinnamon bg-cinnamon text-ivory"
                                : "border-oak/10 bg-white/60 text-soil/65 hover:border-cinnamon/30"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </QuestionBlock>

                    <details className="group mt-7 rounded-[1.25rem] border border-oak/10 bg-sand/15 open:bg-white/55">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-oak [&::-webkit-details-marker]:hidden">
                        <span>
                          Add anything else
                          <span className="ml-2 font-normal text-soil/45">Optional</span>
                        </span>
                        <PlusIcon />
                      </summary>
                      <div className="border-t border-oak/10 px-5 pb-5 pt-4">
                        <div className="grid gap-2 sm:grid-cols-2">
                          {addOns.map((item) => {
                            const selected = selectedAddOns.includes(item.id);
                            return (
                              <button
                                type="button"
                                key={item.id}
                                onClick={() =>
                                  setSelectedAddOns((current) =>
                                    selected
                                      ? current.filter((id) => id !== item.id)
                                      : [...current, item.id],
                                  )
                                }
                                aria-pressed={selected}
                                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                                  selected
                                    ? "border-cinnamon bg-cinnamon/5 text-oak"
                                    : "border-oak/10 bg-ivory/60 text-soil/65 hover:border-cinnamon/30"
                                }`}
                              >
                                {item.label}
                                <span
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                    selected
                                      ? "border-cinnamon bg-cinnamon text-ivory"
                                      : "border-oak/15 text-transparent"
                                  }`}
                                >
                                  <Check />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <label className="mt-4 block text-sm font-semibold text-oak">
                          A note for the team
                          <textarea
                            value={scopeDetails}
                            onChange={(event) => setScopeDetails(event.target.value)}
                            rows={3}
                            placeholder="Access details, a particular surface, or anything else you’d like us to know…"
                            className="mt-2 w-full resize-none rounded-xl border border-oak/15 bg-ivory/70 px-4 py-3 font-medium text-oak outline-none transition placeholder:text-soil/35 focus:border-cinnamon focus:ring-2 focus:ring-cinnamon/10"
                          />
                        </label>
                      </div>
                    </details>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <StepHeading
                      headingRef={headingRef}
                      overline="Your request is ready"
                      title={
                        result?.needsAccount
                          ? "Your request is ready to save."
                          : result?.ok
                            ? "Consider it received."
                            : "Where should we send your quote?"
                      }
                      copy={
                        result?.needsAccount
                          ? "One quick step keeps your quote connected to you."
                          : result?.ok
                          ? "We’ll take it from here."
                          : "Share the best way to reach you. These details are used only for this request."
                      }
                    />

                    {result ? (
                      <motion.div
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-8 rounded-[1.5rem] border p-7 text-center md:mt-10 md:p-10 ${
                          result.ok
                            ? "border-ochre/20 bg-sand/20"
                            : "border-red-900/15 bg-red-50/60"
                        }`}
                      >
                        <span
                          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                            result.ok ? "bg-cinnamon text-ivory" : "bg-red-900/10 text-red-900"
                          }`}
                        >
                          {result.ok ? <LargeCheck /> : <AlertIcon />}
                        </span>
                        <p className="mt-5 font-display text-3xl leading-tight text-oak md:text-4xl">
                          {result.title}
                        </p>
                        {result.message && (
                          <p className="mx-auto mt-3 max-w-lg text-sm font-medium leading-relaxed text-soil/60">
                            {result.message}
                          </p>
                        )}
                        {result.needsAccount ? (
                          <div className="mt-7 flex flex-col items-center gap-3">
                            <Button
                              size="lg"
                              onClick={() =>
                                window.location.assign(
                                  `/login?mode=signup&quote=ready&next=${encodeURIComponent(quoteReturnPath)}`,
                                )
                              }
                            >
                              Create account and save quote
                              <Arrow />
                            </Button>
                            <button
                              type="button"
                              onClick={() =>
                                window.location.assign(
                                  `/login?quote=ready&next=${encodeURIComponent(quoteReturnPath)}`,
                                )
                              }
                              className="text-sm font-semibold text-oak underline decoration-oak/25 underline-offset-4 hover:decoration-oak"
                            >
                              Already have an account? Sign in
                            </button>
                          </div>
                        ) : (
                          <Button className="mt-7" variant="outline" onClick={result.ok ? reset : () => setResult(null)}>
                            {result.ok ? "Start another request" : "Try again"}
                          </Button>
                        )}
                      </motion.div>
                    ) : (
                      <>
                        <div className="mt-8 rounded-[1.35rem] border border-oak/10 bg-sand/15 p-5 md:mt-10 md:p-6">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cinnamon">
                              Your care plan
                            </p>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="text-xs font-semibold text-oak underline decoration-oak/25 underline-offset-4 hover:decoration-oak"
                            >
                              Edit
                            </button>
                          </div>
                          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                            <SummaryRow label="Property" value={place?.label ?? "Not selected"} />
                            <SummaryRow label="Care" value={serviceSummary} />
                            <SummaryRow label="Plan" value={`${propertySizeLabel} · ${frequencyLabel}`} />
                          </dl>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <QuoteField
                            label="Full name"
                            value={fullName}
                            onChange={setFullName}
                            autoComplete="name"
                            placeholder="Your name"
                          />
                          <QuoteField
                            label="Email"
                            value={email}
                            onChange={setEmail}
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                          />
                          <div className="sm:col-span-2">
                            <QuoteField
                              label="Phone"
                              hint="For quick scheduling questions"
                              value={phone}
                              onChange={setPhone}
                              type="tel"
                              autoComplete="tel"
                              placeholder="(514) 555-0123"
                            />
                          </div>
                        </div>

                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-oak/10 bg-white/50 px-4 py-3 text-xs font-medium leading-relaxed text-soil/50">
                          <ShieldIcon />
                          <span>
                            Your request is saved securely. If you’re new to Beaumont, we’ll help you create your client access before it’s sent.
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {!result && (
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-oak/10 bg-white/35 px-5 py-5 sm:px-8 md:px-12 lg:px-14">
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={step === 0}
                className={`inline-flex items-center gap-2 rounded-full px-2 py-3 text-sm font-semibold text-oak transition-colors hover:text-cinnamon ${
                  step === 0 ? "pointer-events-none opacity-0" : ""
                }`}
              >
                <BackArrow /> Back
              </button>

              {step < steps.length - 1 ? (
                <Button
                  size="lg"
                  onClick={() => setStep((current) => current + 1)}
                  disabled={!canAdvance}
                  className="min-w-[10rem] shadow-[0_16px_35px_-18px_rgba(64,38,26,.85)]"
                >
                  {step === 0 ? "This is the place" : step === 1 ? "Continue" : "Looks good"}
                  <Arrow />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={submit}
                  disabled={pending || !contactIsValid}
                  className="min-w-[11rem] shadow-[0_16px_35px_-18px_rgba(64,38,26,.85)]"
                >
                  {pending ? "Sending…" : "Send my request"}
                  {!pending && <Arrow />}
                </Button>
              )}
            </div>
          )}
        </div>

        <aside className="relative hidden min-h-[43rem] overflow-hidden bg-oak text-ivory lg:block">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-[url('/images/montreal-home-hero.png')] bg-cover bg-center opacity-45"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,23,15,.2)_0%,rgba(29,23,15,.72)_55%,rgba(29,23,15,.96)_100%)]"
          />
          <div aria-hidden="true" className="absolute inset-5 rounded-[1.8rem] border border-ivory/10" />

          <div className="relative flex h-full min-h-[43rem] flex-col justify-between p-9 xl:p-11">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-ivory/15 bg-soil/25 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/70 backdrop-blur-sm">
                Step {step + 1} · {steps[step].shortLabel}
              </span>
              <span className="font-display text-2xl text-sand">0{step + 1}</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease }}
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-sand/75">
                  {activeScene.eyebrow}
                </p>
                <p className="mt-4 font-display text-[2.35rem] leading-[1.02] text-ivory xl:text-[2.75rem]">
                  {activeScene.title}
                </p>
                <p className="mt-4 text-sm font-medium leading-relaxed text-ivory/60">
                  {activeScene.copy}
                </p>

                {(place || selectedServices.length > 0) && (
                  <div className="mt-8 border-t border-ivory/15 pt-6">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/40">
                      Captured so far
                    </p>
                    <div className="mt-4 space-y-3 text-sm font-medium text-ivory/80">
                      {place && (
                        <p className="flex items-start gap-2.5">
                          <span className="mt-1 text-sand"><MapPin /></span>
                          <span className="line-clamp-2">{place.label}</span>
                        </p>
                      )}
                      {selectedServices.length > 0 && (
                        <p className="flex items-center gap-2.5">
                          <span className="text-sand"><SparkIcon /></span>
                          {selectedServices.length} service{selectedServices.length === 1 ? "" : "s"} selected
                        </p>
                      )}
                      {step >= 2 && (
                        <p className="flex items-center gap-2.5">
                          <span className="text-sand"><Check /></span>
                          {propertySizeLabel} · {conditionLabel}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </div>
  );
}

const StepHeading = ({
  headingRef,
  overline,
  title,
  copy,
}: {
  headingRef: React.RefObject<HTMLHeadingElement>;
  overline: string;
  title: string;
  copy: string;
}) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-cinnamon">
      {overline}
    </p>
    <h2
      ref={headingRef}
      tabIndex={-1}
      className="mt-3 max-w-2xl text-balance font-display text-[2.55rem] leading-[.98] text-oak outline-none md:text-[3.5rem]"
    >
      {title}
    </h2>
    <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-soil/60 md:text-base">
      {copy}
    </p>
  </div>
);

function QuestionBlock({
  number,
  title,
  hint,
  children,
}: {
  number: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="mt-8 border-0 p-0 md:mt-9">
      <legend className="mb-4 flex items-center gap-3 text-sm font-semibold text-oak">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-oak/10 bg-sand/25 text-[9px] text-cinnamon">
          {number}
        </span>
        <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span>{title}</span>
          {hint && (
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-soil/40">
              {hint}
            </span>
          )}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

function ChoiceCard({
  label,
  note,
  selected,
  onClick,
  icon,
}: {
  label: string;
  note: string;
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-[border-color,background-color,box-shadow] ${
        selected
          ? "border-cinnamon bg-cinnamon/5 shadow-[inset_0_0_0_1px_rgba(122,67,39,.05)]"
          : "border-oak/10 bg-white/60 hover:border-cinnamon/30 hover:bg-white"
      }`}
    >
      {icon && (
        <span className={`shrink-0 ${selected ? "text-cinnamon" : "text-soil/35"}`}>{icon}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-oak">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-soil/45">{note}</span>
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-cinnamon bg-cinnamon text-ivory" : "border-oak/15 text-transparent"
        }`}
      >
        <Check />
      </span>
    </button>
  );
}

function TrustNote({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-cinnamon">{icon}</span>
      {children}
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-soil/40">{label}</dt>
      <dd className="mt-1 line-clamp-2 break-words font-medium leading-snug text-oak">{value}</dd>
    </div>
  );
}

function QuoteField({
  label,
  hint,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete: string;
  placeholder: string;
}) {
  return (
    <label className="block text-sm font-semibold text-oak">
      <span className="flex items-baseline justify-between gap-3">
        {label}
        {hint && <span className="text-[10px] font-medium text-soil/40">{hint}</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="mt-2 h-[3.25rem] w-full rounded-xl border border-oak/15 bg-white/70 px-4 font-medium text-oak outline-none transition placeholder:text-soil/30 focus:border-cinnamon focus:bg-white focus:ring-2 focus:ring-cinnamon/10"
      />
    </label>
  );
}

function shortServiceName(name: string) {
  return name
    .replace("Driveway & Hardscape Washing", "Driveways & stone")
    .replace("Deck & Patio Washing", "Decks & patios")
    .replace("Soft House Washing", "House washing")
    .replace("Exterior Window Washing", "Exterior windows");
}

function shortServiceDescription(id: string, fallback: string) {
  const descriptions: Record<string, string> = {
    driveway: "Concrete, interlock, asphalt, steps, and walkways.",
    deck: "Wood, composite, concrete, and outdoor living areas.",
    "house-wash": "Siding, brick, stucco, and delicate exterior finishes.",
    "windows-atlantic": "Exterior glass, frames, and sills, left streak-free.",
  };
  return descriptions[id] ?? fallback;
}

function isPropertySize(value: string | undefined): value is (typeof propertySizes)[number]["id"] {
  return propertySizes.some((item) => item.id === value);
}

function isCondition(value: string | undefined): value is (typeof conditionOptions)[number]["id"] {
  return conditionOptions.some((item) => item.id === value);
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 8 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LargeCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPin() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M19 12H5m6-6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 5.5 5.7v5.5c0 4.2 2.7 7.8 6.5 9.8 3.8-2 6.5-5.6 6.5-9.8V5.7L12 3Z" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3c.5 4.6 2.9 7 7.5 7.5-4.6.5-7 2.9-7.5 7.5-.5-4.6-2.9-7-7.5-7.5C9.1 10 11.5 7.6 12 3Z" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" strokeLinecap="round" />
    </svg>
  );
}

function SoundWaveIcon({ active }: { active: boolean }) {
  return (
    <span className="flex h-4 items-center gap-[2px]" aria-hidden="true">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className={`block w-[2px] rounded-full bg-current ${
            active ? "animate-pulse" : ""
          }`}
          style={{
            height: `${8 + (bar % 2) * 5}px`,
            animationDelay: `${bar * 140}ms`,
          }}
        />
      ))}
    </span>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden="true">
      <path d="M4.5 2.8a.8.8 0 0 1 1.2-.68l6.8 5.2a.85.85 0 0 1 0 1.36l-6.8 5.2a.8.8 0 0 1-1.2-.68V2.8Z" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M2.5 6.2h2L7.2 4v8L4.5 9.8h-2V6.2Z" strokeLinejoin="round" />
      <path d="m10.2 6 3.3 4m0-4-3.3 4" strokeLinecap="round" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4.5 7.5A6 6 0 1 1 4 12" strokeLinecap="round" />
      <path d="M3.5 3.8v4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServiceIcon({ id }: { id: string }) {
  if (id === "driveway") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M7 3h10l4 18H3L7 3Z" strokeLinejoin="round" />
        <path d="M12 5v3m0 3v3m0 3v2" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "deck") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 8h16M5 8v12m14-12v12M3 13h18M3 18h18" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "house-wash") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="m3 11 9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 10v10h13V10M10 20v-6h4v6" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="4" y="3.5" width="16" height="17" rx="1" />
      <path d="M12 4v16M4 12h16" />
      <path d="M18.5 2.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ScopeIcon({ type }: { type: (typeof propertySizes)[number]["icon"] }) {
  const count = type === "entry" ? 1 : type === "single" ? 2 : type === "multi" ? 3 : 4;
  return (
    <span className="grid h-7 w-7 grid-cols-2 gap-0.5 rounded-md border border-current/20 p-1">
      {[0, 1, 2, 3].map((index) => (
        <span key={index} className={`rounded-[2px] ${index < count ? "bg-current" : "bg-current/10"}`} />
      ))}
    </span>
  );
}
