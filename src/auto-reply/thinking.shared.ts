// Shared thinking-level vocabulary and normalization helpers.
import {
  normalizeFastMode,
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
} from "../shared/string-coerce.js";

/** Fast-mode normalizer shared with thinking directive parsing. */
export { normalizeFastMode };

/** Canonical thinking effort requested for a model response. */
export type ThinkLevel =
  | "off"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "adaptive"
  | "max";
/** Verbosity level for model-visible or channel-visible diagnostics. */
export type VerboseLevel = "off" | "on" | "full";
/** Trace output level for debugging reasoning and provider payloads. */
export type TraceLevel = "off" | "on" | "raw";
/** Notice display level for reply-time status messages. */
export type NoticeLevel = "off" | "on" | "full";
/** User directive level for elevated approval behavior. */
export type ElevatedLevel = "off" | "on" | "ask" | "full";
/** Runtime approval mode derived from an elevated directive. */
export type ElevatedMode = "off" | "ask" | "full";
/** Reasoning visibility mode for response content and streaming. */
export type ReasoningLevel = "off" | "on" | "stream";
/** Token usage display mode requested by reply directives. */
export type UsageDisplayLevel = "off" | "tokens" | "full";
/** Provider catalog entry used to infer default thinking support. */
export type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  reasoning?: boolean;
  compat?: {
    thinkingFormat?: string;
    supportedReasoningEfforts?: readonly string[] | null;
  } | null;
};

/** Ordered baseline thinking levels exposed by simple selectors. */
export const BASE_THINKING_LEVELS: ThinkLevel[] = ["off", "minimal", "low", "medium", "high"];
/** Relative ordering used when comparing thinking effort levels. */
export const THINKING_LEVEL_RANKS: Record<ThinkLevel, number> = {
  off: 0,
  minimal: 10,
  low: 20,
  medium: 30,
  high: 40,
  adaptive: 30,
  xhigh: 60,
  max: 70,
};

// Normalize user-provided thinking level strings to the canonical enum.
/** Normalizes user-facing thinking aliases into canonical thinking levels. */
export function normalizeThinkLevel(raw?: string | null): ThinkLevel | undefined {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return undefined;
  }
  const collapsed = key.replace(/[\s_-]+/g, "");
  if (collapsed === "adaptive" || collapsed === "auto") {
    return "adaptive";
  }
  if (collapsed === "max") {
    return "max";
  }
  if (collapsed === "xhigh" || collapsed === "extrahigh") {
    return "xhigh";
  }
  if (["off"].includes(key)) {
    return "off";
  }
  if (["on", "enable", "enabled"].includes(key)) {
    return "low";
  }
  if (["min", "minimal"].includes(key)) {
    return "minimal";
  }
  if (["low", "thinkhard", "think-hard", "think_hard"].includes(key)) {
    return "low";
  }
  if (["mid", "med", "medium", "thinkharder", "think-harder", "harder"].includes(key)) {
    return "medium";
  }
  if (["high", "ultra", "ultrathink", "think-hard", "thinkhardest", "highest"].includes(key)) {
    return "high";
  }
  if (["think"].includes(key)) {
    return "minimal";
  }
  return undefined;
}

/** Detects directive values that clear or inherit session defaults. */
export function isSessionDefaultDirectiveValue(raw?: string | null): boolean {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return false;
  }
  return ["default", "inherit", "inherited", "clear", "reset", "unpin"].includes(key);
}

/** Formats the user-facing hint for xhigh-capable model selection. */
export function formatXHighModelHint(): string {
  return "provider models that advertise xhigh reasoning";
}

/** Chooses the default thinking level from provider/model catalog metadata. */
export function resolveThinkingDefaultForModel(params: {
  provider: string;
  model: string;
  catalog?: ThinkingCatalogEntry[];
}): ThinkLevel {
  const candidate = params.catalog?.find(
    (entry) => entry.provider === params.provider && entry.id === params.model,
  );
  if (candidate?.reasoning) {
    return "low";
  }
  return "off";
}

