// Shared thinking-level vocabulary and normalization helpers.
import {
  normalizeFastMode,
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
} from "../shared/string-coerce.js";

/** Re-exported API for src/auto-reply, starting with normalize Fast Mode. */
export { normalizeFastMode };

/** Shared type for Think Level in src/auto-reply. */
export type ThinkLevel =
  | "off"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "adaptive"
  | "max";
/** Shared type for Verbose Level in src/auto-reply. */
export type VerboseLevel = "off" | "on" | "full";
/** Shared type for Trace Level in src/auto-reply. */
export type TraceLevel = "off" | "on" | "raw";
/** Shared type for Notice Level in src/auto-reply. */
export type NoticeLevel = "off" | "on" | "full";
/** Shared type for Elevated Level in src/auto-reply. */
export type ElevatedLevel = "off" | "on" | "ask" | "full";
/** Shared type for Elevated Mode in src/auto-reply. */
export type ElevatedMode = "off" | "ask" | "full";
/** Shared type for Reasoning Level in src/auto-reply. */
export type ReasoningLevel = "off" | "on" | "stream";
/** Shared type for Usage Display Level in src/auto-reply. */
export type UsageDisplayLevel = "off" | "tokens" | "full";
/** Shared type for Thinking Catalog Entry in src/auto-reply. */
export type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  reasoning?: boolean;
  compat?: {
    thinkingFormat?: string;
    supportedReasoningEfforts?: readonly string[] | null;
  } | null;
};

/** Reused constant for BASE THINKING LEVELS behavior in src/auto-reply. */
export const BASE_THINKING_LEVELS: ThinkLevel[] = ["off", "minimal", "low", "medium", "high"];
/** Reused constant for THINKING LEVEL RANKS behavior in src/auto-reply. */
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
/** Reused helper for normalize Think Level behavior in src/auto-reply. */
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

/** Reused helper for is Session Default Directive Value behavior in src/auto-reply. */
export function isSessionDefaultDirectiveValue(raw?: string | null): boolean {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return false;
  }
  return ["default", "inherit", "inherited", "clear", "reset", "unpin"].includes(key);
}

/** Reused helper for format XHigh Model Hint behavior in src/auto-reply. */
export function formatXHighModelHint(): string {
  return "provider models that advertise xhigh reasoning";
}

/** Reused helper for resolve Thinking Default For Model behavior in src/auto-reply. */
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

/** Reused helper for normalize Verbose Level behavior in src/auto-reply. */
export function normalizeVerboseLevel(raw?: string | null): VerboseLevel | undefined {
  return normalizeOnOffFullLevel(raw);
}

/** Reused helper for normalize Trace Level behavior in src/auto-reply. */
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

/** Reused helper for normalize Notice Level behavior in src/auto-reply. */
export function normalizeNoticeLevel(raw?: string | null): NoticeLevel | undefined {
  return normalizeOnOffFullLevel(raw);
}

/** Reused helper for normalize Usage Display behavior in src/auto-reply. */
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

/** Reused helper for resolve Response Usage Mode behavior in src/auto-reply. */
export function resolveResponseUsageMode(raw?: string | null): UsageDisplayLevel {
  return normalizeUsageDisplay(raw) ?? "off";
}

/** Reused helper for normalize Elevated Level behavior in src/auto-reply. */
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

/** Reused helper for resolve Elevated Mode behavior in src/auto-reply. */
export function resolveElevatedMode(level?: ElevatedLevel | null): ElevatedMode {
  if (!level || level === "off") {
    return "off";
  }
  if (level === "full") {
    return "full";
  }
  return "ask";
}

/** Reused helper for normalize Reasoning Level behavior in src/auto-reply. */
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
