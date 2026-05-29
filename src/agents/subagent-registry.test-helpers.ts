/** Test helpers for direct subagent registry manipulation. */
import { subagentRuns } from "./subagent-registry-memory.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";

/** Reused helper for reset Subagent Registry For Tests behavior in src/agents. */
export function resetSubagentRegistryForTests() {
  subagentRuns.clear();
}

/** Reused helper for add Subagent Run For Tests behavior in src/agents. */
export function addSubagentRunForTests(entry: SubagentRunRecord) {
  subagentRuns.set(entry.runId, entry);
}
