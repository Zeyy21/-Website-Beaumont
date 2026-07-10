"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  signIn,
  signUp,
  signInWithMagicLink,
  signInWithGoogle,
  type AuthState,
} from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";

type Mode = "signin" | "signup" | "magic";

const quoteContactKey = "beaumont:quote-contact";

const inputClass =
  "w-full rounded-xl border border-oak/30 bg-white px-4 py-3 text-soil outline-none transition focus:border-cinnamon focus:ring-2 focus:ring-cinnamon/15";

export function AuthForm({ enabled, next, initialError, initialMode = "signin", quoteReady = false }: { enabled: boolean; next: string; initialError?: string; initialMode?: Mode; quoteReady?: boolean }) {
  const { dict } = useT();
  const t = dict.auth;
  const [mode, setMode] = useState<Mode>(initialMode);
  const [cachedContact, setCachedContact] = useState({ fullName: "", email: "" });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(quoteContactKey);
      if (!raw) return;
      const cached = JSON.parse(raw) as { fullName?: string; email?: string };
      setCachedContact({
        fullName: cached.fullName?.trim() ?? "",
        email: cached.email?.trim() ?? "",
      });
    } catch {
      window.localStorage.removeItem(quoteContactKey);
    }
  }, []);

  if (!enabled) {
    return (
      <div className="rounded-2xl border border-cinnamon/35 bg-sand/35 p-8 text-center">
        <h2 className="font-display text-2xl text-oak">{t.disabledHeading}</h2>
        <p className="mt-3 text-soil/80">
          {t.disabledBodyA} <code className="font-semibold">.env.local</code> {t.disabledBodyB}
        </p>
        <a href="/quote" className="mt-5 inline-block"><Button>{t.disabledCta}</Button></a>
      </div>
    );
  }

  const tabs: { id: Mode; label: string }[] = [
    { id: "signin", label: t.tabSignin },
    { id: "signup", label: t.tabSignup },
    { id: "magic", label: t.tabMagic },
  ];

  return (
    <div>
      {quoteReady && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-cinnamon/20 bg-sand/30 p-4 text-oak">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cinnamon text-sm text-ivory" aria-hidden="true">
            ✓
          </span>
          <div>
            <p className="text-sm font-semibold">{t.quoteCreatedTitle}</p>
            <p className="mt-0.5 text-sm text-soil/70">{t.quoteCreatedBody}</p>
          </div>
        </div>
      )}
      <h2 className="font-display text-3xl text-oak">{mode === "signup" ? t.headingSignup : t.headingSignin}</h2>
      <p className="mt-2 text-soil/80">
        {mode === "signup" ? t.subSignup : t.subSignin}
      </p>

      <div className="mt-6 flex gap-1 rounded-full bg-oak/10 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`relative isolate flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${mode === tab.id ? "text-ivory" : "text-soil/80 hover:text-oak"}`}
          >
            {mode === tab.id && <motion.span layoutId="auth-tab" className="absolute inset-0 z-0 rounded-full bg-cinnamon" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AuthActionForm
        key={`${mode}:${cachedContact.fullName}:${cachedContact.email}`}
        mode={mode}
        next={next}
        initialError={initialError}
        defaultFullName={cachedContact.fullName}
        defaultEmail={cachedContact.email}
      />

      <div className="my-6 flex items-center gap-4 text-sm font-medium text-soil/65">
        <span className="h-px flex-1 bg-oak/20" />{t.or}<span className="h-px flex-1 bg-oak/20" />
      </div>

      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-oak/30 bg-white px-6 py-3 font-medium text-soil transition hover:border-cinnamon hover:bg-sand/35">
          <GoogleMark />
          {t.continueGoogle}
        </button>
      </form>
    </div>
  );
}

function AuthActionForm({ mode, next, initialError, defaultFullName, defaultEmail }: { mode: Mode; next: string; initialError?: string; defaultFullName: string; defaultEmail: string }) {
  const { dict } = useT();
  const t = dict.auth;
  const action = mode === "signin" ? signIn : mode === "signup" ? signUp : signInWithMagicLink;
  const [state, formAction] = useFormState<AuthState, FormData>(action, initialError ? { error: initialError } : {});

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      {mode === "signup" && <Field label={t.fieldFullName} name="full_name" type="text" autoComplete="name" defaultValue={defaultFullName} required />}
      <Field label={t.fieldEmail} name="email" type="email" autoComplete="email" defaultValue={defaultEmail} required />
      {mode !== "magic" && (
        <Field
          label={t.fieldPassword}
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          minLength={mode === "signup" ? 8 : undefined}
          required
        />
      )}
      {mode === "signup" && <Field label={t.fieldReferral} name="referral" type="text" placeholder={t.referralPlaceholder} />}

      <AnimatePresence mode="wait">
        {state.error && <Notice key="err" tone="error">{state.error}</Notice>}
        {state.message && <Notice key="msg" tone="ok">{state.message}</Notice>}
      </AnimatePresence>
      <SubmitButton label={mode === "signin" ? t.submitSignin : mode === "signup" ? t.submitSignup : t.submitMagic} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { dict } = useT();
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending} className="w-full" size="lg">{pending ? dict.common.oneMoment : label}</Button>;
}

function Field({ label, name, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-oak">{label}</label>
      <input id={name} name={name} className={inputClass} {...props} />
    </div>
  );
}

function Notice({ children, tone }: { children: React.ReactNode; tone: "error" | "ok" }) {
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm font-medium ${tone === "error" ? "border-red-200 bg-red-50 text-red-900" : "border-green-200 bg-green-50 text-green-900"}`}>
      {children}
    </motion.p>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
