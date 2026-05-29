/** Process-local state maps for active and abandoned embedded-agent runs. */
import type { SourceReplyDeliveryMode } from "../../auto-reply/get-reply-options.types.js";
import {
  getActiveReplyRunCount,
  listActiveReplyRunSessionKeys,
  listActiveReplyRunSessionIds,
} from "../../auto-reply/reply/reply-run-registry.js";
import { resolveGlobalSingleton } from "../../shared/global-singleton.js";

/** Shared type for Embedded Agent Queue Handle in src/agents/embedded-agent-runner. */
export type EmbeddedAgentQueueHandle = {
  kind?: "embedded";
  queueMessage: (text: string, options?: EmbeddedAgentQueueMessageOptions) => Promise<void>;
  isStreaming: () => boolean;
  isCompacting: () => boolean;
  supportsTranscriptCommitWait?: boolean;
  cancel?: (reason?: "user_abort" | "restart" | "superseded") => void;
  abort: () => void;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
};

/** Shared type for Embedded Agent Queue Message Options in src/agents/embedded-agent-runner. */
export type EmbeddedAgentQueueMessageOptions = {
  steeringMode?: "all";
  debounceMs?: number;
  deliveryTimeoutMs?: number;
  waitForTranscriptCommit?: boolean;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
};

/** Shared type for Active Embedded Run Snapshot in src/agents/embedded-agent-runner. */
export type ActiveEmbeddedRunSnapshot = {
  transcriptLeafId: string | null;
  messages?: unknown[];
  inFlightPrompt?: string;
};

/** Shared type for Embedded Run Model Switch Request in src/agents/embedded-agent-runner. */
export type EmbeddedRunModelSwitchRequest = {
  provider: string;
  model: string;
  authProfileId?: string;
  authProfileIdSource?: "auto" | "user";
};

/** Shared type for Embedded Run Waiter in src/agents/embedded-agent-runner. */
export type EmbeddedRunWaiter = {
  resolve: (ended: boolean) => void;
  timer: NodeJS.Timeout;
};

/** Shared type for Abandoned Embedded Run in src/agents/embedded-agent-runner. */
export type AbandonedEmbeddedRun = {
  sessionId: string;
  sessionKey?: string;
  sessionFile?: string;
  abandonedAtMs: number;
  reason: "timeout";
};

const EMBEDDED_RUN_STATE_KEY = Symbol.for("openclaw.embeddedRunState");

const embeddedRunState = resolveGlobalSingleton(EMBEDDED_RUN_STATE_KEY, () => ({
  activeRuns: new Map<string, EmbeddedAgentQueueHandle>(),
  snapshots: new Map<string, ActiveEmbeddedRunSnapshot>(),
  sessionIdsByKey: new Map<string, string>(),
  sessionIdsByFile: new Map<string, string>(),
  abandonedRunsBySessionId: new Map<string, AbandonedEmbeddedRun>(),
  abandonedRunSessionIdsByKey: new Map<string, string>(),
  abandonedRunSessionIdsByFile: new Map<string, string>(),
  waiters: new Map<string, Set<EmbeddedRunWaiter>>(),
  modelSwitchRequests: new Map<string, EmbeddedRunModelSwitchRequest>(),
}));

/** Reused constant for ACTIVE EMBEDDED RUNS behavior in src/agents/embedded-agent-runner. */
export const ACTIVE_EMBEDDED_RUNS =
  embeddedRunState.activeRuns ??
  (embeddedRunState.activeRuns = new Map<string, EmbeddedAgentQueueHandle>());
/** Reused constant for ACTIVE EMBEDDED RUN SNAPSHOTS behavior in src/agents/embedded-agent-runner. */
export const ACTIVE_EMBEDDED_RUN_SNAPSHOTS =
  embeddedRunState.snapshots ??
  (embeddedRunState.snapshots = new Map<string, ActiveEmbeddedRunSnapshot>());
/** Reused constant for ACTIVE EMBEDDED RUN SESSION IDS BY KEY behavior in src/agents/embedded-agent-runner. */
export const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY =
  embeddedRunState.sessionIdsByKey ??
  (embeddedRunState.sessionIdsByKey = new Map<string, string>());
/** Reused constant for ACTIVE EMBEDDED RUN SESSION IDS BY FILE behavior in src/agents/embedded-agent-runner. */
export const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE =
  embeddedRunState.sessionIdsByFile ??
  (embeddedRunState.sessionIdsByFile = new Map<string, string>());
/** Reused constant for ABANDONED EMBEDDED RUNS BY SESSION ID behavior in src/agents/embedded-agent-runner. */
export const ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID =
  embeddedRunState.abandonedRunsBySessionId ??
  (embeddedRunState.abandonedRunsBySessionId = new Map<string, AbandonedEmbeddedRun>());
/** Reused constant for ABANDONED EMBEDDED RUN SESSION IDS BY KEY behavior in src/agents/embedded-agent-runner. */
export const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY =
  embeddedRunState.abandonedRunSessionIdsByKey ??
  (embeddedRunState.abandonedRunSessionIdsByKey = new Map<string, string>());
/** Reused constant for ABANDONED EMBEDDED RUN SESSION IDS BY FILE behavior in src/agents/embedded-agent-runner. */
export const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE =
  embeddedRunState.abandonedRunSessionIdsByFile ??
  (embeddedRunState.abandonedRunSessionIdsByFile = new Map<string, string>());
/** Reused constant for EMBEDDED RUN WAITERS behavior in src/agents/embedded-agent-runner. */
export const EMBEDDED_RUN_WAITERS =
  embeddedRunState.waiters ??
  (embeddedRunState.waiters = new Map<string, Set<EmbeddedRunWaiter>>());
/** Reused constant for EMBEDDED RUN MODEL SWITCH REQUESTS behavior in src/agents/embedded-agent-runner. */
export const EMBEDDED_RUN_MODEL_SWITCH_REQUESTS =
  embeddedRunState.modelSwitchRequests ??
  (embeddedRunState.modelSwitchRequests = new Map<string, EmbeddedRunModelSwitchRequest>());

/** Reused helper for get Active Embedded Run Count behavior in src/agents/embedded-agent-runner. */
export function getActiveEmbeddedRunCount(): number {
  let activeCount = ACTIVE_EMBEDDED_RUNS.size;
  for (const sessionId of listActiveReplyRunSessionIds()) {
    if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) {
      activeCount += 1;
    }
  }
  return Math.max(activeCount, getActiveReplyRunCount());
}

/** Reused helper for list Active Embedded Run Session Keys behavior in src/agents/embedded-agent-runner. */
export function listActiveEmbeddedRunSessionKeys(): string[] {
  return [
    ...new Set([
      ...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.keys(),
      ...listActiveReplyRunSessionKeys(),
    ]),
  ].toSorted((a, b) => a.localeCompare(b));
}

/** Reused helper for list Active Embedded Run Session Ids behavior in src/agents/embedded-agent-runner. */
export function listActiveEmbeddedRunSessionIds(): string[] {
  return [
    ...new Set([
      ...ACTIVE_EMBEDDED_RUNS.keys(),
      ...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.values(),
      ...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.values(),
      ...listActiveReplyRunSessionIds(),
    ]),
  ].toSorted((a, b) => a.localeCompare(b));
}
