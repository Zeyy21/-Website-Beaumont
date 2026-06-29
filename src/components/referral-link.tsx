"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";

/** Shows the user's referral link with a copy-to-clipboard button. */
export function ReferralLink({ code, baseUrl }: { code: string; baseUrl: string }) {
  const { dict } = useT();
  const t = dict.dashboard.referrals;
  const url = `${baseUrl}/login?ref=${code}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-oak/15 bg-sand/20 p-2">
        <code className="flex-1 truncate px-2 text-sm text-soil/70">{url}</code>
        <Button size="sm" onClick={copy}>
          {copied ? t.copied : t.copy}
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-soil/50">{t.yourCode}</span>
        <span className="rounded-full bg-cinnamon/10 px-3 py-1 font-mono text-sm font-semibold tracking-wider text-cinnamon">
          {code}
        </span>
      </div>
    </div>
  );
}
