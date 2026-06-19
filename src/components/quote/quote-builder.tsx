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
const MapCanvas = dynamic(
  () => import("./map-canvas").then((m) => m.MapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full animate-pulse rounded-2xl bg-sand/40 md:h-[520px]" />
    ),
  },
);

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
        <ol className="mb-8 flex items-center gap-2">
          {steps.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <button
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  i === step
                    ? "bg-cinnamon text-ivory"
                    : i < step
                      ? "bg-ochre/30 text-oak"
                      : "bg-oak/10 text-soil/40"
                }`}
              >
                {i + 1}
              </button>
              <span
                className={`hidden text-sm sm:block ${i === step ? "text-oak" : "text-soil/50"}`}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <span className="h-px flex-1 bg-oak/15" />
              )}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl text-oak">Where is your home?</h2>
                  <p className="mt-1 text-soil/60">
                    Search your address, then trace your property with the{" "}
                    <span className="font-medium text-oak">polygon tool</span> on
                    the map to measure its area.
                  </p>
                </div>
                <AddressSearch onSelect={setPlace} />
                <MapCanvas
                  center={place ? { lat: place.lat, lon: place.lon } : null}
                  onAreaChange={setAreaM2}
                />
                <div className="flex items-center justify-between rounded-2xl bg-sand/40 px-5 py-4">
                  <span className="text-soil/70">Measured area</span>
                  <span className="font-display text-2xl text-oak">
                    {areaM2 > 0
                      ? `${areaM2.toLocaleString()} m² · ${Math.round(
                          m2ToFt2(areaM2),
                        ).toLocaleString()} ft²`
                      : "Draw to measure"}
                  </span>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl text-oak">Choose your service</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setServiceId(s.id)}
                        className={`rounded-2xl border p-5 text-left transition-all ${
                          serviceId === s.id
                            ? "border-cinnamon bg-cinnamon/5 shadow-soft"
                            : "border-oak/15 bg-white hover:border-ochre/40"
                        }`}
                      >
                        <span className="block text-lg text-oak">{s.name}</span>
                        <span className="mt-1 block text-sm text-soil/60">
                          From {formatCurrency(s.base_price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-oak">How often?</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {frequencies.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFrequency(f.id)}
                        className={`rounded-xl border px-4 py-3 text-center text-sm transition-all ${
                          frequency === f.id
                            ? "border-cinnamon bg-cinnamon/5 text-oak"
                            : "border-oak/15 text-soil/70 hover:border-ochre/40"
                        }`}
                      >
                        <span className="block font-medium">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-oak">Add a finishing touch</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
                            on
                              ? "border-cinnamon bg-cinnamon/5"
                              : "border-oak/15 hover:border-ochre/40"
                          }`}
                        >
                          <span className="text-oak">{a.label}</span>
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
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl text-oak">Your instant estimate</h2>
                  <p className="mt-1 text-soil/60">
                    {place?.label ?? "Your home"} · {service?.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-oak/10 bg-white p-6">
                  <ul className="space-y-3">
                    {quote.lineItems.map((li, i) => (
                      <li
                        key={i}
                        className="flex justify-between text-sm text-soil/75"
                      >
                        <span>{li.label}</span>
                        <span className="tabular-nums">
                          {formatCurrency(li.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result ? (
                  <div className="rounded-2xl border border-ochre/30 bg-sand/30 p-6 text-center">
                    <p className="font-display text-2xl text-oak">
                      {result.persisted ? "All set" : "Estimate ready"}
                    </p>
                    <p className="mt-2 text-soil/70">{result.message}</p>
                    <div className="mt-4 flex justify-center gap-3">
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
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="flex-1"
                      disabled={pending}
                      onClick={() => submit("request")}
                    >
                      {pending ? "Sending…" : "Request formal quote"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
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
          <div className="mt-8 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < steps.length - 1 && (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance}>
                Continue
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ───── right: sticky live price ───── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="texture-soil rounded-3xl p-8 text-ivory">
          <p className="text-sm uppercase tracking-widest text-sand">
            Estimated visit
          </p>
          {quote && areaM2 > 0 ? (
            <>
              <AnimatedPrice value={quote.total} />
              <p className="mt-1 text-ivory/60">
                Typically {formatCurrency(quote.low)} – {formatCurrency(quote.high)}
              </p>
            </>
          ) : (
            <p className="mt-3 font-display text-3xl text-ivory/50">
              Draw your space to see a price
            </p>
          )}

          <div className="mt-6 space-y-2 border-t border-ivory/15 pt-6 text-sm text-ivory/70">
            <Row label="Service" value={service?.name ?? "—"} />
            <Row
              label="Area"
              value={areaM2 > 0 ? `${areaM2.toLocaleString()} m²` : "—"}
            />
            <Row
              label="Frequency"
              value={frequencies.find((f) => f.id === frequency)?.label ?? "—"}
            />
            <Row
              label="Add-ons"
              value={selectedAddOns.length ? `${selectedAddOns.length} selected` : "None"}
            />
          </div>
          <p className="mt-6 text-xs text-ivory/40">
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
      <span className="text-ivory/50">{label}</span>
      <span className="text-right text-ivory/90">{value}</span>
    </div>
  );
}
