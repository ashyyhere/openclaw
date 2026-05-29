/** Runtime SDK types for text-to-speech provider configuration. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ResolvedTtsPersona, TtsAutoMode, TtsProvider } from "../config/types.tts.js";
import type {
  SpeechProviderConfig,
  SpeechVoiceOption,
  TtsDirectiveOverrides,
  TtsDirectiveParseResult,
} from "../tts/provider-types.js";
import type { TtsConfigResolutionContext } from "../tts/tts-config.js";
import type { ResolvedTtsConfig, ResolvedTtsModelOverrides } from "../tts/tts-types.js";
import type { ReplyPayload } from "./reply-payload.js";

/** Re-exported API for src/plugin-sdk, starting with Resolved Tts Config. */
export type { ResolvedTtsConfig, ResolvedTtsModelOverrides };
/** Re-exported API for src/plugin-sdk, starting with Tts Config Resolution Context. */
export type { TtsConfigResolutionContext };
/** Re-exported API for src/plugin-sdk, starting with Tts Directive Overrides. */
export type { TtsDirectiveOverrides, TtsDirectiveParseResult };

/** Shared type for Tts Attempt Reason Code in src/plugin-sdk. */
export type TtsAttemptReasonCode =
  | "success"
  | "no_provider_registered"
  | "not_configured"
  | "unsupported_for_streaming"
  | "unsupported_for_telephony"
  | "timeout"
  | "provider_error";

/** Shared type for Tts Provider Attempt in src/plugin-sdk. */
export type TtsProviderAttempt = {
  provider: string;
  outcome: "success" | "skipped" | "failed";
  reasonCode: TtsAttemptReasonCode;
  persona?: string;
  personaBinding?: "applied" | "missing" | "none";
  latencyMs?: number;
  error?: string;
};

/** Shared type for Tts Status Entry in src/plugin-sdk. */
export type TtsStatusEntry = {
  timestamp: number;
  success: boolean;
  textLength: number;
  summarized: boolean;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  latencyMs?: number;
  error?: string;
};

/** Shared type for Tts Speech Target in src/plugin-sdk. */
export type TtsSpeechTarget = "audio-file" | "voice-note";

/** Shared type for Summarize Result in src/plugin-sdk. */
export type SummarizeResult = {
  summary: string;
  latencyMs: number;
  inputLength: number;
  outputLength: number;
};

/** Shared type for Resolve Tts Auto Mode Params in src/plugin-sdk. */
export type ResolveTtsAutoModeParams = {
  config: ResolvedTtsConfig;
  prefsPath: string;
  sessionAuto?: string;
};

/** Shared type for Resolve Explicit Tts Overrides Params in src/plugin-sdk. */
export type ResolveExplicitTtsOverridesParams = {
  cfg: OpenClawConfig;
  prefsPath?: string;
  provider?: string;
  modelId?: string;
  voiceId?: string;
  agentId?: string;
  channelId?: string;
  accountId?: string;
};

/** Shared type for Tts Request Params in src/plugin-sdk. */
export type TtsRequestParams = {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
};

/** Shared type for Tts Telephony Request Params in src/plugin-sdk. */
export type TtsTelephonyRequestParams = {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  overrides?: TtsDirectiveOverrides;
};

/** Shared type for List Speech Voices Params in src/plugin-sdk. */
export type ListSpeechVoicesParams = {
  provider: string;
  cfg?: OpenClawConfig;
  config?: ResolvedTtsConfig;
  apiKey?: string;
  baseUrl?: string;
};

/** Shared type for Maybe Apply Tts To Payload Params in src/plugin-sdk. */
export type MaybeApplyTtsToPayloadParams = {
  payload: ReplyPayload;
  cfg: OpenClawConfig;
  channel?: string;
  kind?: "tool" | "block" | "final";
  inboundAudio?: boolean;
  ttsAuto?: string;
  agentId?: string;
  accountId?: string;
};

/** Shared type for Tts Test Facade in src/plugin-sdk. */
export type TtsTestFacade = {
  parseTtsDirectives: (...args: unknown[]) => TtsDirectiveParseResult;
  resolveModelOverridePolicy: (...args: unknown[]) => ResolvedTtsModelOverrides;
  supportsNativeVoiceNoteTts: (channel: string | undefined) => boolean;
  supportsTranscodedVoiceNoteTts: (channel: string | undefined) => boolean;
  shouldDeliverTtsAsVoice: (params: {
    channel: string | undefined;
    target: TtsSpeechTarget | undefined;
    voiceCompatible: boolean | undefined;
    fileExtension?: string;
    outputFormat?: string;
  }) => boolean;
  summarizeText: (...args: unknown[]) => Promise<SummarizeResult>;
  getResolvedSpeechProviderConfig: (
    config: ResolvedTtsConfig,
    providerId: string,
    cfg?: OpenClawConfig,
  ) => SpeechProviderConfig;
  formatTtsProviderError: (provider: TtsProvider, err: unknown) => string;
  sanitizeTtsErrorForLog: (err: unknown) => string;
};

