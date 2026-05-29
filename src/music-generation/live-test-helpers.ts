// Live-test helpers for selecting configured music models and auth stores.
import type { OpenClawConfig } from "../config/types.js";
import {
  parseLiveCsvFilter,
  parseProviderModelMap,
  redactLiveApiKey,
  resolveConfiguredLiveProviderModels,
  resolveLiveAuthStore,
} from "../media-generation/live-test-helpers.js";

/** Re-export shared live-test parsers so music tests use the same env syntax as media generation. */
export { parseProviderModelMap, redactLiveApiKey };

/** Default provider/model refs used when live music tests are enabled without explicit overrides. */
export const DEFAULT_LIVE_MUSIC_MODELS: Record<string, string> = {
  fal: "fal/fal-ai/minimax-music/v2.6",
  google: "google/lyria-3-clip-preview",
  minimax: "minimax/music-2.6",
  openrouter: "openrouter/google/lyria-3-pro-preview",
};

/** Parses comma-separated provider/model filters for live music tests. */
export function parseCsvFilter(raw?: string): Set<string> | null {
  return parseLiveCsvFilter(raw);
}

/** Resolves live-test music model overrides from the OpenClaw config default. */
export function resolveConfiguredLiveMusicModels(cfg: OpenClawConfig): Map<string, string> {
  return resolveConfiguredLiveProviderModels(cfg.agents?.defaults?.musicGenerationModel);
}

/** Resolves whether live music tests should use profile-backed auth or direct env keys. */
export function resolveLiveMusicAuthStore(params: {
  requireProfileKeys: boolean;
  hasLiveKeys: boolean;
}) {
  return resolveLiveAuthStore(params);
}
