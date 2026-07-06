import "server-only";
import { cookies, headers } from "next/headers";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  localeFromHost,
  type Locale,
} from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

/**
 * The active locale for the current request, resolved server-side.
 * Priority: request host (real domain) → NEXT_LOCALE cookie → default.
 */
export function getLocale(): Locale {
  const host =
    headers().get("x-forwarded-host") ?? headers().get("host") ?? null;
  const fromHost = localeFromHost(host);
  if (fromHost) return fromHost;

  const cookieLocale = cookies().get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  return defaultLocale;
}

/** Convenience: the dictionary for the active request locale. */
export function getDict(): Dictionary {
  return getDictionary(getLocale());
}
