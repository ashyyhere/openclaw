/** Small normalization helpers shared by embedded-agent runner modules. */
import type { ReasoningLevel, ThinkLevel } from "../../auto-reply/thinking.js";
import type { ThinkingLevel } from "../runtime/index.js";

/** Normalizes user/config context budgets to positive integer tokens. */
export function normalizeContextTokenBudget(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : undefined;
}

/** Maps OpenClaw thinking levels onto provider runtime reasoning effort. */
export function mapThinkingLevel(level?: ThinkLevel): ThinkingLevel {
  // agent runtime supports elevated levels; OpenClaw enables them for specific models.
  if (!level) {
    return "off";
  }
  // Runtime streams do not expose a distinct adaptive level. Preserve the
  // provider-owned adaptive default by using Claude's documented high effort.
  if (level === "adaptive") {
    return "high";
  }
  return level;
}

/** Re-export thinking/reasoning level types used by runner callers. */
export type { ReasoningLevel, ThinkLevel };
