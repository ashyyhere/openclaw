// Shared speech-provider implementation helpers for bundled and third-party plugins.

/** Re-exported API for src/plugin-sdk, starting with Speech Provider Plugin. */
export type { SpeechProviderPlugin } from "../plugins/types.js";
/** Re-exported API for src/plugin-sdk, starting with Resolved Tts Config. */
export type { ResolvedTtsConfig, ResolvedTtsModelOverrides } from "../tts/tts-types.js";
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

/** Re-exported API for src/plugin-sdk. */
export {
  scheduleCleanup,
  summarizeText,
  normalizeApplyTextNormalization,
  normalizeLanguageCode,
  normalizeSeed,
  requireInRange,
} from "../tts/tts-core.js";
/** Re-exported API for src/plugin-sdk, starting with parse Tts Directives. */
export { parseTtsDirectives } from "../tts/directives.js";
/** Re-exported API for src/plugin-sdk, starting with parse Speech Directive Number Override. */
export { parseSpeechDirectiveNumberOverride } from "../tts/directive-number.js";
/** Re-exported API for src/plugin-sdk. */
export {
  canonicalizeSpeechProviderId,
  getSpeechProvider,
  listLoadedSpeechProviders,
  listSpeechProviders,
  normalizeSpeechProviderId,
} from "../tts/provider-registry.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Effective Tts Config. */
export { resolveEffectiveTtsConfig } from "../tts/tts-config.js";
/** Re-exported API for src/plugin-sdk, starting with Tts Config Resolution Context. */
export type { TtsConfigResolutionContext } from "../tts/tts-config.js";
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
  formatProviderErrorPayload,
  formatProviderHttpErrorMessage,
  readResponseTextLimited,
  trimToUndefined,
  truncateErrorDetail,
} from "../agents/provider-http-errors.js";
