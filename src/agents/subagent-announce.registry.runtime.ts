/** Runtime registry imports isolated for subagent announcement tests. */
export {
  countActiveDescendantRuns,
  countPendingDescendantRuns,
  countPendingDescendantRunsExcludingRun,
  getLatestSubagentRunByChildSessionKey,
  isSubagentSessionRunActive,
  listSubagentRunsForRequester,
  replaceSubagentRunAfterSteer,
  resolveRequesterForChildSession,
  shouldIgnorePostCompletionAnnounceForSession,
} from "./subagent-registry-runtime.js";
