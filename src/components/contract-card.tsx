"use client";

import { useState, useTransition } from "react";
import { signContract } from "@/app/dashboard/contract/actions";
import { Button } from "@/components/ui";
import { StatusBadge } from "@/components/dashboard-ui";
import { useT } from "@/components/i18n/locale-provider";
import { statusLabel } from "@/lib/i18n/dictionaries";

interface Contract {
  id: string;
  terms: string;
  status: string;
  signed_at: string | null;
  created_at: string;
}

/** Renders a contract with an in-profile e-sign (acknowledge) flow. */
export function ContractCard({ contract }: { contract: Contract }) {
  const { dict } = useT();
  const t = dict.dashboard.contract;
  const [agreed, setAgreed] = useState(false);
  const [pending, start] = useTransition();
  const [signed, setSigned] = useState(contract.status === "signed");
  const [err, setErr] = useState<string | null>(null);

  const sign = () =>
    start(async () => {
      const res = await signContract(contract.id);
      if (res.ok) setSigned(true);
      else setErr(res.error ?? t.couldNotSign);
    });

  return (
    <div className="rounded-2xl border border-oak/10 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-xl text-oak">{t.agreementTitle}</h2>
        <StatusBadge
          status={signed ? "signed" : contract.status}
          label={statusLabel(dict, signed ? "signed" : contract.status)}
        />
      </div>

      <div className="mt-4 max-h-72 overflow-auto rounded-xl bg-sand/20 p-5 text-sm leading-relaxed text-soil/75 whitespace-pre-line">
        {contract.terms || t.termsFallback}
      </div>

      {signed ? (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          {contract.signed_at
            ? `${t.signedOn} ${new Date(contract.signed_at).toLocaleDateString()}${t.thankYou}`
            : `${t.signedShort}${t.thankYou}`}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-soil/70">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-cinnamon"
            />
            {t.agreeLabel}
          </label>
          {err && <p className="text-sm text-red-700">{err}</p>}
          <Button onClick={sign} disabled={!agreed || pending}>
            {pending ? t.signing : t.eSign}
          </Button>
        </div>
      )}
    </div>
  );
}
