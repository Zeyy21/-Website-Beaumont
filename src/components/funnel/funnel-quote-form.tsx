"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n/config";
import type { FunnelForm } from "@/lib/funnels/copy";
import { submitFunnelLead, type FunnelLeadState } from "@/app/(funnels)/actions";
import styles from "./funnel.module.css";

/**
 * Funnel lead form. Posts to the anonymous-lead server action (no signup),
 * shows a success state in place of the fields, and carries hidden locale/
 * source/error fields so the action can localize and tag the lead.
 */
export function FunnelQuoteForm({
  copy,
  locale,
  source,
}: {
  copy: FunnelForm;
  locale: Locale;
  source: "getquote" | "learnmore";
}) {
  const [state, formAction] = useFormState<FunnelLeadState, FormData>(
    submitFunnelLead,
    {},
  );

  if (state.ok) {
    return (
      <div className={styles.form}>
        <div className={styles.success}>
          <div className={styles.successMark} aria-hidden>
            ✓
          </div>
          <p className={styles.successH}>{copy.successHeading}</p>
          <p className={styles.successP}>{copy.successBody}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="errorMessage" value={copy.error} />

      <p className={styles.fh}>{copy.heading}</p>
      <p className={styles.fs}>{copy.sub}</p>

      <div className={styles.field}>
        <label htmlFor="fn-name">{copy.name}</label>
        <input type="text" id="fn-name" name="name" autoComplete="name" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="fn-address">{copy.address}</label>
        <input
          type="text"
          id="fn-address"
          name="address"
          autoComplete="street-address"
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="fn-service">{copy.service}</label>
        <select id="fn-service" name="service" required defaultValue="">
          <option value="" disabled>
            {copy.servicePlaceholder}
          </option>
          {copy.serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="fn-phone">{copy.phone}</label>
        <input type="tel" id="fn-phone" name="phone" autoComplete="tel" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="fn-email">{copy.email}</label>
        <input
          type="email"
          id="fn-email"
          name="email"
          autoComplete="email"
          required
        />
      </div>

      <label className={styles.consent}>
        <input type="checkbox" name="casl_consent" value="yes" />
        <span>{copy.consent}</span>
      </label>

      {state.error && (
        <p className={styles.formError} role="alert">
          {state.error}
        </p>
      )}

      <SubmitButton copy={copy} />
      <p className={styles.formMicro}>{copy.micro}</p>
    </form>
  );
}

function SubmitButton({ copy }: { copy: FunnelForm }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`${styles.btn} ${styles.btnInk}`}
      disabled={pending}
    >
      {pending ? copy.sending : copy.submit}
    </button>
  );
}
