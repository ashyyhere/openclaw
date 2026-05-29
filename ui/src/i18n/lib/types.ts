// Shared types for ui/src/i18n/lib types behavior.
/** Shared type for Translation Map in ui/src/i18n/lib. */
export type TranslationMap = { [key: string]: string | TranslationMap };

/** Shared type for Locale in ui/src/i18n/lib. */
export type Locale =
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "pt-BR"
  | "de"
  | "es"
  | "ja-JP"
  | "ko"
  | "fr"
  | "ar"
  | "it"
  | "tr"
  | "uk"
  | "id"
  | "pl"
  | "th"
  | "vi"
  | "nl"
  | "fa";

/** Shared type for I18n Config in ui/src/i18n/lib. */
export interface I18nConfig {
  locale: Locale;
  fallbackLocale: Locale;
  translations: Record<Locale, TranslationMap>;
}
