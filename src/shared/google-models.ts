// shared google models helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "./string-coerce.js";

/** Reused helper for is Gemma4 Model Id behavior in src/shared. */
export function isGemma4ModelId(modelId?: string | null): boolean {
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  return /(?:^|[/_:-])gemma[-_]?4(?:$|[/_.:-])/.test(normalized);
}
