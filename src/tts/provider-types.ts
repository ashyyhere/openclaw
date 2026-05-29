// tts provider types helpers and runtime behavior.
import type { TalkProviderConfig } from "../config/types.gateway.js";
import type { OpenClawConfig } from "../config/types.js";
import type { ResolvedTtsPersona } from "../config/types.tts.js";

/** Shared type for Speech Provider Id in src/tts. */
export type SpeechProviderId = string;

/** Shared type for Speech Synthesis Target in src/tts. */
export type SpeechSynthesisTarget = "audio-file" | "voice-note" | "telephony";

/** Shared type for Speech Provider Config in src/tts. */
export type SpeechProviderConfig = Record<string, unknown>;

/** Shared type for Speech Provider Overrides in src/tts. */
export type SpeechProviderOverrides = Record<string, unknown>;

/** Shared type for Speech Model Override Policy in src/tts. */
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

/** Shared type for Tts Directive Overrides in src/tts. */
export type TtsDirectiveOverrides = {
  ttsText?: string;
  provider?: SpeechProviderId;
  providerOverrides?: Record<string, SpeechProviderOverrides>;
};

/** Shared type for Tts Directive Parse Result in src/tts. */
export type TtsDirectiveParseResult = {
  cleanedText: string;
  ttsText?: string;
  hasDirective: boolean;
  overrides: TtsDirectiveOverrides;
  warnings: string[];
};

/** Shared type for Speech Provider Configured Context in src/tts. */
export type SpeechProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  timeoutMs: number;
};

/** Shared type for Speech Synthesis Request in src/tts. */
export type SpeechSynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};

/** Shared type for Speech Synthesis Result in src/tts. */
export type SpeechSynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
};

/** Shared type for Speech Synthesis Stream Request in src/tts. */
export type SpeechSynthesisStreamRequest = SpeechSynthesisRequest;

/** Shared type for Speech Synthesis Stream Result in src/tts. */
export type SpeechSynthesisStreamResult = {
  audioStream: ReadableStream<Uint8Array>;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
  release?: () => Promise<void>;
};

/** Shared type for Speech Telephony Synthesis Request in src/tts. */
export type SpeechTelephonySynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};

/** Shared type for Speech Telephony Synthesis Result in src/tts. */
export type SpeechTelephonySynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  sampleRate: number;
};

/** Shared type for Speech Provider Prepare Synthesis Context in src/tts. */
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

/** Shared type for Speech Provider Prepared Synthesis in src/tts. */
export type SpeechProviderPreparedSynthesis = {
  text?: string;
  providerConfig?: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
};

/** Shared type for Speech Voice Option in src/tts. */
export type SpeechVoiceOption = {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  locale?: string;
  gender?: string;
  personalities?: string[];
};

/** Shared type for Speech List Voices Request in src/tts. */
export type SpeechListVoicesRequest = {
  cfg?: OpenClawConfig;
  providerConfig?: SpeechProviderConfig;
  apiKey?: string;
  baseUrl?: string;
};

/** Shared type for Speech Provider Resolve Config Context in src/tts. */
export type SpeechProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: Record<string, unknown>;
  timeoutMs: number;
};

/** Shared type for Speech Directive Token Parse Context in src/tts. */
export type SpeechDirectiveTokenParseContext = {
  key: string;
  value: string;
  policy: SpeechModelOverridePolicy;
  selectedProvider?: SpeechProviderId;
  providerConfig?: SpeechProviderConfig;
  currentOverrides?: SpeechProviderOverrides;
};

/** Shared type for Speech Directive Token Parse Result in src/tts. */
export type SpeechDirectiveTokenParseResult = {
  handled: boolean;
  overrides?: SpeechProviderOverrides;
  warnings?: string[];
};

/** Shared type for Speech Provider Resolve Talk Config Context in src/tts. */
export type SpeechProviderResolveTalkConfigContext = {
  cfg: OpenClawConfig;
  baseTtsConfig: Record<string, unknown>;
  talkProviderConfig: TalkProviderConfig;
  timeoutMs: number;
};

/** Shared type for Speech Provider Resolve Talk Overrides Context in src/tts. */
export type SpeechProviderResolveTalkOverridesContext = {
  talkProviderConfig: TalkProviderConfig;
  params: Record<string, unknown>;
};
