"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/config";
import { sendEmail } from "@/lib/email";

export interface AuthState {
  error?: string;
  message?: string;
}

function safeNext(value: FormDataEntryValue | string | null, fallback = "/dashboard") {
  const next = String(value ?? fallback);
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

function requestOrigin() {
  const requestHeaders = headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.includes("localhost") || host?.startsWith("127.") ? "http" : "https");
  return host ? `${protocol}://${host}` : site.url;
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = createClient();
  if (!supabase) return { error: "Supabase is not available in this local build. Add the public URL and client key, then restart the site." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  if (!email || !password) return { error: "Enter both your email and password." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect(next);
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = createClient();
  if (!supabase) return { error: "Supabase is not available in this local build. Add the public URL and client key, then restart the site." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const referral = String(formData.get("referral") ?? "").trim();
  const next = safeNext(formData.get("next"));
  if (!fullName) return { error: "Enter your full name." };
  if (!email) return { error: "Enter your email address." };
  if (password.length < 8) return { error: "Use a password with at least 8 characters." };

  const callback = `${requestOrigin()}/auth/callback?next=${encodeURIComponent(next)}`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callback,
      data: { full_name: fullName, referral_code: referral || null },
    },
  });
  if (error) return { error: error.message };
  if (data.user?.identities?.length === 0) return { error: "An account already exists for this email. Try signing in instead." };

  if (data.user) {
    await sendEmail({
      to: email,
      template: { kind: "welcome", name: fullName || email.split("@")[0] },
    });
  }

  if (data.session) redirect(next);
  return {
    message:
      "Your account was created. Check your email to confirm it, then return here to sign in." +
      (referral ? " Your referral code has been saved." : ""),
  };
}

export async function signInWithMagicLink(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = createClient();
  if (!supabase) return { error: "Supabase is not available in this local build. Add the public URL and client key, then restart the site." };

  const email = String(formData.get("email") ?? "").trim();
  const next = safeNext(formData.get("next"));
  if (!email) return { error: "Enter your email address." };

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${requestOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true,
    },
  });
  if (error) return { error: error.message };
  return { message: "Magic link sent. Check your inbox to continue." };
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const supabase = createClient();
  if (!supabase) redirect("/login?error=disabled");

  const next = safeNext(formData.get("next"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${requestOrigin()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) redirect(`/login?error=oauth&message=${encodeURIComponent(error.message)}`);
  if (data.url) redirect(data.url);
  redirect("/login?error=oauth");
}

export async function signOut() {
  const supabase = createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
