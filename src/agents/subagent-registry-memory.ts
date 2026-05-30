import type { SubagentRunRecord } from "./subagent-registry.types.js";

/** Process-local registry of active and recently completed subagent runs. */
export const subagentRuns = new Map<string, SubagentRunRecord>();
