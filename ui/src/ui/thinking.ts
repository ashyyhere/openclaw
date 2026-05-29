// ui/src/ui thinking helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "./string-coerce.ts";

/** Shared type for Thinking Catalog Entry in ui/src/ui. */
export type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  reasoning?: boolean;
};

const BASE_THINKING_LEVELS = ["off", "minimal", "low", "medium", "high"] as const;

/** Reused helper for normalize Thinking Provider Id behavior in ui/src/ui. */
export function normalizeThinkingProviderId(provider?: string | null): string {
  if (!provider) {
    return "";
  }
  const normalized = normalizeLowercaseStringOrEmpty(provider);
  if (normalized === "z.ai" || normalized === "z-ai") {
    return "zai";
  }
  if (normalized === "bedrock" || normalized === "aws-bedrock") {
    return "amazon-bedrock";
  }
  return normalized;
}

/** Reused helper for is Binary Thinking Provider behavior in ui/src/ui. */
export function isBinaryThinkingProvider(provider?: string | null): boolean {
  void provider;
  return false;
}

/** Reused helper for normalize Think Level behavior in ui/src/ui. */
export function normalizeThinkLevel(raw?: string | null): string | undefined {
  if (!raw) {
    return undefined;
  }
  const key = normalizeLowercaseStringOrEmpty(raw);
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
  if (key === "off" || key === "none") {
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
  if (key === "think") {
    return "minimal";
  }
  return undefined;
}

/** Reused helper for list Thinking Level Labels behavior in ui/src/ui. */
export function listThinkingLevelLabels(
  provider?: string | null,
  model?: string | null,
): readonly string[] {
  void provider;
  void model;
  return BASE_THINKING_LEVELS;
}

/** Reused helper for format Thinking Levels behavior in ui/src/ui. */
export function formatThinkingLevels(provider?: string | null, model?: string | null): string {
  return listThinkingLevelLabels(provider, model).join(", ");
}

/** Reused helper for resolve Thinking Default For Model behavior in ui/src/ui. */
export function resolveThinkingDefaultForModel(params: {
  provider: string;
  model: string;
  catalog?: ThinkingCatalogEntry[];
}): string {
  const candidate = params.catalog?.find(
    (entry) => entry.provider === params.provider && entry.id === params.model,
  );
  return candidate?.reasoning ? "low" : "off";
}
