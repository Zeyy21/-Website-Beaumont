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
import { AnimatePresence, motion } from "framer-motion";
import { addOns, frequencies, type FrequencyId } from "@/lib/config";
import type { ServiceCard } from "@/lib/data";
import { Button, Monogram } from "@/components/ui";
import { AddressSearch } from "./address-search";
import { saveQuote, type SaveQuotePayload } from "@/app/(site)/quote/actions";
import { useT } from "@/components/i18n/locale-provider";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface Place {
  label: string;
  lat: number;
  lon: number;
}

/** Signed-in visitor's saved contact details, used to skip re-entry and to
 *  route a completed request straight to their dashboard. */
export interface QuoteAccount {
  signedIn: boolean;
  fullName: string;
  email: string;
  phone: string;
}

const dashboardQuotesPath = "/dashboard/quotes";

interface StoredQuoteRequest extends SaveQuotePayload {
  place: Place;
  expiresAt: number;
}

const pendingQuoteKey = "beaumont:pending-quote";
const quoteContactKey = "beaumont:quote-contact";
const quoteReturnPath = "/quote?completeQuote=1";

/** Step + option ids and structure live here; all display copy is pulled from
 *  the dictionary at render time (keyed by the `copy` id below). */
const steps = [
  { copy: "property" },
  { copy: "services" },
  { copy: "details" },
  { copy: "contact" },
] as const;

type SceneKey = keyof Dictionary["quote"]["scenes"];
const sceneKeys: readonly SceneKey[] = ["property", "services", "details", "contact"];



/** `copy` maps to dictionaries.quote.propertySizes.<copy>. */
const propertySizes = [
  { id: "entry", copy: "small", icon: "entry" },
  { id: "single", copy: "single", icon: "single" },
  { id: "multi", copy: "multi", icon: "multi" },
  { id: "full", copy: "full", icon: "full" },
] as const;

