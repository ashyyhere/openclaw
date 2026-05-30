// Node wake reconnect timing, in-flight state, and test inspection helpers.
/** Initial wait after sending a node wake request before reconnect polling. */
export const NODE_WAKE_RECONNECT_WAIT_MS = 3_000;
/** Backoff wait before retrying a throttled or failed node wake reconnect. */
export const NODE_WAKE_RECONNECT_RETRY_WAIT_MS = 12_000;
/** Poll interval while waiting for a woken node to reconnect. */
export const NODE_WAKE_RECONNECT_POLL_MS = 150;

/** Outcome and timing metadata for one node wake attempt. */
export type NodeWakeAttempt = {
  available: boolean;
  throttled: boolean;
  path: "throttled" | "no-registration" | "no-auth" | "sent" | "send-error";
  durationMs: number;
  apnsStatus?: number;
  apnsReason?: string;
};

type NodeWakeState = {
  lastWakeAtMs: number;
  inFlight?: Promise<NodeWakeAttempt>;
};

/** Per-node in-flight wake and throttle state. */
export const nodeWakeById = new Map<string, NodeWakeState>();
/** Last manual nudge time per node id. */
export const nodeWakeNudgeById = new Map<string, number>();

/** Clears wake and nudge state for a node after reconnect or removal. */
export function clearNodeWakeState(nodeId: string): void {
  nodeWakeById.delete(nodeId);
  nodeWakeNudgeById.delete(nodeId);
}

// Narrow read-only seam for tests that assert nodeWakeById is cleaned up on
// early-return paths. Mirrors the pattern used in agent-wait-dedupe.ts:223
// and agents.ts:78 — keep production surface untouched and do not expose the
// underlying Map reference.
/** Read-only node wake state helpers for tests. */
export const testing = {
  getNodeWakeByIdSize(): number {
    return nodeWakeById.size;
  },
  hasNodeWakeEntry(nodeId: string): boolean {
    return nodeWakeById.has(nodeId);
  },
  resetWakeState(): void {
    nodeWakeById.clear();
    nodeWakeNudgeById.clear();
  },
};
/** Test-only alias for node wake state inspection helpers. */
export { testing as __testing };
