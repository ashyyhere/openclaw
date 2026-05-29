// Runtime request/result types for selecting music providers and reporting fallback attempts.
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { FallbackAttempt } from "../agents/model-fallback.types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type {
  GeneratedMusicAsset,
  MusicGenerationIgnoredOverride,
  MusicGenerationNormalization,
  MusicGenerationOutputFormat,
  MusicGenerationProvider,
  MusicGenerationSourceImage,
} from "./types.js";

/** High-level runtime request before provider/model fallback resolution. */
export type GenerateMusicParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
  inputImages?: MusicGenerationSourceImage[];
  autoProviderFallback?: boolean;
  /** Optional per-request provider timeout in milliseconds. */
  timeoutMs?: number;
};

/** Runtime response including selected provider/model, fallback trace, assets, and ignored overrides. */
export type GenerateMusicRuntimeResult = {
  tracks: GeneratedMusicAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  lyrics?: string[];
  normalization?: MusicGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: MusicGenerationIgnoredOverride[];
};

/** Input for provider listing; config is needed to include plugin capability providers. */
export type ListRuntimeMusicGenerationProvidersParams = {
  config?: OpenClawConfig;
};

/** Runtime-visible provider shape, currently identical to the plugin provider contract. */
export type RuntimeMusicGenerationProvider = MusicGenerationProvider;
