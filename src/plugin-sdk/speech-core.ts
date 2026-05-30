// Shared speech-provider implementation helpers for bundled and third-party plugins.

/** Speech provider plugin contract exposed through the SDK. */
export type { SpeechProviderPlugin } from "../plugins/types.js";
/** Resolved TTS config shapes consumed after provider/user overrides merge. */
export type { ResolvedTtsConfig, ResolvedTtsModelOverrides } from "../tts/tts-types.js";
/** Speech provider request, override, directive, and voice-list contract types. */
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

/** Core text, numeric, language, seed, and cleanup helpers shared by speech providers. */
export {
  scheduleCleanup,
  summarizeText,
  normalizeApplyTextNormalization,
  normalizeLanguageCode,
  normalizeSeed,
  requireInRange,
} from "../tts/tts-core.js";
/** Parses inline TTS directives from user-facing speech text. */
export { parseTtsDirectives } from "../tts/directives.js";
/** Parses numeric speech directive overrides such as speed or pitch values. */
export { parseSpeechDirectiveNumberOverride } from "../tts/directive-number.js";
/** Speech provider registry helpers for canonical ids and loaded provider lookup. */
export {
  canonicalizeSpeechProviderId,
  getSpeechProvider,
  listLoadedSpeechProviders,
  listSpeechProviders,
  normalizeSpeechProviderId,
} from "../tts/provider-registry.js";
/** Resolves effective TTS config after provider defaults, config, and directive overrides. */
export { resolveEffectiveTtsConfig } from "../tts/tts-config.js";
/** Context object accepted by effective TTS config resolution. */
export type { TtsConfigResolutionContext } from "../tts/tts-config.js";
/** Auto-mode normalizer and allowed values for TTS provider selection. */
export { normalizeTtsAutoMode, TTS_AUTO_MODES } from "../tts/tts-auto-mode.js";
/** HTTP provider error parsing and formatting helpers for speech provider implementations. */
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
