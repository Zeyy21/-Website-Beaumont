"use client";

import { useState } from "react";
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

type Mode = "signin" | "signup" | "magic";

const inputClass =
  "w-full rounded-xl border border-oak/30 bg-white px-4 py-3 text-soil outline-none transition focus:border-cinnamon focus:ring-2 focus:ring-cinnamon/15";

export function AuthForm({ enabled, next, initialError }: { enabled: boolean; next: string; initialError?: string }) {
  const [mode, setMode] = useState<Mode>("signin");

  if (!enabled) {
    return (
      <div className="rounded-2xl border border-cinnamon/35 bg-sand/35 p-8 text-center">
        <h2 className="font-display text-2xl text-oak">Connect Supabase locally</h2>
        <p className="mt-3 text-soil/80">
          This build cannot see a Supabase URL or public client key. Add them to <code className="font-semibold">.env.local</code> and restart the site to enable real accounts.
        </p>
        <a href="/quote" className="mt-5 inline-block"><Button>Continue to instant quote</Button></a>
      </div>
    );
  }

  const tabs: { id: Mode; label: string }[] = [
    { id: "signin", label: "Sign in" },
    { id: "signup", label: "Create account" },
    { id: "magic", label: "Magic link" },
  ];

  return (
    <div>
      <h2 className="font-display text-3xl text-oak">{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
      <p className="mt-2 text-soil/80">
        {mode === "signup" ? "Save estimates and manage your exterior care." : "Sign in to manage quotes, visits, payments, and points."}
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

      <AuthActionForm key={mode} mode={mode} next={next} initialError={initialError} />

      <div className="my-6 flex items-center gap-4 text-sm font-medium text-soil/65">
        <span className="h-px flex-1 bg-oak/20" />or<span className="h-px flex-1 bg-oak/20" />
      </div>

      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-oak/30 bg-white px-6 py-3 font-medium text-soil transition hover:border-cinnamon hover:bg-sand/35">
          <GoogleMark />
          Continue with Google
        </button>
      </form>
    </div>
  );
}

function AuthActionForm({ mode, next, initialError }: { mode: Mode; next: string; initialError?: string }) {
  const action = mode === "signin" ? signIn : mode === "signup" ? signUp : signInWithMagicLink;
  const [state, formAction] = useFormState<AuthState, FormData>(action, initialError ? { error: initialError } : {});

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      {mode === "signup" && <Field label="Full name" name="full_name" type="text" autoComplete="name" required />}
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      {mode !== "magic" && (
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          minLength={mode === "signup" ? 8 : undefined}
          required
        />
      )}
      {mode === "signup" && <Field label="Referral code (optional)" name="referral" type="text" placeholder="Enter a friend's code" />}

      <AnimatePresence mode="wait">
        {state.error && <Notice key="err" tone="error">{state.error}</Notice>}
        {state.message && <Notice key="msg" tone="ok">{state.message}</Notice>}
      </AnimatePresence>
      <SubmitButton label={mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send magic link"} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending} className="w-full" size="lg">{pending ? "One moment…" : label}</Button>;
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
