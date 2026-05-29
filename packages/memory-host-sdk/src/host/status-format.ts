// Status tone and state helpers for memory health summaries.
/** Small status tone vocabulary used by memory UI/CLI surfaces. */
export type Tone = "ok" | "warn" | "muted";

/** Converts vector-search availability into display tone and state. */
export function resolveMemoryVectorState(vector: { enabled: boolean; available?: boolean }): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled" | "unknown";
} {
  if (!vector.enabled) {
    return { tone: "muted", state: "disabled" };
  }
  if (vector.available === true) {
    return { tone: "ok", state: "ready" };
  }
  if (vector.available === false) {
    return { tone: "warn", state: "unavailable" };
  }
  return { tone: "muted", state: "unknown" };
}

/** Converts FTS availability into display tone and state. */
export function resolveMemoryFtsState(fts: { enabled: boolean; available: boolean }): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled";
} {
  if (!fts.enabled) {
    return { tone: "muted", state: "disabled" };
  }
  return fts.available ? { tone: "ok", state: "ready" } : { tone: "warn", state: "unavailable" };
}

/** Builds a compact cache status label with optional entry count. */
export function resolveMemoryCacheSummary(cache: { enabled: boolean; entries?: number }): {
  tone: Tone;
  text: string;
} {
  if (!cache.enabled) {
    return { tone: "muted", text: "cache off" };
  }
  const suffix = typeof cache.entries === "number" ? ` (${cache.entries})` : "";
  return { tone: "ok", text: `cache on${suffix}` };
}

/** Converts cache enablement into display tone and state. */
export function resolveMemoryCacheState(cache: { enabled: boolean }): {
  tone: Tone;
  state: "enabled" | "disabled";
} {
  return cache.enabled ? { tone: "ok", state: "enabled" } : { tone: "muted", state: "disabled" };
}
