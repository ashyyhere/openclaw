/** Normalizes timeout phase attribution for agent runs. */
export const AGENT_RUN_TIMEOUT_PHASES = [
  "queue",
  "preflight",
  "provider",
  "post_turn",
  "gateway_draining",
] as const;

/** Phase where an agent run timeout occurred. */
export type AgentRunTimeoutPhase = (typeof AGENT_RUN_TIMEOUT_PHASES)[number];

const AGENT_RUN_TIMEOUT_PHASE_SET = new Set<string>(AGENT_RUN_TIMEOUT_PHASES);

/** Normalize unknown timeout phase values to known agent-run phases. */
export function normalizeAgentRunTimeoutPhase(value: unknown): AgentRunTimeoutPhase | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  return AGENT_RUN_TIMEOUT_PHASE_SET.has(normalized)
    ? (normalized as AgentRunTimeoutPhase)
    : undefined;
}

/** Re-exported API for src/agents, starting with as Boolean. */
export { asBoolean as normalizeProviderStarted } from "../utils/boolean.js";
