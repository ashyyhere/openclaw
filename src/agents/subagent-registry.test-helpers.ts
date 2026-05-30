import { subagentRuns } from "./subagent-registry-memory.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";

/** Clear all process-local subagent records between tests. */
export function resetSubagentRegistryForTests() {
  subagentRuns.clear();
}

/** Insert a subagent run record directly for registry-focused tests. */
export function addSubagentRunForTests(entry: SubagentRunRecord) {
  subagentRuns.set(entry.runId, entry);
}
