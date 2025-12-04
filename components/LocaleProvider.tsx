"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, Locale, isLocale, translate } from "../lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <T = string | string[]>(path: string, vars?: Record<string, string | number>) => T;
  available: Locale[];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("locale");
    if (stored && isLocale(stored)) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (value: Locale) => {
    setLocaleState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("locale", value);
    }
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (path, vars) => translate(locale, path, vars),
      available: LOCALES
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

