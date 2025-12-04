"use client";

import { useLocale } from "./LocaleProvider";
import { Locale } from "../lib/i18n";

const labels: Record<Locale, string> = {
  "zh-Hant": "繁體中文",
  "zh-Hans": "简体中文",
  en: "English",
  ja: "日本語"
};

export function LanguageSwitcher() {
  const { locale, setLocale, available, t } = useLocale();

  return (
    <label className="flex items-center gap-2 text-sm text-ink/70">
      <span>{t("switcherLabel") as string}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="rounded-xl border border-ink/10 bg-white px-2 py-1 text-ink shadow-sm focus:border-ink/30 focus:outline-none"
      >
        {available.map((loc) => (
          <option key={loc} value={loc}>
            {labels[loc]}
          </option>
        ))}
      </select>
    </label>
  );
}

