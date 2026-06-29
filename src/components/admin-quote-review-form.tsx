"use client";

import { useRef, useState, useTransition } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui";
import type { QuoteStatus } from "@/lib/supabase/types";
import { saveAndSendQuote, saveQuoteReview } from "@/app/admin/actions";
import { useT } from "@/components/i18n/locale-provider";

export function AdminQuoteReviewForm({
  quoteId,
  total,
  status,
  scheduledFor,
  internalNotes,
}: {
  quoteId: string;
  total: number;
  status: QuoteStatus;
  scheduledFor: string | null;
  internalNotes: string | null;
}) {
  const { dict } = useT();
  const t = dict.admin.quoteReviewForm;
  const statusOptions: { value: QuoteStatus; label: string }[] = [
    { value: "requested", label: t.needsQuote },
    { value: "sent", label: t.sentToCustomer },
    { value: "accepted", label: t.accepted },
    { value: "scheduled", label: t.scheduled },
    { value: "completed", label: t.completed },
  ];
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(mode: "save" | "send") {
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    setMessage(null);
    setError(null);
    start(async () => {
      const result =
        mode === "send"
          ? await saveAndSendQuote(formData)
          : await saveQuoteReview(formData);
      if (result.ok) {
        setMessage(mode === "send" ? t.savedAndSent : t.savedOnly);
      } else {
        setError(result.error ?? t.actionFailed);
      }
    });
  }

  return (
    <form ref={formRef} className="space-y-5">
      <input type="hidden" name="quote_id" value={quoteId} />

      <div className="grid gap-4 md:grid-cols-3">
        <Field label={t.finalAmount}>
          <input
            name="total"
            type="number"
            min="0"
            step="1"
            defaultValue={Number(total || 0)}
            className={inputClass}
          />
        </Field>

        <Field label={t.status}>
          <select name="status" defaultValue={status} className={inputClass}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t.scheduledDate}>
          <input
            name="scheduled_for"
            type="datetime-local"
            defaultValue={formatDateTimeLocal(scheduledFor)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={t.internalNotes}>
        <textarea
          name="internal_notes"
          defaultValue={internalNotes ?? ""}
          rows={5}
          className={`${inputClass} min-h-32 resize-y rounded-2xl`}
          placeholder={t.notesPlaceholder}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3 border-t border-oak/10 pt-5">
        <Button
          type="button"
          disabled={pending}
          onClick={() => run("save")}
          variant="outline"
        >
          {pending ? t.saving : t.save}
        </Button>
        <Button type="button" disabled={pending} onClick={() => run("send")}>
          {pending ? t.working : t.saveAndSend}
        </Button>
        {message && <span className="text-sm font-medium text-green-700">{message}</span>}
        {error && <span className="text-sm font-medium text-red-700">{error}</span>}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-oak">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-oak/20 bg-white px-4 py-3 text-sm text-oak outline-none transition-colors focus:border-cinnamon";

function formatDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}
