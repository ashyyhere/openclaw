// Compaction timeout grace-period helpers for embedded agent runs.
import type { AgentMessage } from "../../runtime/index.js";

/** Exported API contract used by runtime callers and tests. */
export type CompactionTimeoutSignal = {
  isTimeout: boolean;
  isCompactionPendingOrRetrying: boolean;
  isCompactionInFlight: boolean;
};

/** Exported API contract used by runtime callers and tests. */
export function shouldFlagCompactionTimeout(signal: CompactionTimeoutSignal): boolean {
  if (!signal.isTimeout) {
    return false;
  }
  return signal.isCompactionPendingOrRetrying || signal.isCompactionInFlight;
}

/** Exported API contract used by runtime callers and tests. */
export function resolveRunTimeoutDuringCompaction(params: {
  isCompactionPendingOrRetrying: boolean;
  isCompactionInFlight: boolean;
  graceAlreadyUsed: boolean;
}): "extend" | "abort" {
  if (!params.isCompactionPendingOrRetrying && !params.isCompactionInFlight) {
    return "abort";
  }
  return params.graceAlreadyUsed ? "abort" : "extend";
}

/** Exported API contract used by runtime callers and tests. */
export function resolveRunTimeoutWithCompactionGraceMs(params: {
  runTimeoutMs: number;
  compactionTimeoutMs: number;
}): number {
  return params.runTimeoutMs + params.compactionTimeoutMs;
}

/** Exported API contract used by runtime callers and tests. */
export type SnapshotSelectionParams = {
  timedOutDuringCompaction: boolean;
  preCompactionSnapshot: AgentMessage[] | null;
  preCompactionSessionId: string;
  currentSnapshot: AgentMessage[];
  currentSessionId: string;
};

/** Exported API contract used by runtime callers and tests. */
export type SnapshotSelection = {
  messagesSnapshot: AgentMessage[];
  sessionIdUsed: string;
  source: "pre-compaction" | "current";
};

function canContinueFromMessage(message: AgentMessage | undefined): boolean {
  switch (message?.role) {
    case "user":
    case "toolResult":
    case "branchSummary":
    case "compactionSummary":
    case "custom":
      return true;
    case "bashExecution":
      return message.excludeFromContext !== true;
    default:
      return false;
  }
}

function trimToContinuableTail(messages: AgentMessage[]): AgentMessage[] | null {
  let end = messages.length;
  while (end > 0 && !canContinueFromMessage(messages[end - 1])) {
    end -= 1;
  }
  return end > 0 ? messages.slice(0, end) : null;
}

/** Exported API contract used by runtime callers and tests. */
export function selectCompactionTimeoutSnapshot(
  params: SnapshotSelectionParams,
): SnapshotSelection {
  if (!params.timedOutDuringCompaction) {
    return {
      messagesSnapshot: params.currentSnapshot,
      sessionIdUsed: params.currentSessionId,
      source: "current",
    };
  }

  if (params.preCompactionSnapshot) {
    const continuablePreCompactionSnapshot = trimToContinuableTail(params.preCompactionSnapshot);
    if (continuablePreCompactionSnapshot) {
      return {
        messagesSnapshot: continuablePreCompactionSnapshot,
        sessionIdUsed: params.preCompactionSessionId,
        source: "pre-compaction",
      };
    }
  }

  const continuableCurrentSnapshot = trimToContinuableTail(params.currentSnapshot);
  if (continuableCurrentSnapshot) {
    return {
      messagesSnapshot: continuableCurrentSnapshot,
      sessionIdUsed: params.currentSessionId,
      source: "current",
    };
  }

  return {
    messagesSnapshot: [],
    sessionIdUsed: params.currentSessionId,
    source: "current",
  };
}
