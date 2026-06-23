"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { addOns, frequencies, type FrequencyId } from "@/lib/config";
import type { ServiceCard } from "@/lib/data";
import { Button } from "@/components/ui";
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
const quoteReturnPath = "/?completeQuote=1#quote";

const steps = [
  { label: "Location", note: "Confirm address" },
  { label: "Scope", note: "Choose services" },
  { label: "Request", note: "Send details" },
] as const;

const propertySizes = [
  { id: "entry", label: "Entry or front walk", note: "Steps, walkway, or small paved area" },
  { id: "single", label: "Single surface", note: "Driveway, deck, patio, or one facade" },
  { id: "multi", label: "Multiple surfaces", note: "Two or more exterior areas" },
  { id: "full", label: "Full exterior package", note: "Whole-property exterior care" },
] as const;

const conditionOptions = [
  { id: "refresh", label: "Routine refresh", note: "Light buildup, seasonal care" },
  { id: "organic", label: "Algae or grime", note: "Visible green, black, or slippery areas" },
  { id: "stains", label: "Oil or rust stains", note: "Targeted stains needing review" },
  { id: "delicate", label: "Delicate surface", note: "Painted, older, wood, or soft-wash only" },
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
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    services[0]?.id ? [services[0].id] : [],
  );
  const [propertySize, setPropertySize] =
    useState<(typeof propertySizes)[number]["id"]>("single");
  const [condition, setCondition] =
    useState<(typeof conditionOptions)[number]["id"]>("refresh");
  const [frequency, setFrequency] = useState<FrequencyId>("one_time");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [scopeDetails, setScopeDetails] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<null | { ok: boolean; title: string; message?: string }>(null);
  const [pending, startTransition] = useTransition();
  const resumedRequest = useRef(false);
  const requestId = useRef("");

  const selectedServices = useMemo(
    () => services.filter((item) => selectedServiceIds.includes(item.id)),
    [services, selectedServiceIds],
  );
  const primaryService = selectedServices[0] ?? services[0];
  const propertySizeLabel =
    propertySizes.find((item) => item.id === propertySize)?.label ?? "Not selected";
  const conditionLabel =
    conditionOptions.find((item) => item.id === condition)?.label ?? "Not selected";
  const frequencyLabel =
    frequencies.find((item) => item.id === frequency)?.label ?? "Not selected";
  const serviceSummary = selectedServices.length
    ? selectedServices.map((item) => item.name).join(", ")
    : "Not selected";
  const canAdvance =
    step === 0 ? Boolean(place) : step === 1 ? selectedServiceIds.length > 0 : true;
  const contactIsValid =
    fullName.trim().length > 1 && /^\S+@\S+\.\S+$/.test(email.trim()) && phone.trim().length > 6;

  const sendRequest = useCallback((request: StoredQuoteRequest) => {
    startTransition(async () => {
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
        window.location.assign(
          `/login?mode=signup&next=${encodeURIComponent(quoteReturnPath)}`,
        );
        return;
      }
      if (response.ok) {
        window.localStorage.removeItem(pendingQuoteKey);
        window.history.replaceState({}, "", "/#quote");
        const delivered = response.notificationStatus === "sent";
        setResult({
          ok: true,
          title: delivered
            ? "Quote requested - we will get back to you within 24h"
            : "Quote received - we will get back to you within 24h",
          message: delivered
            ? undefined
            : "Your request is safely saved. Beaumont can see every detail in the client system while the notification is retried.",
        });
      } else {
        setResult({ ok: false, title: "Request not completed", message: response.error ?? "Something went wrong. Please try again." });
      }
    });
  }, []);

  useEffect(() => {
    if (resumedRequest.current) return;
    if (new URLSearchParams(window.location.search).get("completeQuote") !== "1") return;
    resumedRequest.current = true;

    const raw = window.localStorage.getItem(pendingQuoteKey);
    if (!raw) {
      setStep(2);
      setResult({ ok: false, title: "Quote details expired", message: "Please complete the request again." });
      return;
    }

    try {
      const stored = JSON.parse(raw) as StoredQuoteRequest;
      if (!stored.requestId) stored.requestId = window.crypto.randomUUID();
      if (!stored.expiresAt || stored.expiresAt < Date.now()) {
        window.localStorage.removeItem(pendingQuoteKey);
        setStep(2);
        setResult({ ok: false, title: "Quote details expired", message: "Please complete the request again." });
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
      setCondition(isCondition(stored.condition) ? stored.condition : "refresh");
      setFrequency(stored.frequency);
      setSelectedAddOns(stored.addOnIds);
      setScopeDetails(stored.scopeDetails ?? "");
      setFullName(stored.fullName);
      setEmail(stored.email);
      setPhone(stored.phone);
      requestId.current = stored.requestId;
      setStep(2);
      sendRequest(stored);
    } catch {
      window.localStorage.removeItem(pendingQuoteKey);
      setStep(2);
      setResult({ ok: false, title: "Quote could not be restored", message: "Please complete the request again." });
    }
  }, [sendRequest]);

  const toggleService = (id: string) => {
    setSelectedServiceIds((current) =>
      current.includes(id)
        ? current.length > 1
          ? current.filter((item) => item !== id)
          : current
        : [...current, id],
    );
  };

  const submit = () => {
    if (!primaryService || !place || selectedServiceIds.length === 0) return;
    if (!requestId.current) requestId.current = window.crypto.randomUUID();
    sendRequest({
      requestId: requestId.current,
      serviceId: primaryService.id,
      selectedServiceIds,
      address: place.label,
      areaM2: 0,
      frequency,
      addOnIds: selectedAddOns,
      propertySize,
      condition,
      scopeDetails,
      sourceZone: initialZone ?? null,
      fullName,
      email,
      phone,
      place,
      expiresAt: Date.now() + 60 * 60 * 1000,
    });
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-[2rem] border border-oak/10 bg-ivory/80 shadow-[0_30px_90px_-45px_rgba(29,23,15,.5)] backdrop-blur-sm md:rounded-[2.75rem]">
      <div className="border-b border-oak/10 px-4 py-4 md:px-8 md:py-5">
        <ol className="grid grid-cols-3 gap-2 md:gap-4" aria-label="Quote progress">
          {steps.map((item, index) => {
            const active = index === step;
            const complete = index < step;
            return (
              <li key={item.label} className="min-w-0">
                <button
                  type="button"
                  onClick={() => index <= step && setStep(index)}
                  disabled={index > step}
                  className={`flex w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-2xl px-2 py-2.5 text-left transition-colors duration-300 md:gap-3 md:px-4 ${
                    active ? "bg-sand/35" : complete ? "hover:bg-sand/20" : "cursor-default"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300 ${
                      active
                        ? "border-cinnamon bg-cinnamon text-ivory"
                        : complete
                          ? "border-ochre/35 bg-sand/50 text-oak"
                          : "border-oak/10 text-soil/35"
                    }`}
                  >
                    {complete ? <Check /> : index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-[11px] font-semibold md:text-sm ${active || complete ? "text-oak" : "text-soil/35"}`}>
                      {item.label}
                    </span>
                    <span className="hidden truncate text-[10px] text-soil/45 md:block">{item.note}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,.75fr)]">
        <div className="min-w-0 p-6 md:p-10 lg:p-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.48, ease }}
            >
              {step === 0 && (
                <div>
                  <StepHeading
                    number="01"
                    title="Where should we send the team?"
                    copy="Select the property address first. Beaumont reviews the surfaces, access, and route before confirming a written quote."
                  />
                  <div className="mt-8">
                    <AddressSearch onSelect={setPlace} />
                  </div>

                  <div className="mt-7 rounded-[1.5rem] border border-oak/10 bg-sand/20 p-6">
                    {place ? (
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cinnamon">Selected property</p>
                          <p className="mt-2 font-display text-3xl leading-tight text-oak">{place.label}</p>
                        </div>
                        <span className="rounded-full border border-oak/10 bg-ivory px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-soil/55">
                          Address confirmed
                        </span>
                      </div>
                    ) : (
                      <div className="mx-auto max-w-sm py-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-oak/10 bg-ivory text-cinnamon shadow-soft"><MapPin /></div>
                        <p className="mt-5 font-display text-2xl text-oak">Start with the address.</p>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-soil/55">We only need the location so the team can review the right property.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <StepHeading
                    number="02"
                    title="What needs care?"
                    copy="Choose every exterior service you are considering. We will review the scope and confirm the quote before any work is scheduled."
                  />

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {services.map((item) => {
                      const selected = selectedServiceIds.includes(item.id);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => toggleService(item.id)}
                          className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                            selected
                              ? "border-cinnamon bg-cinnamon/5 shadow-soft"
                              : "border-oak/10 bg-white/70 hover:border-cinnamon/30 hover:bg-white"
                          }`}
                        >
                          <span className="flex items-start justify-between gap-4">
                            <span>
                              <span className="block font-display text-2xl leading-tight text-oak">{item.name}</span>
                              <span className="mt-3 block text-sm font-medium leading-relaxed text-soil/55">{item.description}</span>
                            </span>
                            <span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                              selected ? "border-cinnamon bg-cinnamon text-ivory" : "border-oak/15 text-transparent"
                            }`}>
                              <Check />
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-9 grid gap-8 border-t border-oak/10 pt-8 lg:grid-cols-2">
                    <OptionGroup title="Scope size">
                      {propertySizes.map((item) => (
                        <OptionButton
                          key={item.id}
                          label={item.label}
                          note={item.note}
                          selected={propertySize === item.id}
                          onClick={() => setPropertySize(item.id)}
                        />
                      ))}
                    </OptionGroup>

                    <OptionGroup title="Surface condition">
                      {conditionOptions.map((item) => (
                        <OptionButton
                          key={item.id}
                          label={item.label}
                          note={item.note}
                          selected={condition === item.id}
                          onClick={() => setCondition(item.id)}
                        />
                      ))}
                    </OptionGroup>
                  </div>

                  <div className="mt-9 border-t border-oak/10 pt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-soil/55">Visit rhythm</h3>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {frequencies.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setFrequency(item.id)}
                          className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                            frequency === item.id ? "border-cinnamon bg-cinnamon text-ivory" : "border-oak/10 bg-white/70 text-soil/65 hover:border-cinnamon/30"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-9 border-t border-oak/10 pt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-soil/55">Additional review items</h3>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {addOns.map((item) => {
                        const selected = selectedAddOns.includes(item.id);
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setSelectedAddOns((current) => selected ? current.filter((id) => id !== item.id) : [...current, item.id])}
                            className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition-colors ${selected ? "border-cinnamon bg-cinnamon/5" : "border-oak/10 bg-white/70 hover:border-cinnamon/30"}`}
                          >
                            <span className="font-medium text-oak">{item.label}</span>
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-soil/45">{selected ? "Selected" : "Optional"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className="mt-8 block text-sm font-semibold text-oak">
                    Notes for the team
                    <textarea
                      value={scopeDetails}
                      onChange={(event) => setScopeDetails(event.target.value)}
                      rows={4}
                      placeholder="Example: interlock driveway, front steps, second-floor windows, older brick facade, side gate access..."
                      className="mt-2 w-full resize-none rounded-xl border border-oak/15 bg-ivory/70 px-4 py-3 font-medium text-oak outline-none transition placeholder:text-soil/35 focus:border-cinnamon focus:ring-2 focus:ring-cinnamon/10"
                    />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div>
                  <StepHeading
                    number="03"
                    title="Send the request."
                    copy="No payment is taken here. Beaumont will review the scope and reply with a confirmed quote."
                  />

                  <div className="mt-8 rounded-2xl border border-oak/10 bg-white/75 p-6 md:p-7">
                    <dl className="grid gap-5 text-sm sm:grid-cols-2">
                      <SummaryRow label="Address" value={place?.label ?? "Not selected"} />
                      <SummaryRow label="Services" value={serviceSummary} />
                      <SummaryRow label="Scope" value={propertySizeLabel} />
                      <SummaryRow label="Condition" value={conditionLabel} />
                      <SummaryRow label="Visit rhythm" value={frequencyLabel} />
                      <SummaryRow
                        label="Review items"
                        value={
                          selectedAddOns.length
                            ? selectedAddOns
                                .map((id) => addOns.find((item) => item.id === id)?.label)
                                .filter(Boolean)
                                .join(", ")
                            : "None selected"
                        }
                      />
                    </dl>
                    {scopeDetails.trim() && (
                      <p className="mt-5 border-t border-oak/10 pt-5 text-sm font-medium leading-relaxed text-soil/65">
                        {scopeDetails.trim()}
                      </p>
                    )}
                  </div>

                  {!result && (
                    <div className="mt-6 rounded-2xl border border-oak/10 bg-white/55 p-6 md:p-7">
                      <div className="mb-5">
                        <p className="font-display text-2xl text-oak">Where should we reach you?</p>
                        <p className="mt-1 text-sm font-medium text-soil/55">We use these details only to review and respond to this request.</p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <QuoteField label="Full name" value={fullName} onChange={setFullName} autoComplete="name" />
                        <QuoteField label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
                        <div className="sm:col-span-2">
                          <QuoteField label="Phone" value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
                        </div>
                      </div>
                    </div>
                  )}

                  {result ? (
                    <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 rounded-2xl border p-7 text-center ${result.ok ? "border-ochre/25 bg-sand/25" : "border-red-900/15 bg-red-50/60"}`}>
                      <p className="font-display text-3xl text-oak">{result.title}</p>
                      {result.message && <p className="mt-3 text-sm font-medium leading-relaxed text-soil/65">{result.message}</p>}
                      <Button className="mt-6" variant="outline" onClick={() => { setResult(null); if (result.ok) { requestId.current = ""; setStep(0); } }}>{result.ok ? "New request" : "Try again"}</Button>
                    </motion.div>
                  ) : (
                    <Button className="mt-6 w-full" size="lg" disabled={pending || !contactIsValid} onClick={submit}>{pending ? "Sending..." : "Request formal quote"}</Button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {!result && (
            <div className="mt-10 flex items-center justify-between border-t border-oak/10 pt-6">
              <Button variant="ghost" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className={step === 0 ? "pointer-events-none opacity-0" : ""}>Back</Button>
              {step < steps.length - 1 && (
                <Button onClick={() => setStep((current) => current + 1)} disabled={!canAdvance}>
                  Continue <Arrow />
                </Button>
              )}
            </div>
          )}
        </div>

        <aside className="border-t border-ivory/10 bg-soil p-6 text-ivory md:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className="lg:sticky lg:top-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sand/75">Quote review</p>
            <div className="mt-5 min-h-[7rem]">
              <p className="font-display text-4xl leading-tight text-ivory">Review first. Clear quote next.</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/55">
                Select the surfaces you actually want serviced. Beaumont confirms pricing after reviewing access, material, and condition.
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-5 border-t border-ivory/15 pt-7 text-sm lg:grid-cols-1">
              <SummaryRow label="Address" value={place?.label ?? "Not selected"} dark />
              <SummaryRow label="Services" value={selectedServices.length ? `${selectedServices.length} selected` : "Not selected"} dark />
              <SummaryRow label="Scope" value={propertySizeLabel} dark />
              <SummaryRow label="Condition" value={conditionLabel} dark />
              <SummaryRow label="Frequency" value={frequencyLabel} dark />
              <SummaryRow label="Extras" value={selectedAddOns.length ? `${selectedAddOns.length} selected` : "None"} dark />
            </dl>
            <p className="mt-8 border-t border-ivory/15 pt-6 text-xs leading-relaxed text-ivory/50">
              No measurement step and no payment at this step.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepHeading({ number, title, copy }: { number: string; title: string; copy: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-cinnamon">Step {number}</p>
      <h3 className="mt-3 font-display text-4xl leading-tight text-oak md:text-5xl">{title}</h3>
      <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-soil/65">{copy}</p>
    </div>
  );
}

function isPropertySize(value: string | undefined): value is (typeof propertySizes)[number]["id"] {
  return propertySizes.some((item) => item.id === value);
}

function isCondition(value: string | undefined): value is (typeof conditionOptions)[number]["id"] {
  return conditionOptions.some((item) => item.id === value);
}

function OptionGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-soil/55">{title}</h3>
      <div className="mt-4 grid gap-2">{children}</div>
    </div>
  );
}

function OptionButton({
  label,
  note,
  selected,
  onClick,
}: {
  label: string;
  note: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
        selected ? "border-cinnamon bg-cinnamon/5" : "border-oak/10 bg-white/70 hover:border-cinnamon/30"
      }`}
    >
      <span className="block font-medium text-oak">{label}</span>
      <span className="mt-1 block text-xs leading-relaxed text-soil/50">{note}</span>
    </button>
  );
}

function SummaryRow({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-ivory/45" : "text-soil/45"}`}>{label}</dt>
      <dd className={`mt-1 break-words font-medium ${dark ? "text-ivory/85" : "text-oak"}`}>{value}</dd>
    </div>
  );
}

function QuoteField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete: string;
}) {
  return (
    <label className="block text-sm font-semibold text-oak">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
        className="mt-2 h-12 w-full rounded-xl border border-oak/15 bg-ivory/70 px-4 font-medium text-oak outline-none transition focus:border-cinnamon focus:ring-2 focus:ring-cinnamon/10"
      />
    </label>
  );
}

function Check() {
  return <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 8 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function MapPin() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

function Arrow() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
