// Live image-generation test configuration and auth helpers.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  parseLiveCsvFilter,
  parseProviderModelMap,
  redactLiveApiKey,
  resolveConfiguredLiveProviderModels,
  resolveLiveAuthStore,
} from "../media-generation/live-test-helpers.js";
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

/** Shared live-test provider/model parsing and key redaction helpers. */
export { parseProviderModelMap, redactLiveApiKey };

/** Default provider/model refs used when live image tests do not override models. */
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

/** Parses comma-separated live test case filters, lowercased for case ids. */
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

/** Parses comma-separated live image provider/model filters without lowercasing. */
export function parseCsvFilter(raw?: string): Set<string> | null {
  return parseLiveCsvFilter(raw, { lowercase: false });
}

/** Resolves configured live image provider/model refs from default agent config. */
export function resolveConfiguredLiveImageModels(cfg: OpenClawConfig): Map<string, string> {
  return resolveConfiguredLiveProviderModels(cfg.agents?.defaults?.imageGenerationModel);
}

/** Resolves whether live tests should use profile auth or exported live keys. */
export function resolveLiveImageAuthStore(params: {
  requireProfileKeys: boolean;
  hasLiveKeys: boolean;
}) {
  return resolveLiveAuthStore(params);
}
