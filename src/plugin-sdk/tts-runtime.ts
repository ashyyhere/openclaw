/** Runtime SDK barrel for text-to-speech provider helpers. */
export {
  TtsAutoSchema,
  TtsConfigSchema,
  TtsModeSchema,
  TtsProviderSchema,
} from "../config/zod-schema.core.js";

/** Reused helper for prewarm Tts Runtime Facade behavior in src/plugin-sdk. */
export function prewarmTtsRuntimeFacade(): void {}

/** Re-exported API for src/plugin-sdk. */
export {
  buildTtsSystemPromptHint,
  getLastTtsAttempt,
  getResolvedSpeechProviderConfig,
  getTtsMaxLength,
  getTtsPersona,
  getTtsProvider,
  isSummarizationEnabled,
  isTtsEnabled,
  isTtsProviderConfigured,
  listSpeechVoices,
  listTtsPersonas,
  maybeApplyTtsToPayload,
  resolveExplicitTtsOverrides,
  resolveTtsAutoMode,
  resolveTtsConfig,
  resolveTtsPrefsPath,
  resolveTtsProviderOrder,
  setLastTtsAttempt,
  setSummarizationEnabled,
  setTtsAutoMode,
  setTtsEnabled,
  setTtsMaxLength,
  setTtsPersona,
  setTtsProvider,
  synthesizeSpeech,
  streamSpeech,
  textToSpeech,
  textToSpeechStream,
  textToSpeechTelephony,
  testApi,
  testApi as _test,
  type ResolvedTtsConfig,
  type ResolvedTtsModelOverrides,
  type TtsDirectiveOverrides,
  type TtsDirectiveParseResult,
  type TtsResult,
  type TtsSynthesisResult,
  type TtsSynthesisStreamResult,
  type TtsStreamResult,
  type TtsTelephonyResult,
} from "../../packages/speech-core/runtime-api.js";
