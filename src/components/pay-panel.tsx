"use client";

import { useState, useTransition } from "react";
import { stripeEnabled } from "@/lib/payments";
import {
  recordManualPayment,
  startCardPayment,
} from "@/app/dashboard/payments/actions";
import { formatCurrency } from "@/lib/pricing";
import { Button } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";

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
  const { dict } = useT();
  const t = dict.dashboard.payments;
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
        setMsg(t.cardNotEnabled);
      else setMsg(res.error ?? t.couldNotStart);
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
        {t.settle} {formatCurrency(amount)} {t.byMethod}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={card} disabled={pending || !canCard} size="sm">
          {canCard ? t.payByCard : t.cardComingSoon}
        </Button>
        <Button variant="outline" size="sm" onClick={() => manual("transfer")} disabled={pending}>
          {t.bankTransfer}
        </Button>
        <Button variant="outline" size="sm" onClick={() => manual("cash")} disabled={pending}>
          {t.cashOnService}
        </Button>
      </div>
      {!canCard && (
        <p className="text-xs text-soil/40">
          {t.cardActivateNote}
        </p>
      )}
    </div>
  );
}
