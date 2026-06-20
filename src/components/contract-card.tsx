"use client";

import { useState, useTransition } from "react";
import { signContract } from "@/app/dashboard/contract/actions";
import { Button } from "@/components/ui";
import { StatusBadge } from "@/components/dashboard-ui";

interface Contract {
  id: string;
  terms: string;
  status: string;
  signed_at: string | null;
  created_at: string;
}

/** Renders a contract with an in-profile e-sign (acknowledge) flow. */
export function ContractCard({ contract }: { contract: Contract }) {
  const [agreed, setAgreed] = useState(false);
  const [pending, start] = useTransition();
  const [signed, setSigned] = useState(contract.status === "signed");
  const [err, setErr] = useState<string | null>(null);

  const sign = () =>
    start(async () => {
      const res = await signContract(contract.id);
      if (res.ok) setSigned(true);
      else setErr(res.error ?? "Could not sign.");
    });

  return (
    <div className="rounded-2xl border border-oak/10 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-xl text-oak">Service agreement</h2>
        <StatusBadge status={signed ? "signed" : contract.status} />
      </div>

      <div className="mt-4 max-h-72 overflow-auto rounded-xl bg-sand/20 p-5 text-sm leading-relaxed text-soil/75 whitespace-pre-line">
        {contract.terms || "Your service agreement terms will appear here."}
      </div>

      {signed ? (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Signed
          {contract.signed_at
            ? ` on ${new Date(contract.signed_at).toLocaleDateString()}`
            : ""}
          . Thank you.
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
            I have read and agree to the terms of this service agreement.
          </label>
          {err && <p className="text-sm text-red-700">{err}</p>}
          <Button onClick={sign} disabled={!agreed || pending}>
            {pending ? "Signing…" : "E-sign agreement"}
          </Button>
        </div>
      )}
    </div>
  );
}
