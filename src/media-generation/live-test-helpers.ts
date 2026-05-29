// media-generation live test helpers helpers and runtime behavior.
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

type LiveProviderModelConfig =
  | string
  | {
      primary?: string;
      fallbacks?: readonly string[];
    }
  | undefined;

/** Reused helper for redact Live Api Key behavior in src/media-generation. */
export function redactLiveApiKey(value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "none";
  }
  if (trimmed.length <= 12) {
    return trimmed;
  }
  return `${trimmed.slice(0, 8)}...${trimmed.slice(-4)}`;
}

/** Reused helper for parse Live Csv Filter behavior in src/media-generation. */
export function parseLiveCsvFilter(
  raw?: string,
  options: { lowercase?: boolean } = {},
): Set<string> | null {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === "all") {
    return null;
  }
  const values = trimmed
    .split(",")
    .map((entry) =>
      options.lowercase === false ? entry.trim() : normalizeOptionalLowercaseString(entry),
    )
    .filter((entry): entry is string => Boolean(entry));
  return values.length > 0 ? new Set(values) : null;
}

/** Reused helper for parse Provider Model Map behavior in src/media-generation. */
export function parseProviderModelMap(raw?: string): Map<string, string> {
  const entries = new Map<string, string>();
  for (const token of raw?.split(",") ?? []) {
    const trimmed = token.trim();
    if (!trimmed) {
      continue;
    }
    const slash = trimmed.indexOf("/");
    if (slash <= 0 || slash === trimmed.length - 1) {
      continue;
    }
    const providerId = normalizeOptionalLowercaseString(trimmed.slice(0, slash));
    if (!providerId) {
      continue;
    }
    entries.set(providerId, trimmed);
  }
  return entries;
}

/** Reused helper for resolve Configured Live Provider Models behavior in src/media-generation. */
export function resolveConfiguredLiveProviderModels(
  configured: LiveProviderModelConfig,
): Map<string, string> {
  const resolved = new Map<string, string>();
  const add = (value: string | undefined) => {
    const trimmed = value?.trim();
    if (!trimmed) {
      return;
    }
    const slash = trimmed.indexOf("/");
    if (slash <= 0 || slash === trimmed.length - 1) {
      return;
    }
    const providerId = normalizeOptionalLowercaseString(trimmed.slice(0, slash));
    if (!providerId) {
      return;
    }
    resolved.set(providerId, trimmed);
  };
  if (typeof configured === "string") {
    add(configured);
    return resolved;
  }
  add(configured?.primary);
  for (const fallback of configured?.fallbacks ?? []) {
    add(fallback);
  }
  return resolved;
}

/** Reused helper for resolve Live Auth Store behavior in src/media-generation. */
export function resolveLiveAuthStore(params: {
  requireProfileKeys: boolean;
  hasLiveKeys: boolean;
}): AuthProfileStore | undefined {
  if (params.requireProfileKeys || !params.hasLiveKeys) {
    return undefined;
  }
  return {
    version: 1,
    profiles: {},
  };
}
