import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  supabaseConfigured,
} from "@/lib/supabase/env";
import { LOCALE_COOKIE, localeFromHost } from "@/lib/i18n/config";

/**
 * Persists the language implied by the request host into the NEXT_LOCALE
 * cookie. Because the same deployment serves both domains, this lets server
 * components fall back to the cookie when the host is ambiguous (previews,
 * localhost) and keeps the chosen language stable across navigation.
 */
function syncLocaleCookie(request: NextRequest, response: NextResponse) {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    null;
  const locale = localeFromHost(host);
  if (locale && request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
}

/**
 * Refreshes the Supabase auth session cookie on navigation and keeps the
 * locale cookie in sync with the request host. No-ops the Supabase part
 * entirely when Supabase isn't configured, so the app runs on an empty .env.
 */
export async function middleware(request: NextRequest) {
  if (!supabaseConfigured) {
    const res = NextResponse.next();
    syncLocaleCookie(request, res);
    return res;
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  syncLocaleCookie(request, response);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|fonts|.*\\.png$).*)"],
};
