"use client";

import { useState } from "react";
import { cancelQuote } from "@/app/dashboard/quotes/actions";
import { useRouter } from "next/navigation";

export function CancelQuoteButton({ quoteId }: { quoteId: string }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel and delete this quote request?")) {
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
      {isPending ? "Canceling..." : "Cancel Quote"}
    </button>
  );
}