type OnOffFullLevel = "off" | "on" | "full";

function normalizeOnOffFullLevel(raw?: string | null): OnOffFullLevel | undefined {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return undefined;
  }
  if (["off", "false", "no", "0"].includes(key)) {
    return "off";
  }
  if (["full", "all", "everything"].includes(key)) {
    return "full";
  }
  if (["on", "minimal", "true", "yes", "1"].includes(key)) {
    return "on";
  }
  return undefined;
}

/** Normalizes verbose directive aliases into off/on/full. */
export function normalizeVerboseLevel(raw?: string | null): VerboseLevel | undefined {
  return normalizeOnOffFullLevel(raw);
}

/** Normalizes trace directive aliases, including raw trace mode. */
export function normalizeTraceLevel(raw?: string | null): TraceLevel | undefined {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return undefined;
  }
  if (["off", "false", "no", "0"].includes(key)) {
    return "off";
  }
  if (["on", "true", "yes", "1"].includes(key)) {
    return "on";
  }
  if (["raw", "unfiltered"].includes(key)) {
    return "raw";
  }
  return undefined;
}

/** Normalizes notice directive aliases into off/on/full. */
export function normalizeNoticeLevel(raw?: string | null): NoticeLevel | undefined {
  return normalizeOnOffFullLevel(raw);
}

/** Normalizes usage display aliases into token or full usage modes. */
export function normalizeUsageDisplay(raw?: string | null): UsageDisplayLevel | undefined {
  if (!raw) {
    return undefined;
  }
  const key = normalizeLowercaseStringOrEmpty(raw);
  if (["off", "false", "no", "0", "disable", "disabled"].includes(key)) {
    return "off";
  }
  if (["on", "true", "yes", "1", "enable", "enabled"].includes(key)) {
    return "tokens";
  }
  if (["tokens", "token", "tok", "minimal", "min"].includes(key)) {
    return "tokens";
  }
  if (["full", "session"].includes(key)) {
    return "full";
  }
  return undefined;
}

/** Resolves response usage display mode with off as the default. */
export function resolveResponseUsageMode(raw?: string | null): UsageDisplayLevel {
  return normalizeUsageDisplay(raw) ?? "off";
}

/** Normalizes elevated approval aliases into directive levels. */
export function normalizeElevatedLevel(raw?: string | null): ElevatedLevel | undefined {
  if (!raw) {
    return undefined;
  }
  const key = normalizeLowercaseStringOrEmpty(raw);
  if (["off", "false", "no", "0"].includes(key)) {
    return "off";
  }
  if (["full", "auto", "auto-approve", "autoapprove"].includes(key)) {
    return "full";
  }
  if (["ask", "prompt", "approval", "approve"].includes(key)) {
    return "ask";
  }
  if (["on", "true", "yes", "1"].includes(key)) {
    return "on";
  }
  return undefined;
}

/** Collapses elevated directive levels into runtime approval modes. */
export function resolveElevatedMode(level?: ElevatedLevel | null): ElevatedMode {
  if (!level || level === "off") {
    return "off";
  }
  if (level === "full") {
    return "full";
  }
  return "ask";
}

/** Normalizes reasoning visibility aliases into off/on/stream. */
export function normalizeReasoningLevel(raw?: string | null): ReasoningLevel | undefined {
  if (!raw) {
    return undefined;
  }
  const key = normalizeLowercaseStringOrEmpty(raw);
  if (["off", "false", "no", "0", "hide", "hidden", "disable", "disabled"].includes(key)) {
    return "off";
  }
  if (["on", "true", "yes", "1", "show", "visible", "enable", "enabled"].includes(key)) {
    return "on";
  }
  if (["stream", "streaming", "draft", "live"].includes(key)) {
    return "stream";
  }
  return undefined;
}
