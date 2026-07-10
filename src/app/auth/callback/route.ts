import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LOCALE_COOKIE, isLocale, localeFromHost } from "@/lib/i18n/config";
import { AUTH_LOCALE_COOKIE, AUTH_NEXT_COOKIE } from "@/lib/auth-handoff";

function safeNext(value: string | null | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

/**
 * Exchange OAuth, email-confirmation, or magic-link codes for a cookie session.
 *
 * The callback URL is intentionally bare (no query params) so it exactly matches
 * Supabase's Redirect URLs allow list; the destination + chosen language are
 * carried in same-domain handoff cookies set before leaving for the provider
 * (see lib/auth-handoff). The auth session cookie is written on whichever origin
 * finishes the exchange, so we always redirect within that same origin.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = request.nextUrl.origin;

  if (!code) return NextResponse.redirect(`${origin}/login?error=missing-code`);
  const supabase = createClient();
  if (!supabase) return NextResponse.redirect(`${origin}/login?error=disabled`);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=auth&message=${encodeURIComponent(error.message)}`,
    );
  }

  const next = safeNext(request.cookies.get(AUTH_NEXT_COOKIE)?.value);
  const response = NextResponse.redirect(`${origin}${next}`);

  // Pin the language. The real brand host is authoritative; otherwise fall back
  // to the locale we stashed at login (covers the Vercel/preview Site-URL host,
  // where the domain can't imply a language).
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? null;
  const carried = request.cookies.get(AUTH_LOCALE_COOKIE)?.value;
  const locale = localeFromHost(host) ?? (isLocale(carried) ? carried : null);
  if (locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  // Handoff cookies are single-use; clear them so they can't leak into a later
  // login from this browser.
  response.cookies.set(AUTH_NEXT_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(AUTH_LOCALE_COOKIE, "", { path: "/", maxAge: 0 });

  return response;
}
