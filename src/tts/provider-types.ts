/** Shared TTS provider contracts for synthesis, streaming, telephony, and directives. */
import type { TalkProviderConfig } from "../config/types.gateway.js";
import type { OpenClawConfig } from "../config/types.js";
import type { ResolvedTtsPersona } from "../config/types.tts.js";

/** Provider id used in config, directive overrides, and registry lookups. */
export type SpeechProviderId = string;

/** Output class requested from a speech provider. */
export type SpeechSynthesisTarget = "audio-file" | "voice-note" | "telephony";

/** Provider-specific resolved config payload. */
export type SpeechProviderConfig = Record<string, unknown>;

/** Per-request provider-specific override payload. */
export type SpeechProviderOverrides = Record<string, unknown>;

/** Directive policy describing which speech fields users may override. */
export type SpeechModelOverridePolicy = {
  enabled: boolean;
  allowText: boolean;
  allowProvider: boolean;
  allowVoice: boolean;
  allowModelId: boolean;
  allowVoiceSettings: boolean;
  allowNormalization: boolean;
  allowSeed: boolean;
};

/** Overrides extracted from an inline TTS directive. */
export type TtsDirectiveOverrides = {
  ttsText?: string;
  provider?: SpeechProviderId;
  providerOverrides?: Record<string, SpeechProviderOverrides>;
};

/** Parsed directive result plus cleaned message text and warnings. */
export type TtsDirectiveParseResult = {
  cleanedText: string;
  ttsText?: string;
  hasDirective: boolean;
  overrides: TtsDirectiveOverrides;
  warnings: string[];
};

/** Context passed to providers after config resolution. */
export type SpeechProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  timeoutMs: number;
};

/** Request passed to file/voice-note speech synthesis providers. */
export type SpeechSynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};

/** In-memory audio result returned by non-streaming speech synthesis. */
export type SpeechSynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
};

/** Streaming synthesis currently uses the same input as buffered synthesis. */
export type SpeechSynthesisStreamRequest = SpeechSynthesisRequest;

/** Streamed audio result with optional provider resource cleanup. */
export type SpeechSynthesisStreamResult = {
  audioStream: ReadableStream<Uint8Array>;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
  release?: () => Promise<void>;
};

/** Request for telephony-compatible speech audio generation. */
export type SpeechTelephonySynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};

/** Telephony audio result including sample rate for downstream transports. */
export type SpeechTelephonySynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  sampleRate: number;
};

/** Context providers can inspect before final synthesis config is chosen. */
export type SpeechProviderPrepareSynthesisContext = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  persona?: ResolvedTtsPersona;
  personaProviderConfig?: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  timeoutMs: number;
};

/** Provider preparation result that can rewrite text, config, or overrides. */
export type SpeechProviderPreparedSynthesis = {
  text?: string;
  providerConfig?: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
};

/** Voice metadata exposed by provider voice-listing APIs. */
export type SpeechVoiceOption = {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  locale?: string;
  gender?: string;
  personalities?: string[];
};

/** Request context for listing voices from a provider. */
export type SpeechListVoicesRequest = {
  cfg?: OpenClawConfig;
  providerConfig?: SpeechProviderConfig;
  apiKey?: string;
  baseUrl?: string;
};

/** Context used when converting raw provider config into resolved config. */
export type SpeechProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: Record<string, unknown>;
  timeoutMs: number;
};

/** Context for provider-specific inline directive token parsing. */
export type SpeechDirectiveTokenParseContext = {
  key: string;
  value: string;
  policy: SpeechModelOverridePolicy;
  selectedProvider?: SpeechProviderId;
  providerConfig?: SpeechProviderConfig;
  currentOverrides?: SpeechProviderOverrides;
};

/** Provider-specific directive parse outcome and warnings. */
export type SpeechDirectiveTokenParseResult = {
  handled: boolean;
  overrides?: SpeechProviderOverrides;
  warnings?: string[];
};

/** Context for deriving TTS config from a gateway talk provider config. */
export type SpeechProviderResolveTalkConfigContext = {
  cfg: OpenClawConfig;
  baseTtsConfig: Record<string, unknown>;
  talkProviderConfig: TalkProviderConfig;
  timeoutMs: number;
};

/** Context for deriving per-request overrides from talk tool params. */
export type SpeechProviderResolveTalkOverridesContext = {
  talkProviderConfig: TalkProviderConfig;
  params: Record<string, unknown>;
};
