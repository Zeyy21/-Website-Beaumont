"use client";

import { useFormState, useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import {
  submitSalesApplication,
  type SalesApplicationState,
} from "@/app/prototype-christophe/actions";

const inputClass =
  "w-full rounded-xl border border-oak/30 bg-white px-4 py-3 text-soil outline-none transition placeholder:text-soil/40 focus:border-cinnamon focus:ring-2 focus:ring-cinnamon/15";

export function SalesApplicationForm() {
  const [state, formAction] = useFormState<SalesApplicationState, FormData>(
    submitSalesApplication,
    {},
  );

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-cinnamon/25 bg-sand/40 p-8 text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cinnamon text-xl text-ivory"
          aria-hidden
        >
          ✓
        </div>
        <h2 className="mt-5 font-display text-3xl text-oak">
          Application received
        </h2>
        <p className="mt-3 text-soil/75">
          Thank you for your interest in joining the Beaumont sales team. We
          review every application personally and will reach out if there&rsquo;s
          a fit.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <Field
        label="Name"
        name="full_name"
        type="text"
        autoComplete="name"
        placeholder="Your full name"
        maxLength={120}
        required
      />
      <Field
        label="Phone number"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="(555) 123-4567"
        maxLength={40}
        required
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@email.com"
        maxLength={160}
        required
      />

      <div>
        <label
          htmlFor="motivation"
          className="mb-1.5 block text-sm font-semibold text-oak"
        >
          Why do you want to get into sales?
        </label>
        <textarea
          id="motivation"
          name="motivation"
          rows={5}
          required
          maxLength={4000}
          placeholder="Tell us in a few sentences."
          className={`${inputClass} resize-y`}
        />
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-semibold text-oak">
          Are you comfortable with a Monday to Saturday, 11 AM to 7 PM schedule?
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <ScheduleOption value="yes" label="Yes, that works" />
          <ScheduleOption value="no" label="No / not sure" />
        </div>
      </fieldset>

      <AnimatePresence mode="wait">
        {state.error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
          >
            {state.error}
          </motion.p>
        )}
      </AnimatePresence>

      <SubmitButton />
      <p className="text-center text-xs text-soil/50">
        Your details go straight to the Beaumont hiring team.
      </p>
    </form>
  );
}

function ScheduleOption({ value, label }: { value: string; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-oak/25 bg-white px-4 py-3 text-sm font-medium text-soil transition hover:border-cinnamon/50 has-[:checked]:border-cinnamon has-[:checked]:bg-cinnamon/5 has-[:checked]:text-oak">
      <input
        type="radio"
        name="schedule_ok"
        value={value}
        required
        className="h-4 w-4 accent-cinnamon"
      />
      {label}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Sending…" : "Submit application"}
    </Button>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-oak"
      >
        {label}
      </label>
      <input id={name} name={name} className={inputClass} {...props} />
    </div>
  );
}
