// config types tts helpers and runtime behavior.
/** Shared type for Tts Provider in src/config. */
export type TtsProvider = string;

/** Shared type for Tts Mode in src/config. */
export type TtsMode = "final" | "all";

/** Shared type for Tts Auto Mode in src/config. */
export type TtsAutoMode = "off" | "always" | "inbound" | "tagged";

/** Shared type for Tts Model Override Config in src/config. */
export type TtsModelOverrideConfig = {
  /** Enable model-provided overrides for TTS. */
  enabled?: boolean;
  /** Allow model-provided TTS text blocks. */
  allowText?: boolean;
  /** Allow model-provided provider override (default: false). */
  allowProvider?: boolean;
  /** Allow model-provided voice/voiceId override. */
  allowVoice?: boolean;
  /** Allow model-provided modelId override. */
  allowModelId?: boolean;
  /** Allow model-provided voice settings override. */
  allowVoiceSettings?: boolean;
  /** Allow model-provided normalization or language overrides. */
  allowNormalization?: boolean;
  /** Allow model-provided seed override. */
  allowSeed?: boolean;
};

/** Shared type for Tts Provider Config Map in src/config. */
export type TtsProviderConfigMap = Record<string, Record<string, unknown>>;

/** Shared type for Tts Persona Fallback Policy in src/config. */
export type TtsPersonaFallbackPolicy = "preserve-persona" | "provider-defaults" | "fail";

/** Shared type for Tts Persona Prompt Config in src/config. */
export type TtsPersonaPromptConfig = {
  profile?: string;
  scene?: string;
  sampleContext?: string;
  style?: string;
  accent?: string;
  pacing?: string;
  constraints?: string[];
};

/** Shared type for Tts Persona Config in src/config. */
export type TtsPersonaConfig = {
  label?: string;
  description?: string;
  /** Preferred provider for this persona. Explicit provider prefs still win. */
  provider?: TtsProvider;
  fallbackPolicy?: TtsPersonaFallbackPolicy;
  prompt?: TtsPersonaPromptConfig;
  /** Provider-specific persona bindings keyed by speech provider id. */
  providers?: TtsProviderConfigMap;
};

/** Shared type for Resolved Tts Persona in src/config. */
export type ResolvedTtsPersona = TtsPersonaConfig & {
  id: string;
};

/** Shared type for Tts Config in src/config. */
export type TtsConfig = {
  /** Auto-TTS mode (preferred). */
  auto?: TtsAutoMode;
  /** @deprecated Use auto. */
  enabled?: boolean;
  /** Apply TTS to final replies only or to all replies (tool/block/final). */
  mode?: TtsMode;
  /** Primary TTS provider (fallbacks are automatic). */
  provider?: TtsProvider;
  /** Active TTS persona id. */
  persona?: string;
  /** Named TTS personas. */
  personas?: Record<string, TtsPersonaConfig>;
  /** Optional model override for TTS auto-summary (provider/model or alias). */
  summaryModel?: string;
  /** Allow the model to override TTS parameters. */
  modelOverrides?: TtsModelOverrideConfig;
  /** Provider-specific TTS settings keyed by speech provider id. */
  providers?: TtsProviderConfigMap;
  /** Optional path for local TTS user preferences JSON. */
  prefsPath?: string;
  /** Hard cap for text sent to TTS (chars). */
  maxTextLength?: number;
  /** API request timeout (ms). */
  timeoutMs?: number;
};
