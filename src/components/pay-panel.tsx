"use client";

import { useState, useTransition } from "react";
import { stripeEnabled } from "@/lib/payments";
import {
  recordManualPayment,
  startCardPayment,
} from "@/app/dashboard/payments/actions";
import { formatCurrency } from "@/lib/pricing";
import { Button } from "@/components/ui";

/** Lets a customer settle an accepted quote by card, transfer, or cash. */
export function PayPanel({
  quoteId,
  amount,
  cardEnabled,
}: {
  quoteId: string;
  amount: number;
  /** Server-evaluated stripeEnabled; falls back to the client constant. */
  cardEnabled?: boolean;
}) {
  const canCard = cardEnabled ?? stripeEnabled;
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const manual = (method: "transfer" | "cash") =>
    start(async () => {
      const res = await recordManualPayment(quoteId, amount, method);
      setMsg(res.message ?? res.error ?? null);
    });

  const card = () =>
    start(async () => {
      const res = await startCardPayment(quoteId, amount);
      if (res.url) window.location.href = res.url;
      else if (res.disabled)
        setMsg("Card payments aren't enabled yet — choose transfer or cash.");
      else setMsg(res.error ?? "Could not start payment.");
    });

  if (msg) {
    return (
      <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
        {msg}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-soil/60">
        Settle {formatCurrency(amount)} by your preferred method:
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={card} disabled={pending || !canCard} size="sm">
          {canCard ? "Pay by card" : "Card (coming soon)"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => manual("transfer")} disabled={pending}>
          Bank transfer
        </Button>
        <Button variant="outline" size="sm" onClick={() => manual("cash")} disabled={pending}>
          Cash on service
        </Button>
      </div>
      {!canCard && (
        <p className="text-xs text-soil/40">
          Card payments activate once Stripe keys are added. Transfer and cash
          work today.
        </p>
      )}
    </div>
  );
}
