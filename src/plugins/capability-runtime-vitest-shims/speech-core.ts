// plugins/capability-runtime-vitest-shims speech core helpers and runtime behavior.
/** Re-exported API for src/plugins/capability-runtime-vitest-shims. */
export type {
  SpeechDirectiveTokenParseContext,
  SpeechDirectiveTokenParseResult,
  SpeechListVoicesRequest,
  SpeechModelOverridePolicy,
  SpeechProviderConfig,
  SpeechProviderConfiguredContext,
  SpeechProviderPlugin,
  SpeechProviderResolveConfigContext,
  SpeechProviderResolveTalkConfigContext,
  SpeechProviderResolveTalkOverridesContext,
  SpeechProviderOverrides,
  SpeechSynthesisRequest,
  SpeechTelephonySynthesisRequest,
  SpeechVoiceOption,
  TtsDirectiveOverrides,
  TtsDirectiveParseResult,
} from "../../plugin-sdk/speech-core.js";

/** Re-exported API for src/plugins/capability-runtime-vitest-shims. */
export {
  normalizeApplyTextNormalization,
  normalizeLanguageCode,
  normalizeSeed,
  requireInRange,
  scheduleCleanup,
} from "../../plugin-sdk/speech-core.js";
/** Re-exported API for src/plugins/capability-runtime-vitest-shims. */
export {
  asBoolean,
  asFiniteNumber,
  asObject,
  readResponseTextLimited,
  trimToUndefined,
  truncateErrorDetail,
} from "../../agents/provider-http-errors.js";

/** Reused helper for summarize Text behavior in src/plugins/capability-runtime-vitest-shims. */
export async function summarizeText(): Promise<never> {
  throw new Error("summarizeText is unavailable in the Vitest capability contract shim");
}
