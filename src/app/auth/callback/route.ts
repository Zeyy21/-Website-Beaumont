import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LOCALE_COOKIE, isLocale, localeFromHost } from "@/lib/i18n/config";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

/**
 * Exchange OAuth, email-confirmation, or magic-link codes for a cookie session.
 *
 * The auth session cookie is written on whichever origin finishes this exchange,
 * so we always redirect back to the same origin (never cross-domain — that would
 * drop the just-issued session). We do pin the language: the `locale` carried
 * from the login request is written to NEXT_LOCALE so the destination renders in
 * the user's language even when the host can't imply it (localhost/previews) or
 * when an OAuth round-trip returned via a different brand domain.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
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

  const response = NextResponse.redirect(`${origin}${next}`);

  // Keep the chosen language stable. Prefer the real host's language (a brand
  // domain is authoritative); otherwise fall back to the locale we carried.
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? null;
  const carried = request.nextUrl.searchParams.get("locale");
  const locale = localeFromHost(host) ?? (isLocale(carried) ? carried : null);
  if (locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}
