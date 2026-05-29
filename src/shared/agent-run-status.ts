// shared agent run status helpers and runtime behavior.
const NON_TERMINAL_AGENT_RUN_STATUSES = new Set(["accepted", "started", "in_flight"]);

/** Reused helper for is Non Terminal Agent Run Status behavior in src/shared. */
export function isNonTerminalAgentRunStatus(status: unknown): boolean {
  return typeof status === "string" && NON_TERMINAL_AGENT_RUN_STATUSES.has(status);
}
