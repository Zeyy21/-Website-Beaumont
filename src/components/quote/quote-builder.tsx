"use client";

import { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { addOns, frequencies, type FrequencyId } from "@/lib/config";
import { computeQuote, formatCurrency, m2ToFt2 } from "@/lib/pricing";
import type { ServiceCard } from "@/lib/data";
import { Button } from "@/components/ui";
import { AddressSearch } from "./address-search";
import { saveQuote } from "@/app/(site)/quote/actions";
import { AnimatedPrice } from "./animated-price";

// Leaflet touches window → load only on the client.
const MapCanvas = dynamic(() => import("./map-canvas").then((m) => m.MapCanvas), {
  ssr: false,
  loading: () => (
    <div className="h-[440px] w-full animate-pulse rounded-3xl bg-sand/40 md:h-[540px]" />
  ),
});

interface Place {
  label: string;
  lat: number;
  lon: number;
}

const steps = ["Location", "Service", "Estimate"] as const;

export function QuoteBuilder({
  services,
  initialZone,
}: {
  services: ServiceCard[];
  initialZone?: string | null;
}) {
  const [step, setStep] = useState(0);
  const [place, setPlace] = useState<Place | null>(null);
  const [areaM2, setAreaM2] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  // Prop-driven map control (refs don't survive next/dynamic). Bump to trigger.
  const [drawNonce, setDrawNonce] = useState(0);
  const [clearNonce, setClearNonce] = useState(0);
  const [zoomNonce, setZoomNonce] = useState(0);

  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [frequency, setFrequency] = useState<FrequencyId>("biweekly");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [result, setResult] = useState<null | {
    message: string;
    persisted: boolean;
  }>(null);
  const [pending, startTransition] = useTransition();

  const service = services.find((s) => s.id === serviceId) ?? services[0];

  const quote = useMemo(
    () =>
      service
        ? computeQuote({ service, areaM2, frequency, addOnIds: selectedAddOns })
        : null,
    [service, areaM2, frequency, selectedAddOns],
  );

  const canAdvance = step === 0 ? areaM2 > 0 : true;

  const submit = (intent: "save" | "request") => {
    if (!service || !place) return;
    startTransition(async () => {
      const res = await saveQuote({
        serviceId: service.id,
        address: place.label,
        areaM2,
        frequency,
        addOnIds: selectedAddOns,
        sourceZone: initialZone ?? null,
        intent,
      });
      if (res.needsAuth) {
        // Preserve intent through login.
        const params = new URLSearchParams({ next: "/quote", intent });
        window.location.href = `/login?${params.toString()}`;
        return;
      }
      if (res.ok) {
        setResult({
          persisted: !res.error,
          message:
            intent === "request"
              ? "Your request is in. We'll confirm a final quote by email shortly."
              : res.error === "preview"
                ? "This is a live preview. Connect accounts to save quotes to your profile."
                : "Saved to your profile.",
        });
      } else {
        setResult({
          persisted: false,
          message: res.error ?? "Something went wrong. Please try again.",
        });
      }
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      {/* ───── left: stepper + inputs ───── */}
      <div>
        {/* progress */}
        <ol className="mb-10 flex items-center gap-2">
          {steps.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <button
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  i === step
                    ? "bg-cinnamon text-ivory shadow-soft scale-105"
                    : i < step
                      ? "bg-ochre/30 text-oak hover:bg-ochre/40"
                      : "bg-oak/5 text-soil/40"
                }`}
              >
                {i + 1}
              </button>
              <span
                className={`hidden text-sm sm:block transition-colors duration-300 ${i === step ? "text-oak font-medium" : "text-soil/50"}`}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className="relative flex-1 h-px bg-oak/10 overflow-hidden">
                  {i < step && (
                     <motion.div 
                        layoutId={`line-${i}`}
                        className="absolute inset-0 bg-cinnamon/30" 
                     />
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl text-oak tracking-tight">Where is your home?</h2>
                  <p className="mt-2 text-soil/70 text-lg">
                    Search your address, then click <span className="font-medium text-oak">Start Drawing</span> to trace your property and measure its area.
                  </p>
                </div>
                <AddressSearch onSelect={setPlace} />

                <div className="relative">
                  <MapCanvas
                    center={place ? { lat: place.lat, lon: place.lon } : null}
                    drawNonce={drawNonce}
                    clearNonce={clearNonce}
                    zoomNonce={zoomNonce}
                    onAreaChange={setAreaM2}
                    onDrawingChange={setIsDrawing}
                  />

                  {/* drawing hint banner */}
                  {isDrawing && (
                    <div className="pointer-events-none absolute left-1/2 top-4 z-[400] -translate-x-1/2 rounded-full bg-soil/90 px-4 py-2 text-sm text-ivory shadow-lift backdrop-blur">
                      Click each corner of your property · double-click to finish
                    </div>
                  )}

                  {/* control bar (always visible) */}
                  <div className="absolute bottom-4 left-4 right-4 z-[400] flex items-end justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-oak/10 bg-white/90 p-2 shadow-soft backdrop-blur-md">
                      {isDrawing ? (
                        <>
                          <span className="flex items-center gap-2 px-2 text-sm font-medium text-cinnamon">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-cinnamon" />
                            Drawing…
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setClearNonce((n) => n + 1)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => setDrawNonce((n) => n + 1)}>
                            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            {areaM2 > 0 ? "Redraw" : "Draw your property"}
                          </Button>
                          {areaM2 > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setClearNonce((n) => n + 1)}
                            >
                              Clear
                            </Button>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 rounded-2xl border border-oak/10 bg-white/90 p-1.5 shadow-soft backdrop-blur-md">
                      <button
                        aria-label="Zoom in"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-lg text-oak shadow-sm transition-colors hover:bg-sand"
                        onClick={() => setZoomNonce((n) => (n <= 0 ? 1 : n + 1))}
                      >
                        +
                      </button>
                      <button
                        aria-label="Zoom out"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-lg text-oak shadow-sm transition-colors hover:bg-sand"
                        onClick={() => setZoomNonce((n) => (n >= 0 ? -1 : n - 1))}
                      >
                        −
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-sand/40 px-6 py-5 border border-oak/5">
                  <span className="text-soil/80 font-medium">Measured area</span>
                  <span className="font-display text-2xl text-oak tracking-tight">
                    {areaM2 > 0
                      ? `${areaM2.toLocaleString()} m² · ${Math.round(
                          m2ToFt2(areaM2),
                        ).toLocaleString()} ft²`
                      : <span className="text-soil/40 text-xl">Draw to measure</span>}
                  </span>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-10">
                <div>
                  <h2 className="text-3xl text-oak tracking-tight">Choose your service</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setServiceId(s.id)}
                        className={`group rounded-2xl border p-6 text-left transition-all duration-300 ${
                          serviceId === s.id
                            ? "border-cinnamon bg-cinnamon/5 shadow-soft scale-[1.02]"
                            : "border-oak/10 bg-white hover:border-cinnamon/30 hover:shadow-soft"
                        }`}
                      >
                        <span className="block text-xl text-oak font-medium group-hover:text-cinnamon transition-colors">{s.name}</span>
                        <span className="mt-2 block text-sm text-soil/60">
                          From {formatCurrency(s.base_price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-oak tracking-tight">How often?</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {frequencies.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFrequency(f.id)}
                        className={`rounded-xl border px-4 py-3.5 text-center text-sm transition-all duration-200 ${
                          frequency === f.id
                            ? "border-cinnamon bg-cinnamon text-ivory shadow-soft scale-105"
                            : "border-oak/10 bg-white text-soil/70 hover:border-cinnamon/30"
                        }`}
                      >
                        <span className="block font-medium">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-oak tracking-tight">Add a finishing touch</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {addOns.map((a) => {
                      const on = selectedAddOns.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() =>
                            setSelectedAddOns((prev) =>
                              on
                                ? prev.filter((x) => x !== a.id)
                                : [...prev, a.id],
                            )
                          }
                          className={`flex items-center justify-between rounded-xl border px-5 py-4 text-sm transition-all duration-200 ${
                            on
                              ? "border-cinnamon bg-cinnamon/5 shadow-sm"
                              : "border-oak/10 bg-white hover:border-cinnamon/30"
                          }`}
                        >
                          <span className={`font-medium ${on ? "text-cinnamon" : "text-oak"}`}>{a.label}</span>
                          <span className="text-soil/60">
                            +{formatCurrency(a.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && quote && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl text-oak tracking-tight">Your instant estimate</h2>
                  <p className="mt-2 text-soil/70 text-lg">
                    {place?.label ?? "Your home"} · <span className="font-medium text-oak">{service?.name}</span>
                  </p>
                </div>

                <div className="rounded-3xl border border-oak/10 bg-white p-8 shadow-soft">
                  <ul className="space-y-4">
                    {quote.lineItems.map((li, i) => (
                      <li
                        key={i}
                        className="flex justify-between text-base text-soil/80 border-b border-oak/5 pb-4 last:border-0 last:pb-0"
                      >
                        <span>{li.label}</span>
                        <span className="tabular-nums font-medium text-oak">
                          {formatCurrency(li.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-ochre/30 bg-gradient-to-br from-sand/40 to-sand/20 p-8 text-center shadow-soft"
                  >
                    <p className="font-display text-3xl text-oak">
                      {result.persisted ? "All set" : "Estimate ready"}
                    </p>
                    <p className="mt-3 text-soil/70 text-lg">{result.message}</p>
                    <div className="mt-6 flex justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setResult(null);
                          setStep(0);
                        }}
                      >
                        New quote
                      </Button>
                      <a href="/dashboard">
                        <Button>Go to dashboard</Button>
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row pt-4">
                    <Button
                      className="flex-1 py-6 text-lg"
                      disabled={pending}
                      onClick={() => submit("request")}
                    >
                      {pending ? "Sending…" : "Request formal quote"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 py-6 text-lg"
                      disabled={pending}
                      onClick={() => submit("save")}
                    >
                      Save to my account
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* nav buttons */}
        {!result && (
          <div className="mt-12 flex justify-between border-t border-oak/10 pt-6">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={step === 0 ? "opacity-0 pointer-events-none" : ""}
            >
              Back
            </Button>
            {step < steps.length - 1 && (
              <Button 
                onClick={() => setStep((s) => s + 1)} 
                disabled={!canAdvance}
                className={!canAdvance ? "opacity-50" : ""}
              >
                Continue to {steps[step + 1]}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ───── right: sticky live price ───── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="texture-soil rounded-3xl p-8 text-ivory shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ivory/5 to-transparent pointer-events-none" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand/80">
            Estimated visit
          </p>
          <div className="mt-4 min-h-[100px]">
             {quote && areaM2 > 0 ? (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                 <AnimatedPrice value={quote.total} />
                 <p className="mt-2 text-ivory/60 text-sm">
                   Typically {formatCurrency(quote.low)} – {formatCurrency(quote.high)}
                 </p>
               </motion.div>
             ) : (
               <p className="font-display text-3xl text-ivory/40 leading-tight">
                 Draw your space to see a price
               </p>
             )}
          </div>

          <div className="mt-8 space-y-3 border-t border-ivory/10 pt-8 text-sm text-ivory/70">
            <Row label="Service" value={service?.name ?? ", "} />
            <Row
              label="Area"
              value={areaM2 > 0 ? `${areaM2.toLocaleString()} m²` : ", "}
            />
            <Row
              label="Frequency"
              value={frequencies.find((f) => f.id === frequency)?.label ?? ", "}
            />
            <Row
              label="Add-ons"
              value={selectedAddOns.length ? `${selectedAddOns.length} selected` : "None"}
            />
          </div>
          <p className="mt-8 text-xs text-ivory/30 leading-relaxed">
            Final price confirmed after a quick review. No charge to request.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ivory/40">{label}</span>
      <span className="text-right text-ivory/90 font-medium">{value}</span>
    </div>
  );
}
