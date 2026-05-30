// Shared mapping from OpenClaw thinking levels to provider reasoning effort names.
import type { ThinkLevel } from "../../../auto-reply/thinking.js";

/** Provider-facing reasoning effort values used by stream wrappers. */
export type ReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh";

/** Map OpenClaw thinking levels onto provider reasoning effort values. */
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
