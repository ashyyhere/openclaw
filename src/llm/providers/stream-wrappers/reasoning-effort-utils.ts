// llm/providers/stream-wrappers reasoning effort utils helpers and runtime behavior.
import type { ThinkLevel } from "../../../auto-reply/thinking.js";

/** Shared type for Reasoning Effort in src/llm/providers. */
export type ReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh";

/** Reused helper for map Thinking Level To Reasoning Effort behavior in src/llm/providers. */
export function mapThinkingLevelToReasoningEffort(thinkingLevel: ThinkLevel): ReasoningEffort {
  if (thinkingLevel === "off") {
    return "none";
  }
  if (thinkingLevel === "adaptive") {
    return "medium";
  }
  if (thinkingLevel === "max") {
    return "xhigh";
  }
  return thinkingLevel;
}
