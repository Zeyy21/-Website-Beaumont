"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";

/**
 * Generic button that runs a passed server action by id and shows pending /
 * done states inline. Keeps admin list pages as server components.
 */
export function AdminActionButton({
  id,
  action,
  label,
  doneLabel,
  variant = "primary",
}: {
  id: string;
  action: (id: string) => Promise<{ ok: boolean; error?: string }>;
  label: string;
  doneLabel?: string;
  variant?: "primary" | "outline";
}) {
  const { dict } = useT();
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const resolvedDone = doneLabel ?? dict.admin.actionButton.done;

  if (done)
    return <span className="text-sm font-medium text-green-700">{resolvedDone}</span>;

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={variant}
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await action(id);
            if (res.ok) setDone(true);
            else setErr(res.error ?? dict.admin.quoteReviewForm.actionFailed);
          })
        }
      >
        {pending ? "…" : label}
      </Button>
      {err && <span className="text-xs text-red-700">{err}</span>}
    </div>
  );
}