/** `copy` maps to dictionaries.quote.conditions.<copy>. */
const conditionOptions = [
  { id: "refresh", copy: "light" },
  { id: "organic", copy: "algae" },
  { id: "stains", copy: "stains" },
  { id: "delicate", copy: "delicate" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function QuoteBuilder({
  services,
  initialZone,
  account,
  compact = false,
}: {
  services: ServiceCard[];
  initialZone?: string | null;
  account?: QuoteAccount | null;
  compact?: boolean;
}) {
  const signedIn = Boolean(account?.signedIn);
  const { dict, locale } = useT();
  const tq = dict.quote;
  const tqResults = tq.results;
  const stepLabel = (i: number) => tq.steps[steps[i].copy].label;
  const stepShort = (i: number) => {
    const s = tq.steps[steps[i].copy];
    return s.short || s.label;
  };
  const serviceDescription = (id: string, fallback: string) => {
    const map = tq.serviceDescriptions as Record<string, string>;
    return map[id] ?? fallback;
  };
  const servicesSelectedLabel = (n: number) =>
    (n === 1 ? tq.step1.servicesSelectedOne : tq.step1.servicesSelectedMany).replace(
      "{n}",
      String(n),
    );
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
  const [fullName, setFullName] = useState(account?.fullName ?? "");
  const [email, setEmail] = useState(account?.email ?? "");
  const [phone, setPhone] = useState(account?.phone ?? "");
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

  const selectedServices = useMemo(
    () => services.filter((item) => selectedServiceIds.includes(item.id)),
    [services, selectedServiceIds],
  );
  const primaryService = selectedServices[0] ?? services[0];
  const sizeOption = propertySizes.find((item) => item.id === propertySize);
  const propertySizeLabel = sizeOption
    ? tq.propertySizes[sizeOption.copy].label
    : dict.common.notSelected;
  const conditionLabel = conditions.length
    ? conditionOptions
        .filter((item) => conditions.includes(item.id))
        .map((item) => tq.conditions[item.copy].label)
        .join(", ")
    : dict.common.notSelected;
  const frequencyLabel =
    dict.frequencies[frequency]?.label ?? dict.common.notSelected;
  const serviceSummary = selectedServices.length
    ? selectedServices.map((item) => item.name).join(", ")
    : dict.common.notSelected;
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
            title: tqResults.createdTitle,
            message: tqResults.createdMessage,
          });
          return;
        }
        if (response.ok) {
          window.localStorage.removeItem(pendingQuoteKey);
          window.history.replaceState({}, "", window.location.pathname);
          const delivered = response.notificationStatus === "sent";
          // Signed-in visitors already have the request saved to their account;
          // send them to their quotes panel rather than the public end card.
          if (signedIn) {
            setResult({
              ok: true,
              title: tqResults.savedToAccountTitle,
              message: tqResults.savedToAccountMessage,
            });
            window.location.assign(dashboardQuotesPath);
            return;
          }
          setResult({
            ok: true,
            title: tqResults.goodHandsTitle,
            message: delivered
              ? tqResults.deliveredMessage
              : tqResults.savedMessage,
          });
        } else {
          setResult({
            ok: false,
            title: tqResults.errorTitle,
            message: response.error ?? tqResults.errorMessage,
          });
        }
      } catch {
        setResult({
          ok: false,
          title: tqResults.errorTitle,
          message: tqResults.errorRetryMessage,
        });
      }
    });
  }, [tqResults, signedIn]);

  useEffect(() => {
    if (resumedRequest.current) return;
    if (new URLSearchParams(window.location.search).get("completeQuote") !== "1") return;
    resumedRequest.current = true;

    const raw = window.localStorage.getItem(pendingQuoteKey);
    if (!raw) {
      setStep(3);
      setResult({
        ok: false,
        title: tqResults.expiredTitle,
        message: tqResults.expiredMessage,
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
          title: tqResults.expiredTitle,
          message: tqResults.expiredMessage,
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
        title: tqResults.restoreErrorTitle,
        message: tqResults.restoreErrorMessage,
      });
    }
  }, [sendRequest, tqResults]);

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

  const activeScene = tq.scenes[sceneKeys[step]];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className={`quote-experience min-w-0 overflow-hidden border border-ivory/10 bg-soil shadow-[0_38px_110px_-42px_rgba(28,28,26,.75)] ${compact ? "rounded-3xl" : "rounded-[1.75rem] md:rounded-[2.75rem]"}`}>
      <div className={`relative border-b border-ivory/10 bg-soil text-ivory ${compact ? "px-5 pb-3 pt-4" : "px-5 pb-4 pt-5 md:px-8 md:pb-5 md:pt-6 lg:px-10"}`}>
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ivory/15 bg-ivory/[0.06]">
              <Monogram size={24} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.25em] text-sand/70">
                {tq.header.eyebrow}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-ivory/55">
                {tq.header.sub}
              </span>
            </span>
          </div>

          <ol className={`items-center gap-1 ${compact ? "hidden" : "hidden md:flex"}`} aria-label={tq.header.progressAria}>
            {steps.map((item, index) => {
              const active = index === step;
              const complete = index < step;
              return (
                <li key={item.copy} className="flex items-center">
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
                    {stepLabel(index)}
                  </button>
                  {index < steps.length - 1 && (
                    <span className="mx-1 h-px w-3 bg-ivory/10" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>

          <span className={`shrink-0 text-xs font-semibold text-ivory/60 ${compact ? "" : "md:hidden"}`}>
            {step + 1} / {steps.length}
          </span>
        </div>



        <div
          className="absolute inset-x-0 bottom-0 h-[2px] bg-ivory/10"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-label={`${tq.header.progressAria}: ${step + 1}/${steps.length} — ${stepLabel(step)}`}
        >
          <motion.span
            className="block h-full bg-sand"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.55, ease }}
          />
        </div>
      </div>

      <div className={`grid bg-ivory ${!compact ? "lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,.65fr)]" : ""}`}>
        <div className="flex min-w-0 flex-col">
          <div className={`min-w-0 flex-1 px-5 pb-4 pt-8 sm:px-8 md:px-12 md:pb-6 md:pt-12 ${!compact ? "lg:px-14 lg:pt-14" : ""}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.46, ease }}
              >
                {step === 0 && (
                  <div>
                    <StepHeading
                      headingRef={headingRef}
                      overline={tq.step0.overline}
                      title={tq.step0.title}
                      copy={tq.step0.copy}
                      compact={compact}
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
                          initial={{ opacity: 0, y: 12, height: 0 }}
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
                                {tq.step0.propertyFound}
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
                      <TrustNote icon={<ShieldIcon />}>{tq.step0.trustPrivate}</TrustNote>
                      <TrustNote icon={<SparkIcon />}>{tq.step0.trustNoMeasure}</TrustNote>
                      <TrustNote icon={<ClockIcon />}>{tq.step0.trustReply}</TrustNote>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <StepHeading
                      headingRef={headingRef}
                      overline={tq.step1.overline}
                      title={tq.step1.title}
                      copy={tq.step1.copy}
                      compact={compact}
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
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.42, delay: index * 0.05, ease }}
                            className={`group relative min-h-[10.5rem] overflow-hidden rounded-[1.35rem] border p-5 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 ${
                              selected
                                ? "border-cinnamon bg-cinnamon text-ivory shadow-[0_18px_45px_-28px_rgba(43,43,40,.9)]"
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
                                {item.name}
                              </span>
                              <span
                                className={`mt-2 block text-xs font-medium leading-relaxed ${
                                  selected ? "text-ivory/65" : "text-soil/50"
                                }`}
                              >
                                {serviceDescription(item.id, item.description)}
                              </span>
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <p className="mt-5 text-center text-xs font-medium text-soil/45">
                      {selectedServices.length
                        ? servicesSelectedLabel(selectedServices.length)
                        : tq.step1.selectAtLeastOne}
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <StepHeading
                      headingRef={headingRef}
                      overline={tq.step2.overline}
                      title={tq.step2.title}
                      copy={tq.step2.copy}
                      compact={compact}
                    />

                    <QuestionBlock number="01" title={tq.step2.q1}>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {propertySizes.map((item) => (
                          <ChoiceCard
                            key={item.id}
                            label={tq.propertySizes[item.copy].label}
                            note={tq.propertySizes[item.copy].note}
                            selected={propertySize === item.id}
                            onClick={() => setPropertySize(item.id)}
                            icon={<ScopeIcon type={item.icon} />}
                          />
                        ))}
                      </div>
                    </QuestionBlock>

                    <QuestionBlock
                      number="02"
                      title={tq.step2.q2}
                      hint={tq.step2.selectAllApply}
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        {conditionOptions.map((item) => (
                          <ChoiceCard
                            key={item.id}
                            label={tq.conditions[item.copy].label}
                            note={tq.conditions[item.copy].note}
                            selected={conditions.includes(item.id)}
                            onClick={() => toggleCondition(item.id)}
                          />
                        ))}
                      </div>
                    </QuestionBlock>

                    <QuestionBlock number="03" title={tq.step2.q3}>
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
                            {dict.frequencies[item.id].label}
                          </button>
                        ))}
                      </div>
                    </QuestionBlock>

                    <details className="group mt-7 rounded-[1.25rem] border border-oak/10 bg-sand/15 open:bg-white/55">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-oak [&::-webkit-details-marker]:hidden">
                        <span>
                          {tq.step2.addAnything}
                          <span className="ml-2 font-normal text-soil/45">{dict.common.optional}</span>
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
                                {dict.addOns[item.id]}
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
                          {tq.step2.noteLabel}
                          <textarea
                            value={scopeDetails}
                            onChange={(event) => setScopeDetails(event.target.value)}
                            rows={3}
                            placeholder={tq.step2.notePlaceholder}
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
                      compact={compact}
                      headingRef={headingRef}
                      overline={tq.step3.overlineReady}
                      title={
                        result?.needsAccount
                          ? tq.step3.titleSave
                          : result?.ok
                            ? tq.step3.titleReceived
                            : signedIn
                              ? tq.step3.titleSignedIn
                              : tq.step3.titleDefault
                      }
                      copy={
                        result?.needsAccount
                          ? tq.step3.copySave
                          : result?.ok
                          ? tq.step3.copyReceived
                          : signedIn
                            ? tq.step3.copySignedIn
                            : tq.step3.copyDefault
                      }
                    />

                    {result ? (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
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
                              {tq.step3.createAccount}
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
                              {tq.step3.alreadyHaveAccount}
                            </button>
                          </div>
                        ) : (
                          <Button className="mt-7" variant="outline" onClick={result.ok ? reset : () => setResult(null)}>
                            {result.ok ? tq.step3.startAnother : tq.step3.tryAgain}
                          </Button>
                        )}
                      </motion.div>
                    ) : (
                      <>
                        <div className="mt-8 rounded-[1.35rem] border border-oak/10 bg-sand/15 p-5 md:mt-10 md:p-6">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cinnamon">
                              {tq.step3.carePlan}
                            </p>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="text-xs font-semibold text-oak underline decoration-oak/25 underline-offset-4 hover:decoration-oak"
                            >
                              {dict.common.edit}
                            </button>
                          </div>
                          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                            <SummaryRow label={tq.step3.summaryProperty} value={place?.label ?? dict.common.notSelected} />
                            <SummaryRow label={tq.step3.summaryCare} value={serviceSummary} />
                            <SummaryRow label={tq.step3.summaryPlan} value={`${propertySizeLabel} · ${frequencyLabel}`} />
                          </dl>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <QuoteField
                            label={tq.step3.fullName}
                            value={fullName}
                            onChange={setFullName}
                            autoComplete="name"
                            placeholder={tq.step3.fullNamePlaceholder}
                          />
                          <QuoteField
                            label={tq.step3.email}
                            value={email}
                            onChange={setEmail}
                            type="email"
                            autoComplete="email"
                            placeholder={tq.step3.emailPlaceholder}
                          />
                          <div className="sm:col-span-2">
                            <QuoteField
                              label={tq.step3.phone}
                              hint={tq.step3.phoneHint}
                              value={phone}
                              onChange={setPhone}
                              type="tel"
                              autoComplete="tel"
                              placeholder={tq.step3.phonePlaceholder}
                            />
                          </div>
                        </div>

                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-oak/10 bg-white/50 px-4 py-3 text-xs font-medium leading-relaxed text-soil/50">
                          <ShieldIcon />
                          <span>
                            {signedIn ? tq.step3.securityNoteSignedIn : tq.step3.securityNote}
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
                <BackArrow /> {dict.common.back}
              </button>

              {step < steps.length - 1 ? (
                <Button
                  size="lg"
                  onClick={() => setStep((current) => current + 1)}
                  disabled={!canAdvance}
                  className="min-w-[10rem] shadow-[0_16px_35px_-18px_rgba(43,43,40,.85)]"
                >
                  {step === 0 ? tq.step0.submit : step === 1 ? tq.step1.submit : tq.step2.submit}
                  <Arrow />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={submit}
                  disabled={pending || !contactIsValid}
                  className="min-w-[11rem] shadow-[0_16px_35px_-18px_rgba(43,43,40,.85)]"
                >
                  {pending ? tq.step3.sending : tq.step3.submit}
                  {!pending && <Arrow />}
                </Button>
              )}
            </div>
          )}
        </div>

        {!compact && (
          <aside className="relative hidden min-h-[43rem] overflow-hidden bg-oak text-ivory lg:block">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-[url('/images/montreal-home-hero.png')] bg-cover bg-center opacity-45"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,28,26,.2)_0%,rgba(28,28,26,.72)_55%,rgba(28,28,26,.96)_100%)]"
          />
          <div aria-hidden="true" className="absolute inset-5 rounded-[1.8rem] border border-ivory/10" />

          <div className="relative flex h-full min-h-[43rem] flex-col justify-between p-9 xl:p-11">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-ivory/15 bg-soil/25 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/70 backdrop-blur-sm">
                {step + 1} · {stepShort(step)}
              </span>
              <span className="font-display text-2xl text-sand">0{step + 1}</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
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
                      {tq.capturedSoFar}
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
                          {servicesSelectedLabel(selectedServices.length)}
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
        )}
      </div>
    </div>
  );
}

const StepHeading = ({
  headingRef,
  overline,
  title,
  copy,
  compact,
}: {
  headingRef: React.RefObject<HTMLHeadingElement>;
  overline: string;
  title: string;
  copy: string;
  compact?: boolean;
}) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-cinnamon">
      {overline}
    </p>
    <h2
      ref={headingRef}
      tabIndex={-1}
      className={`mt-3 max-w-2xl text-balance font-display leading-[.98] text-oak outline-none ${compact ? "text-[2rem]" : "text-[2.55rem] md:text-[3.5rem]"}`}
    >
      {title}
    </h2>
    <p className={`mt-4 max-w-xl font-medium leading-relaxed text-soil/60 ${compact ? "text-xs md:text-sm" : "text-sm md:text-base"}`}>
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
