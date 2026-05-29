// gateway/server-methods nodes wake state helpers and runtime behavior.
/** Reused constant for NODE WAKE RECONNECT WAIT MS behavior in src/gateway/server-methods. */
export const NODE_WAKE_RECONNECT_WAIT_MS = 3_000;
/** Reused constant for NODE WAKE RECONNECT RETRY WAIT MS behavior in src/gateway/server-methods. */
export const NODE_WAKE_RECONNECT_RETRY_WAIT_MS = 12_000;
/** Reused constant for NODE WAKE RECONNECT POLL MS behavior in src/gateway/server-methods. */
export const NODE_WAKE_RECONNECT_POLL_MS = 150;

/** Shared type for Node Wake Attempt in src/gateway/server-methods. */
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

/** Reused constant for node Wake By Id behavior in src/gateway/server-methods. */
export const nodeWakeById = new Map<string, NodeWakeState>();
/** Reused constant for node Wake Nudge By Id behavior in src/gateway/server-methods. */
export const nodeWakeNudgeById = new Map<string, number>();

/** Reused helper for clear Node Wake State behavior in src/gateway/server-methods. */
export function clearNodeWakeState(nodeId: string): void {
  nodeWakeById.delete(nodeId);
  nodeWakeNudgeById.delete(nodeId);
}

// Narrow read-only seam for tests that assert nodeWakeById is cleaned up on
// early-return paths. Mirrors the pattern used in agent-wait-dedupe.ts:223
// and agents.ts:78 — keep production surface untouched and do not expose the
// underlying Map reference.
/** Reused constant for testing behavior in src/gateway/server-methods. */
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
/** Re-exported API for src/gateway/server-methods, starting with testing. */
export { testing as __testing };
