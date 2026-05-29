// Shared setup wizard localization types.
/** Locales currently bundled for setup wizard text. */
export type WizardLocale = "en" | "zh-CN" | "zh-TW";

/** Interpolation parameters accepted by wizard translations. */
export type WizardI18nParams = Record<string, boolean | number | string | null | undefined>;

/** Nested translation tree where leaves are localized strings. */
export type WizardTranslationTree = {
  readonly [key: string]: string | WizardTranslationTree;
};

/** Root translation map for one locale. */
export type WizardTranslationMap = WizardTranslationTree;
