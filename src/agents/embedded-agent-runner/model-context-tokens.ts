/** Reads context-window token metadata from resolved model definitions. */
import type { Model } from "../../llm/types.js";

type AgentModelWithOptionalContextTokens = Model & {
  contextTokens?: number;
};

/** Reused helper for read Agent Model Context Tokens behavior in src/agents/embedded-agent-runner. */
export function readAgentModelContextTokens(model: Model | null | undefined): number | undefined {
  const value = (model as AgentModelWithOptionalContextTokens | null | undefined)?.contextTokens;
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
