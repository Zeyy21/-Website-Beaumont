"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Makes the server-resolved locale + dictionary available to client
 * components. Mounted in each segment layout with values from getLocale()/
 * getDict() so client components never re-resolve the locale themselves.
 */
export function LocaleProvider({
  locale,
  dict,
  children,
}: LocaleContextValue & { children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Access the active locale + dictionary inside a client component. */
export function useT(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useT must be used within a LocaleProvider");
  }
  return ctx;
}
