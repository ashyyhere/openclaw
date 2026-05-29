// Public speech helpers for bundled or third-party plugins.
//
// Keep this surface provider-facing: types, validation, directive parsing, and
// registry helpers. Runtime synthesis lives on `api.runtime.tts` or narrower
// core/runtime seams, not here.

/** Re-exported API for src/plugin-sdk, starting with Speech Provider Plugin. */
export type { SpeechProviderPlugin } from "../plugins/types.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  SpeechDirectiveTokenParseContext,
  SpeechDirectiveTokenParseResult,
  SpeechListVoicesRequest,
  SpeechModelOverridePolicy,
  SpeechProviderConfig,
  SpeechProviderConfiguredContext,
  SpeechProviderPreparedSynthesis,
  SpeechProviderPrepareSynthesisContext,
  SpeechProviderResolveConfigContext,
  SpeechProviderResolveTalkConfigContext,
  SpeechProviderResolveTalkOverridesContext,
  SpeechProviderOverrides,
  SpeechSynthesisRequest,
  SpeechSynthesisStreamRequest,
  SpeechSynthesisStreamResult,
  SpeechSynthesisTarget,
  SpeechTelephonySynthesisRequest,
  SpeechVoiceOption,
  TtsDirectiveOverrides,
  TtsDirectiveParseResult,
} from "../tts/provider-types.js";

/** Re-exported API for src/plugin-sdk, starting with parse Tts Directives. */
export { parseTtsDirectives } from "../tts/directives.js";
/** Re-exported API for src/plugin-sdk. */
export {
  canonicalizeSpeechProviderId,
  getSpeechProvider,
  listSpeechProviders,
  normalizeSpeechProviderId,
} from "../tts/provider-registry.js";
/** Re-exported API for src/plugin-sdk, starting with normalize Tts Auto Mode. */
export { normalizeTtsAutoMode, TTS_AUTO_MODES } from "../tts/tts-auto-mode.js";
/** Re-exported API for src/plugin-sdk. */
export {
  asBoolean,
  asFiniteNumber,
  asObject,
  assertOkOrThrowProviderError,
  createProviderHttpError,
  extractProviderErrorDetail,
  extractProviderRequestId,
  formatProviderHttpErrorMessage,
  formatProviderErrorPayload,
  readResponseTextLimited,
  trimToUndefined,
  truncateErrorDetail,
} from "../agents/provider-http-errors.js";
/** Re-exported API for src/plugin-sdk. */
export {
  normalizeApplyTextNormalization,
  normalizeLanguageCode,
  normalizeSeed,
  requireInRange,
  scheduleCleanup,
} from "../tts/tts-provider-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createOpenAiCompatibleSpeechProvider,
  type OpenAiCompatibleSpeechProviderBaseUrlPolicy,
  type OpenAiCompatibleSpeechProviderConfig,
  type OpenAiCompatibleSpeechProviderExtraJsonBodyField,
  type OpenAiCompatibleSpeechProviderOptions,
} from "../tts/openai-compatible-speech-provider.js";
