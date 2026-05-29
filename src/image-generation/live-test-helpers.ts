// image-generation live test helpers helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  parseLiveCsvFilter,
  parseProviderModelMap,
  redactLiveApiKey,
  resolveConfiguredLiveProviderModels,
  resolveLiveAuthStore,
} from "../media-generation/live-test-helpers.js";
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

/** Re-exported API for src/image-generation, starting with parse Provider Model Map. */
export { parseProviderModelMap, redactLiveApiKey };

/** Reused constant for DEFAULT LIVE IMAGE MODELS behavior in src/image-generation. */
export const DEFAULT_LIVE_IMAGE_MODELS: Record<string, string> = {
  deepinfra: "deepinfra/black-forest-labs/FLUX-1-schnell",
  fal: "fal/fal-ai/flux/dev",
  google: "google/gemini-3.1-flash-image-preview",
  minimax: "minimax/image-01",
  openai: "openai/gpt-image-2",
  openrouter: "openrouter/google/gemini-3.1-flash-image-preview",
  vydra: "vydra/grok-imagine",
  xai: "xai/grok-imagine-image",
};

/** Reused helper for parse Case Filter behavior in src/image-generation. */
export function parseCaseFilter(raw?: string): Set<string> | null {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === "all") {
    return null;
  }
  const values = trimmed
    .split(",")
    .map((entry) => normalizeOptionalLowercaseString(entry))
    .filter((entry): entry is string => Boolean(entry));
  return values.length > 0 ? new Set(values) : null;
}

/** Reused helper for parse Csv Filter behavior in src/image-generation. */
export function parseCsvFilter(raw?: string): Set<string> | null {
  return parseLiveCsvFilter(raw, { lowercase: false });
}

/** Reused helper for resolve Configured Live Image Models behavior in src/image-generation. */
export function resolveConfiguredLiveImageModels(cfg: OpenClawConfig): Map<string, string> {
  return resolveConfiguredLiveProviderModels(cfg.agents?.defaults?.imageGenerationModel);
}

/** Reused helper for resolve Live Image Auth Store behavior in src/image-generation. */
export function resolveLiveImageAuthStore(params: {
  requireProfileKeys: boolean;
  hasLiveKeys: boolean;
}) {
  return resolveLiveAuthStore(params);
}
