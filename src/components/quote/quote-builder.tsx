"use client";

import { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { addOns, frequencies, type FrequencyId } from "@/lib/config";
import { computeQuote, formatCurrency, m2ToFt2 } from "@/lib/pricing";
import type { ServiceCard } from "@/lib/data";
import { Button, ButtonLink } from "@/components/ui";
import { AddressSearch } from "./address-search";
import { saveQuote } from "@/app/(site)/quote/actions";
import { AnimatedPrice } from "./animated-price";

const MapCanvas = dynamic(() => import("./map-canvas").then((module) => module.MapCanvas), {
  ssr: false,
  loading: () => <div className="h-[320px] w-full animate-pulse rounded-[1.5rem] bg-sand/30 md:h-[400px]" />,
});

interface Place {
  label: string;
  lat: number;
  lon: number;
}

const steps = [
  { label: "Location", note: "Map the space" },
  { label: "Service", note: "Choose the care" },
  { label: "Estimate", note: "Review the price" },
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
  const [areaM2, setAreaM2] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawNonce, setDrawNonce] = useState(0);
  const [clearNonce, setClearNonce] = useState(0);
  const [zoomNonce, setZoomNonce] = useState(0);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [frequency, setFrequency] = useState<FrequencyId>("biweekly");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [result, setResult] = useState<null | { message: string; persisted: boolean }>(null);
  const [pending, startTransition] = useTransition();

  const service = services.find((item) => item.id === serviceId) ?? services[0];
  const quote = useMemo(
    () =>
      service
        ? computeQuote({ service, areaM2, frequency, addOnIds: selectedAddOns })
        : null,
    [service, areaM2, frequency, selectedAddOns],
  );
  const canAdvance = step === 0 ? Boolean(place) && areaM2 > 0 : true;

  const submit = (intent: "save" | "request") => {
    if (!service || !place) return;
    startTransition(async () => {
      const response = await saveQuote({
        serviceId: service.id,
        address: place.label,
        areaM2,
        frequency,
        addOnIds: selectedAddOns,
        sourceZone: initialZone ?? null,
        intent,
      });
      if (response.needsAuth) {
        const params = new URLSearchParams({ next: "/#quote", intent });
        window.location.href = `/login?${params.toString()}`;
        return;
      }
      if (response.ok) {
        setResult({
          persisted: !response.error,
          message:
            intent === "request"
              ? "Your request is in. We’ll confirm a final quote by email shortly."
              : response.error === "preview"
                ? "This is a live preview. Connect accounts to save quotes to your profile."
                : "Saved to your profile.",
        });
      } else {
        setResult({ persisted: false, message: response.error ?? "Something went wrong. Please try again." });
      }
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
                  <StepHeading number="01" title="Where is your home?" copy="Select the address first. We’ll move the map directly to the property for you to trace." />
                  <div className="mt-8">
                    <AddressSearch
                      onSelect={(selection) => {
                        setPlace(selection);
                        setAreaM2(0);
                        setClearNonce((nonce) => nonce + 1);
                      }}
                    />
                  </div>

                  {place ? (
                    <div className="mt-7">
                      <div className="relative overflow-hidden rounded-[1.5rem]">
                        <MapCanvas
                          center={{ lat: place.lat, lon: place.lon }}
                          drawNonce={drawNonce}
                          clearNonce={clearNonce}
                          zoomNonce={zoomNonce}
                          onAreaChange={setAreaM2}
                          onDrawingChange={setIsDrawing}
                        />

                        {isDrawing && (
                          <div className="pointer-events-none absolute left-1/2 top-4 z-[400] -translate-x-1/2 whitespace-nowrap rounded-full bg-soil/90 px-4 py-2 text-xs font-medium text-ivory shadow-soft backdrop-blur-md md:text-sm">
                            Select each corner · double-click to finish
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 z-[400] flex items-end justify-between gap-2 md:bottom-4 md:left-4 md:right-4">
                          <div className="flex items-center gap-2 rounded-full border border-oak/10 bg-ivory/90 p-1.5 shadow-soft backdrop-blur-xl">
                            {isDrawing ? (
                              <>
                                <span className="flex items-center gap-2 px-2 text-xs font-semibold text-cinnamon md:text-sm">
                                  <span className="h-2 w-2 animate-pulse rounded-full bg-cinnamon" /> Drawing
                                </span>
                                <Button variant="outline" size="sm" onClick={() => setClearNonce((nonce) => nonce + 1)}>Cancel</Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" onClick={() => setDrawNonce((nonce) => nonce + 1)}>
                                  {areaM2 > 0 ? "Redraw" : "Draw property"}
                                </Button>
                                {areaM2 > 0 && <Button variant="ghost" size="sm" onClick={() => setClearNonce((nonce) => nonce + 1)}>Clear</Button>}
                              </>
                            )}
                          </div>
                          <div className="flex rounded-full border border-oak/10 bg-ivory/90 p-1 shadow-soft backdrop-blur-xl">
                            <button type="button" aria-label="Zoom out" className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-oak hover:bg-sand/40" onClick={() => setZoomNonce((nonce) => (nonce >= 0 ? -1 : nonce - 1))}>−</button>
                            <button type="button" aria-label="Zoom in" className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-oak hover:bg-sand/40" onClick={() => setZoomNonce((nonce) => (nonce <= 0 ? 1 : nonce + 1))}>+</button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-oak/10 bg-sand/25 px-5 py-4">
                        <span className="text-sm font-medium text-soil/60">Measured area</span>
                        <span className="text-right font-display text-2xl text-oak">
                          {areaM2 > 0 ? `${areaM2.toLocaleString()} m² · ${Math.round(m2ToFt2(areaM2)).toLocaleString()} ft²` : "Draw to measure"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-7 flex min-h-[17rem] items-center justify-center rounded-[1.5rem] border border-dashed border-oak/15 bg-sand/15 px-8 text-center">
                      <div className="max-w-sm">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-oak/10 bg-ivory text-cinnamon shadow-soft"><MapPin /></div>
                        <p className="mt-5 font-display text-2xl text-oak">Your map will appear here.</p>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-soil/55">Search and select an address to begin measuring the property.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div>
                  <StepHeading number="02" title="Choose the care." copy="Select the service and cadence. Add only the finishing touches the property needs." />
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {services.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setServiceId(item.id)}
                        className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                          serviceId === item.id
                            ? "border-cinnamon bg-cinnamon/5 shadow-soft"
                            : "border-oak/10 bg-white/70 hover:border-cinnamon/30 hover:bg-white"
                        }`}
                      >
                        <span className="block font-display text-2xl leading-tight text-oak">{item.name}</span>
                        <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.16em] text-cinnamon">From {formatCurrency(item.base_price)}</span>
                      </button>
                    ))}
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
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-soil/55">Finishing touches</h3>
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
                            <span className="text-soil/55">+{formatCurrency(item.price)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && quote && (
                <div>
                  <StepHeading number="03" title="Review your estimate." copy={`${place?.label ?? "Your property"} · ${service?.name ?? "Selected service"}`} />
                  <div className="mt-8 rounded-2xl border border-oak/10 bg-white/75 p-6 md:p-7">
                    <ul className="divide-y divide-oak/10">
                      {quote.lineItems.map((item, index) => (
                        <li key={index} className="flex justify-between gap-5 py-4 first:pt-0 last:pb-0">
                          <span className="text-sm font-medium text-soil/65">{item.label}</span>
                          <span className="font-medium tabular-nums text-oak">{formatCurrency(item.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result ? (
                    <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-ochre/25 bg-sand/25 p-7 text-center">
                      <p className="font-display text-3xl text-oak">{result.persisted ? "All set" : "Estimate ready"}</p>
                      <p className="mt-3 text-sm font-medium leading-relaxed text-soil/65">{result.message}</p>
                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button variant="outline" onClick={() => { setResult(null); setStep(0); }}>New quote</Button>
                        <ButtonLink href="/dashboard">Dashboard</ButtonLink>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Button size="lg" disabled={pending} onClick={() => submit("request")}>{pending ? "Sending…" : "Request formal quote"}</Button>
                      <Button size="lg" variant="outline" disabled={pending} onClick={() => submit("save")}>Save to my account</Button>
                    </div>
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sand/75">Live estimate</p>
            <div className="mt-5 min-h-[7rem]">
              {quote && areaM2 > 0 ? (
                <motion.div key={quote.total} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
                  <AnimatedPrice value={quote.total} />
                  <p className="mt-2 text-sm text-ivory/65">Typically {formatCurrency(quote.low)} – {formatCurrency(quote.high)}</p>
                </motion.div>
              ) : (
                <div>
                  <p className="font-display text-3xl leading-tight text-ivory/80">Your price will appear here.</p>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/55">Select an address and draw the service area to calculate the estimate.</p>
                </div>
              )}
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-5 border-t border-ivory/15 pt-7 text-sm lg:grid-cols-1">
              <SummaryRow label="Service" value={service?.name ?? "Not selected"} />
              <SummaryRow label="Area" value={areaM2 > 0 ? `${areaM2.toLocaleString()} m²` : "Not measured"} />
              <SummaryRow label="Frequency" value={frequencies.find((item) => item.id === frequency)?.label ?? "Not selected"} />
              <SummaryRow label="Add-ons" value={selectedAddOns.length ? `${selectedAddOns.length} selected` : "None"} />
            </dl>
            <p className="mt-8 border-t border-ivory/15 pt-6 text-xs leading-relaxed text-ivory/50">No charge to request. Final pricing is confirmed after a quick review of access and surface condition.</p>
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory/45">{label}</dt>
      <dd className="mt-1 truncate font-medium text-ivory/85">{value}</dd>
    </div>
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