/** Shared type for Tts Result in src/plugin-sdk. */
export type TtsResult = {
  success: boolean;
  audioPath?: string;
  error?: string;
  latencyMs?: number;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  audioAsVoice?: boolean;
  target?: TtsSpeechTarget;
};

/** Shared type for Tts Synthesis Result in src/plugin-sdk. */
export type TtsSynthesisResult = {
  success: boolean;
  audioBuffer?: Buffer;
  error?: string;
  latencyMs?: number;
  provider?: string;
  providerModel?: string;
  providerVoice?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  fileExtension?: string;
  target?: TtsSpeechTarget;
};

/** Shared type for Tts Stream Result in src/plugin-sdk. */
export type TtsStreamResult = {
  success: boolean;
  audioStream?: ReadableStream<Uint8Array>;
  error?: string;
  latencyMs?: number;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  fileExtension?: string;
  target?: TtsSpeechTarget;
  release?: () => Promise<void>;
};

/** Shared type for Tts Synthesis Stream Result in src/plugin-sdk. */
export type TtsSynthesisStreamResult = TtsStreamResult;

/** Shared type for Tts Telephony Result in src/plugin-sdk. */
export type TtsTelephonyResult = {
  success: boolean;
  audioBuffer?: Buffer;
  error?: string;
  latencyMs?: number;
  provider?: string;
  providerModel?: string;
  providerVoice?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  sampleRate?: number;
};

/** Shared type for Text To Speech in src/plugin-sdk. */
export type TextToSpeech = (params: TtsRequestParams) => Promise<TtsResult>;
/** Shared type for Text To Speech Stream in src/plugin-sdk. */
export type TextToSpeechStream = (params: TtsRequestParams) => Promise<TtsStreamResult>;
/** Shared type for Text To Speech Telephony in src/plugin-sdk. */
export type TextToSpeechTelephony = (
  params: TtsTelephonyRequestParams,
) => Promise<TtsTelephonyResult>;
/** Shared type for List Speech Voices in src/plugin-sdk. */
export type ListSpeechVoices = (params: ListSpeechVoicesParams) => Promise<SpeechVoiceOption[]>;

/** Shared type for Tts Runtime Facade in src/plugin-sdk. */
export type TtsRuntimeFacade = {
  /** @deprecated Use `testApi`. */
  _test: TtsTestFacade;
  testApi: TtsTestFacade;
  buildTtsSystemPromptHint: (cfg: OpenClawConfig, agentId?: string) => string | undefined;
  getLastTtsAttempt: () => TtsStatusEntry | undefined;
  getResolvedSpeechProviderConfig: (
    config: ResolvedTtsConfig,
    providerId: string,
    cfg?: OpenClawConfig,
  ) => SpeechProviderConfig;
  getTtsMaxLength: (prefsPath: string) => number;
  getTtsPersona: (config: ResolvedTtsConfig, prefsPath: string) => ResolvedTtsPersona | undefined;
  getTtsProvider: (config: ResolvedTtsConfig, prefsPath: string) => TtsProvider;
  isSummarizationEnabled: (prefsPath: string) => boolean;
  isTtsEnabled: (config: ResolvedTtsConfig, prefsPath: string, sessionAuto?: string) => boolean;
  isTtsProviderConfigured: (
    config: ResolvedTtsConfig,
    provider: TtsProvider,
    cfg?: OpenClawConfig,
  ) => boolean;
  listSpeechVoices: ListSpeechVoices;
  listTtsPersonas: (config: ResolvedTtsConfig) => ResolvedTtsPersona[];
  maybeApplyTtsToPayload: (params: MaybeApplyTtsToPayloadParams) => Promise<ReplyPayload>;
  resolveExplicitTtsOverrides: (params: ResolveExplicitTtsOverridesParams) => TtsDirectiveOverrides;
  resolveTtsAutoMode: (params: ResolveTtsAutoModeParams) => TtsAutoMode;
  resolveTtsConfig: (
    cfg: OpenClawConfig,
    contextOrAgentId?: string | TtsConfigResolutionContext,
  ) => ResolvedTtsConfig;
  resolveTtsPrefsPath: (config: ResolvedTtsConfig) => string;
  resolveTtsProviderOrder: (primary: TtsProvider, cfg?: OpenClawConfig) => TtsProvider[];
  setLastTtsAttempt: (entry: TtsStatusEntry | undefined) => void;
  setSummarizationEnabled: (prefsPath: string, enabled: boolean) => void;
  setTtsAutoMode: (prefsPath: string, mode: TtsAutoMode) => void;
  setTtsEnabled: (prefsPath: string, enabled: boolean) => void;
  setTtsMaxLength: (prefsPath: string, maxLength: number) => void;
  setTtsPersona: (prefsPath: string, persona: string | null | undefined) => void;
  setTtsProvider: (prefsPath: string, provider: TtsProvider) => void;
  synthesizeSpeech: (params: TtsRequestParams) => Promise<TtsSynthesisResult>;
  streamSpeech: (params: TtsRequestParams) => Promise<TtsSynthesisStreamResult>;
  textToSpeech: TextToSpeech;
  textToSpeechStream: TextToSpeechStream;
  textToSpeechTelephony: TextToSpeechTelephony;
};
