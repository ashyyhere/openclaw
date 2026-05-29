/** Process-local map of currently tracked subagent run records. */
import type { SubagentRunRecord } from "./subagent-registry.types.js";

/** Reused constant for subagent Runs behavior in src/agents. */
export const subagentRuns = new Map<string, SubagentRunRecord>();
