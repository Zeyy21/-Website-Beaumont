"use client";

import { useState } from "react";
import { cancelQuote } from "@/app/dashboard/quotes/actions";
import { useRouter } from "next/navigation";
import { useT } from "@/components/i18n/locale-provider";

export function CancelQuoteButton({ quoteId }: { quoteId: string }) {
  const { dict } = useT();
  const t = dict.quote.cancel;
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    if (!confirm(t.confirm)) {
      return;
    }
    setIsPending(true);
    try {
      const res = await cancelQuote(quoteId);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="text-sm text-red-700/80 hover:text-red-700 disabled:opacity-50 transition-colors"
    >
      {isPending ? t.canceling : t.button}
    </button>
  );
}
