"use client";

import { cn } from "@/lib/cn";
import { locales, localeUrls, type Locale } from "@/lib/i18n/config";
import { useT } from "./locale-provider";

const labels: Record<Locale, string> = { en: "EN", fr: "FR" };
const fullNames: Record<Locale, string> = { en: "English", fr: "Français" };

/**
 * Compact EN | FR control. Each option is an anchor to that language's
 * canonical domain (English → beaumontgroup.net, French → groupebeaumont.net),
 * so switching language is a cross-domain navigation. The active locale is
 * rendered as a non-interactive, highlighted segment.
 */
export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, dict } = useT();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-oak/10 bg-ivory/95 p-0.5 text-xs font-semibold",
        className,
      )}
      role="group"
      aria-label={dict.common.language}
    >
      {locales.map((code) => {
        const active = code === locale;
        return active ? (
          <span
            key={code}
            aria-current="true"
            className="rounded-full bg-cinnamon px-2.5 py-1 text-ivory"
          >
            {labels[code]}
          </span>
        ) : (
          <a
            key={code}
            href={localeUrls[code]}
            hrefLang={code}
            aria-label={fullNames[code]}
            className="rounded-full px-2.5 py-1 text-soil/55 transition-colors hover:text-oak"
          >
            {labels[code]}
          </a>
        );
      })}
    </div>
  );
}
