// wizard/i18n index helpers and runtime behavior.
import { en } from "./locales/en.js";
import { zh_CN } from "./locales/zh-CN.js";
import { zh_TW } from "./locales/zh-TW.js";
import type {
  WizardI18nParams,
  WizardLocale,
  WizardTranslationMap,
  WizardTranslationTree,
} from "./types.js";

/** Re-exported API for src/wizard/i18n, starting with Wizard I18n Params. */
export type { WizardI18nParams, WizardLocale, WizardTranslationMap };

/** Shared type for Setup Translator in src/wizard/i18n. */
export type SetupTranslator = (key: string, params?: WizardI18nParams) => string;

const LOCALES: Record<WizardLocale, WizardTranslationMap> = {
  en,
  "zh-CN": zh_CN,
  "zh-TW": zh_TW,
};

/** Reused constant for WIZARD DEFAULT LOCALE behavior in src/wizard/i18n. */
export const WIZARD_DEFAULT_LOCALE: WizardLocale = "en";
/** Reused constant for WIZARD SUPPORTED LOCALES behavior in src/wizard/i18n. */
export const WIZARD_SUPPORTED_LOCALES: readonly WizardLocale[] = ["en", "zh-CN", "zh-TW"];

function normalizeLocaleToken(raw: string | undefined): string {
  return (raw ?? "").trim().split(".")[0]?.split("@")[0]?.replaceAll("_", "-") ?? "";
}

/** Reused helper for resolve Wizard Locale behavior in src/wizard/i18n. */
export function resolveWizardLocale(value: string | undefined): WizardLocale {
  const normalized = normalizeLocaleToken(value);
  if (!normalized) {
    return WIZARD_DEFAULT_LOCALE;
  }

  const lower = normalized.toLowerCase();
  if (lower === "en" || lower.startsWith("en-")) {
    return "en";
  }
  if (lower === "zh-tw" || lower === "zh-hk" || lower === "zh-mo" || lower.includes("hant")) {
    return "zh-TW";
  }
  if (lower === "zh" || lower === "zh-cn" || lower === "zh-sg" || lower.includes("hans")) {
    return "zh-CN";
  }
  return WIZARD_DEFAULT_LOCALE;
}

/** Reused helper for resolve Wizard Locale From Env behavior in src/wizard/i18n. */
export function resolveWizardLocaleFromEnv(env: NodeJS.ProcessEnv = process.env): WizardLocale {
  return resolveWizardLocale(env.OPENCLAW_LOCALE ?? env.LC_ALL ?? env.LC_MESSAGES ?? env.LANG);
}

function readKey(map: WizardTranslationMap, key: string): string | undefined {
  let value: string | WizardTranslationTree | undefined = map;
  for (const segment of key.split(".")) {
    if (!value || typeof value === "string") {
      return undefined;
    }
    value = value[segment];
  }
  return typeof value === "string" ? value : undefined;
}

function interpolate(value: string, params?: WizardI18nParams): string {
  if (!params) {
    return value;
  }
  return value.replace(/\{([A-Za-z0-9_]+)\}/g, (match, key) => {
    const param = params[key];
    return param === undefined || param === null ? match : String(param);
  });
}

/** Reused helper for wizard T behavior in src/wizard/i18n. */
export function wizardT(
  key: string,
  params?: WizardI18nParams,
  options?: { locale?: WizardLocale },
): string {
  const locale = options?.locale ?? resolveWizardLocaleFromEnv();
  const localized = readKey(LOCALES[locale], key);
  const fallback = localized ?? readKey(LOCALES[WIZARD_DEFAULT_LOCALE], key) ?? key;
  return interpolate(fallback, params);
}

/** Reused constant for t behavior in src/wizard/i18n. */
export const t = wizardT;

/** Reused helper for create Setup Translator behavior in src/wizard/i18n. */
export function createSetupTranslator(options?: {
  locale?: WizardLocale;
  keyPrefix?: string;
}): SetupTranslator {
  const normalizedPrefix = options?.keyPrefix?.replace(/\.$/, "");
  return (key, params) => {
    const resolvedKey =
      normalizedPrefix && !key.startsWith("common.") && !key.startsWith("wizard.")
        ? `${normalizedPrefix}.${key}`
        : key;
    return wizardT(resolvedKey, params, { locale: options?.locale });
  };
}

function collectLeafKeys(tree: WizardTranslationTree, prefix = "", out: string[] = []): string[] {
  for (const [key, value] of Object.entries(tree)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      out.push(next);
    } else {
      collectLeafKeys(value, next, out);
    }
  }
  return out;
}

/** Reused helper for list Wizard I18n Keys behavior in src/wizard/i18n. */
export function listWizardI18nKeys(locale: WizardLocale = WIZARD_DEFAULT_LOCALE): string[] {
  return collectLeafKeys(LOCALES[locale]).toSorted();
}
