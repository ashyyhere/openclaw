// Public speech helpers for bundled or third-party plugins.
//
// Keep this surface provider-facing: types, validation, directive parsing, and
// registry helpers. Runtime synthesis lives on `api.runtime.tts` or narrower
// core/runtime seams, not here.

/** Speech provider plugin contract exposed through the public SDK. */
export type { SpeechProviderPlugin } from "../plugins/types.js";
/** Speech provider request, config, directive, and voice option types. */
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

/** Parses inline TTS directives into speech provider overrides. */
export { parseTtsDirectives } from "../tts/directives.js";
/** Speech provider registry helpers exposed to provider plugins. */
export {
  canonicalizeSpeechProviderId,
  getSpeechProvider,
  listSpeechProviders,
  normalizeSpeechProviderId,
} from "../tts/provider-registry.js";
/** TTS auto-mode normalization shared with speech plugins. */
export { normalizeTtsAutoMode, TTS_AUTO_MODES } from "../tts/tts-auto-mode.js";
/** HTTP/provider error helpers for speech plugin implementations. */
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
/** Speech provider normalization and cleanup helper exports. */
export {
  normalizeApplyTextNormalization,
  normalizeLanguageCode,
  normalizeSeed,
  requireInRange,
  scheduleCleanup,
} from "../tts/tts-provider-helpers.js";
/** Factory and config types for OpenAI-compatible speech providers. */
export {
  createOpenAiCompatibleSpeechProvider,
  type OpenAiCompatibleSpeechProviderBaseUrlPolicy,
  type OpenAiCompatibleSpeechProviderConfig,
  type OpenAiCompatibleSpeechProviderExtraJsonBodyField,
  type OpenAiCompatibleSpeechProviderOptions,
} from "../tts/openai-compatible-speech-provider.js";
