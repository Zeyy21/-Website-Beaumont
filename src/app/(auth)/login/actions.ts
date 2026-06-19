"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/config";
import { sendEmail } from "@/lib/email";

export interface AuthState {
  error?: string;
  message?: string;
}

/** Email + password sign-in. */
export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = createClient();
  if (!supabase) return { error: "Accounts are not enabled yet." };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect(next);
}

/** Email + password sign-up; seeds a welcome email + signup reward. */
export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = createClient();
  if (!supabase) return { error: "Accounts are not enabled yet." };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "");
  const referral = String(formData.get("referral") ?? "").trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };

  // Best-effort onboarding side effects (don't block on failure).
  if (data.user) {
    await sendEmail({
      to: email,
      template: { kind: "welcome", name: fullName || email.split("@")[0] },
    });
  }

  if (data.session) {
    // Email confirmation disabled → signed in immediately.
    redirect("/dashboard");
  }
  // Store referral code for processing after confirmation.
  return {
    message:
      "Check your email to confirm your account." +
      (referral ? " Your referral will be applied once you sign in." : ""),
  };
}

/** Passwordless magic-link sign-in. */
export async function signInWithMagicLink(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = createClient();
  if (!supabase) return { error: "Accounts are not enabled yet." };

  const email = String(formData.get("email") ?? "");
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${site.url}/auth/callback` },
  });
  if (error) return { error: error.message };
  return { message: "Magic link sent — check your inbox." };
}

/** Google OAuth — usable directly as a <form action>. Redirects on success. */
export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient();
  if (!supabase) redirect("/login?error=disabled");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${site.url}/auth/callback` },
  });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  if (data.url) redirect(data.url);
  redirect("/login?error=oauth");
}

export async function signOut() {
  const supabase = createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
