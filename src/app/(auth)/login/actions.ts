"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/config";
import { sendEmail } from "@/lib/email";
import { getDict, getLocale } from "@/lib/i18n/server";
import { AUTH_LOCALE_COOKIE, AUTH_NEXT_COOKIE } from "@/lib/auth-handoff";

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

/**
 * Callback URL for OAuth / email links. This MUST exactly match an entry in
 * Supabase's "Redirect URLs" allow list — those entries are bare paths with no
 * query string, and Supabase glob-matches the full URL. Appending `?next=…` here
 * would fail the match and make Supabase fall back to the Site URL (dropping the
 * user on the wrong domain). So we keep the callback bare and stash `next` +
 * `locale` in short-lived cookies on the originating domain instead; because the
 * exact match means OAuth returns to that same domain, the cookies come back. */
function authCallback() {
  return `${requestOrigin()}/auth/callback`;
}

/** Persist the post-login destination + chosen language across the OAuth/email
 *  round-trip via same-domain cookies (see authCallback). Short max-age: this is
 *  only needed for the seconds between leaving for the provider and returning. */
function stashHandoff(next: string) {
  const jar = cookies();
  const options = { path: "/", maxAge: 60 * 15, sameSite: "lax" as const };
  jar.set(AUTH_NEXT_COOKIE, next, options);
  jar.set(AUTH_LOCALE_COOKIE, getLocale(), options);
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const t = getDict().auth;
  const supabase = createClient();
  if (!supabase) return { error: t.errSupabase };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  if (!email || !password) return { error: t.errCredentials };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect(next);
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const t = getDict().auth;
  const supabase = createClient();
  if (!supabase) return { error: t.errSupabase };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const referral = String(formData.get("referral") ?? "").trim();
  const next = safeNext(formData.get("next"));
  if (!fullName) return { error: t.errFullName };
  if (!email) return { error: t.errEmail };
  if (password.length < 8) return { error: t.errPassword };

  stashHandoff(next);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: authCallback(),
      data: { full_name: fullName, referral_code: referral || null },
    },
  });
  if (error) return { error: error.message };
  if (data.user?.identities?.length === 0) return { error: t.errDuplicate };

  if (data.user) {
    await sendEmail({
      to: email,
      template: { kind: "welcome", name: fullName || email.split("@")[0] },
    });
  }

  if (data.session) redirect(next);
  return {
    message:
      t.successSignup + (referral ? " " + t.successReferralSaved : ""),
  };
}

export async function signInWithMagicLink(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const t = getDict().auth;
  const supabase = createClient();
  if (!supabase) return { error: t.errSupabase };

  const email = String(formData.get("email") ?? "").trim();
  const next = safeNext(formData.get("next"));
  if (!email) return { error: t.errEmail };

  stashHandoff(next);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: authCallback(),
      shouldCreateUser: true,
    },
  });
  if (error) return { error: error.message };
  return { message: t.successMagic };
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const supabase = createClient();
  if (!supabase) redirect("/login?error=disabled");

  const next = safeNext(formData.get("next"));
  stashHandoff(next);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: authCallback() },
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
