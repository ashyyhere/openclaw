/** Completion helpers for outcome comparison and one-shot lifecycle hook emission. */
import { createSubsystemLogger } from "../logging/subsystem.js";
import { getGlobalHookRunner } from "../plugins/hook-runner-global.js";
import type { SubagentRunOutcome } from "./subagent-announce-output.js";
import {
  SUBAGENT_ENDED_OUTCOME_ERROR,
  SUBAGENT_ENDED_OUTCOME_OK,
  SUBAGENT_ENDED_OUTCOME_TIMEOUT,
  SUBAGENT_TARGET_KIND_SUBAGENT,
  type SubagentLifecycleEndedOutcome,
  type SubagentLifecycleEndedReason,
} from "./subagent-lifecycle-events.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";

const log = createSubsystemLogger("agents/subagent-registry-completion");

/** Reused helper for run Outcomes Equal behavior in src/agents. */
export function runOutcomesEqual(
  a: SubagentRunOutcome | undefined,
  b: SubagentRunOutcome | undefined,
): boolean {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  if (a.status !== b.status) {
    return false;
  }
  if (a.status === "error" && b.status === "error") {
    if ((a.error ?? "") !== (b.error ?? "")) {
      return false;
    }
  }
  if (!runOutcomeHasTiming(a) || !runOutcomeHasTiming(b)) {
    return true;
  }
  return a.startedAt === b.startedAt && a.endedAt === b.endedAt && a.elapsedMs === b.elapsedMs;
}

/** Reused helper for run Outcome Has Timing behavior in src/agents. */
export function runOutcomeHasTiming(outcome: SubagentRunOutcome | undefined): boolean {
  return (
    Number.isFinite(outcome?.startedAt) ||
    Number.isFinite(outcome?.endedAt) ||
    Number.isFinite(outcome?.elapsedMs)
  );
}

/** Reused helper for should Update Run Outcome behavior in src/agents. */
export function shouldUpdateRunOutcome(
  current: SubagentRunOutcome | undefined,
  next: SubagentRunOutcome | undefined,
): boolean {
  return (
    !runOutcomesEqual(current, next) || (!runOutcomeHasTiming(current) && runOutcomeHasTiming(next))
  );
}

/** Reused helper for resolve Lifecycle Outcome From Run Outcome behavior in src/agents. */
export function resolveLifecycleOutcomeFromRunOutcome(
  outcome: SubagentRunOutcome | undefined,
): SubagentLifecycleEndedOutcome {
  if (outcome?.status === "error") {
    return SUBAGENT_ENDED_OUTCOME_ERROR;
  }
  if (outcome?.status === "timeout") {
    return SUBAGENT_ENDED_OUTCOME_TIMEOUT;
  }
  return SUBAGENT_ENDED_OUTCOME_OK;
}

/** Reused helper for emit Subagent Ended Hook Once behavior in src/agents. */
export async function emitSubagentEndedHookOnce(params: {
  entry: SubagentRunRecord;
  reason: SubagentLifecycleEndedReason;
  sendFarewell?: boolean;
  accountId?: string;
  outcome?: SubagentLifecycleEndedOutcome;
  error?: string;
  inFlightRunIds: Set<string>;
  persist: () => void;
}) {
  const runId = params.entry.runId.trim();
  if (!runId) {
    return false;
  }
  if (params.entry.endedHookEmittedAt) {
    return false;
  }
  if (params.inFlightRunIds.has(runId)) {
    return false;
  }

  params.inFlightRunIds.add(runId);
  try {
    const hookRunner = getGlobalHookRunner();
    if (!hookRunner) {
      return false;
    }
    if (hookRunner?.hasHooks("subagent_ended")) {
      await hookRunner.runSubagentEnded(
        {
          targetSessionKey: params.entry.childSessionKey,
          targetKind: SUBAGENT_TARGET_KIND_SUBAGENT,
          reason: params.reason,
          sendFarewell: params.sendFarewell,
          accountId: params.accountId,
          runId: params.entry.runId,
          endedAt: params.entry.endedAt,
          outcome: params.outcome,
          error: params.error,
        },
        {
          runId: params.entry.runId,
          childSessionKey: params.entry.childSessionKey,
          requesterSessionKey: params.entry.requesterSessionKey,
        },
      );
    }
    params.entry.endedHookEmittedAt = Date.now();
    params.persist();
    return true;
  } catch (err) {
    log.warn(
      `failed to emit subagent_ended hook for run ${runId}: ${err instanceof Error ? err.message : String(err)}`,
    );
    return false;
  } finally {
    params.inFlightRunIds.delete(runId);
  }
}
