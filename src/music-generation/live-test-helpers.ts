// music-generation live test helpers helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.js";
import {
  parseLiveCsvFilter,
  parseProviderModelMap,
  redactLiveApiKey,
  resolveConfiguredLiveProviderModels,
  resolveLiveAuthStore,
} from "../media-generation/live-test-helpers.js";

/** Re-exported API for src/music-generation, starting with parse Provider Model Map. */
export { parseProviderModelMap, redactLiveApiKey };

/** Reused constant for DEFAULT LIVE MUSIC MODELS behavior in src/music-generation. */
export const DEFAULT_LIVE_MUSIC_MODELS: Record<string, string> = {
  fal: "fal/fal-ai/minimax-music/v2.6",
  google: "google/lyria-3-clip-preview",
  minimax: "minimax/music-2.6",
  openrouter: "openrouter/google/lyria-3-pro-preview",
};

/** Reused helper for parse Csv Filter behavior in src/music-generation. */
export function parseCsvFilter(raw?: string): Set<string> | null {
  return parseLiveCsvFilter(raw);
}

/** Reused helper for resolve Configured Live Music Models behavior in src/music-generation. */
export function resolveConfiguredLiveMusicModels(cfg: OpenClawConfig): Map<string, string> {
  return resolveConfiguredLiveProviderModels(cfg.agents?.defaults?.musicGenerationModel);
}

/** Reused helper for resolve Live Music Auth Store behavior in src/music-generation. */
export function resolveLiveMusicAuthStore(params: {
  requireProfileKeys: boolean;
  hasLiveKeys: boolean;
}) {
  return resolveLiveAuthStore(params);
}
