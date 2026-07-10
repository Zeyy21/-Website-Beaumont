/**
 * Locale configuration. The same deployment serves both the English domain
 * (beaumontgroup.net) and the French domain (groupebeaumont.net); the rendered
 * language is chosen from the request host, with a NEXT_LOCALE cookie fallback
 * for localhost and preview URLs where the host is ambiguous.
 */

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Canonical public site for each language. The header switch links across
 *  these, so changing language is a cross-domain navigation by design. */
export const localeUrls: Record<Locale, string> = {
  en: "https://beaumontgroup.net",
  fr: "https://groupebeaumont.net",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "fr";
}

/**
 * Resolve a locale from a request host. `groupebeaumont` → French,
 * `beaumontgroup` → English. Returns null when the host doesn't identify a
 * language (e.g. localhost, vercel preview) so the caller can fall back.
 */
export function localeFromHost(host: string | undefined | null): Locale | null {
  if (!host) return null;
  const h = host.toLowerCase();
  // Order matters: check the French host first since both contain "beaumont".
  if (h.includes("groupebeaumont")) return "fr";
  if (h.includes("beaumontgroup")) return "en";
  return null;
}
