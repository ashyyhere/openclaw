// Shared types for wizard/i18n types behavior.
/** Shared type for Wizard Locale in src/wizard/i18n. */
export type WizardLocale = "en" | "zh-CN" | "zh-TW";

/** Shared type for Wizard I18n Params in src/wizard/i18n. */
export type WizardI18nParams = Record<string, boolean | number | string | null | undefined>;

/** Shared type for Wizard Translation Tree in src/wizard/i18n. */
export type WizardTranslationTree = {
  readonly [key: string]: string | WizardTranslationTree;
};

/** Shared type for Wizard Translation Map in src/wizard/i18n. */
export type WizardTranslationMap = WizardTranslationTree;
