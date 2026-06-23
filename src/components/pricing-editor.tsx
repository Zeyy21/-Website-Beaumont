"use client";

import { useState, useTransition } from "react";
import { updateServicePricing } from "@/app/admin/actions";
import { Button } from "@/components/ui";
import { Card } from "@/components/dashboard-ui";

interface Service {
  id: string;
  name: string;
  base_price: number;
  rate_per_m2: number;
  multiplier: number;
}

/** Inline editor for service pricing fields kept for staff-side quote work. */
export function PricingEditor({ service }: { service: Service }) {
  const [base, setBase] = useState(service.base_price);
  const [rate, setRate] = useState(service.rate_per_m2);
  const [mult, setMult] = useState(service.multiplier);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = () =>
    start(async () => {
      setSaved(false);
      const res = await updateServicePricing(service.id, {
        base_price: base,
        rate_per_m2: rate,
        multiplier: mult,
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else setErr(res.error ?? "Failed");
    });

  return (
    <Card>
      <h3 className="text-lg text-oak">{service.name}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <NumField label="Base price ($)" value={base} onChange={setBase} step={5} />
        <NumField label="Legacy area field ($)" value={rate} onChange={setRate} step={0.1} />
        <NumField label="Multiplier" value={mult} onChange={setMult} step={0.05} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        {saved && <span className="text-sm text-green-700">Saved ✓</span>}
        {err && <span className="text-sm text-red-700">{err}</span>}
      </div>
    </Card>
  );
}

function NumField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-soil/60">{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        min={0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-oak/20 bg-white px-3 py-2 text-soil outline-none focus:border-ochre"
      />
    </label>
  );
}
