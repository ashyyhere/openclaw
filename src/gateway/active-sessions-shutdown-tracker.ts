// gateway active sessions shutdown tracker helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";

// Module-level tracker of sessions that have received `session_start` but not
// yet a paired `session_end`. The close handler drains this set on gateway
// shutdown / restart so downstream `session_end` plugins (e.g. claude-mem)
// can finalize sessions that were active when the process stopped, instead
// of leaving ghost rows in `active` state across restarts (see #57790).
//
// Membership is keyed by `sessionId`. The existing session lifecycle paths
// (`emitGatewaySessionStartPluginHook` /
// `emitGatewaySessionEndPluginHook` in `session-reset-service.ts`) call into
// this tracker so a session that has already been finalized by replace /
// reset / delete / compaction is forgotten before the shutdown drain ever
// runs. That is what keeps the shutdown finalizer from double-firing.

/** Shared type for Active Session For Shutdown in src/gateway. */
export type ActiveSessionForShutdown = {
  cfg: OpenClawConfig;
  sessionKey: string;
  sessionId: string;
  storePath: string;
  sessionFile?: string;
  agentId?: string;
};

const trackedSessions = new Map<string, ActiveSessionForShutdown>();

/** Reused helper for note Active Session For Shutdown behavior in src/gateway. */
export function noteActiveSessionForShutdown(entry: ActiveSessionForShutdown): void {
  if (!entry.sessionId) {
    return;
  }
  trackedSessions.set(entry.sessionId, entry);
}

/** Reused helper for forget Active Session For Shutdown behavior in src/gateway. */
export function forgetActiveSessionForShutdown(sessionId: string | undefined): void {
  if (!sessionId) {
    return;
  }
  trackedSessions.delete(sessionId);
}

/** Reused helper for list Active Sessions For Shutdown behavior in src/gateway. */
export function listActiveSessionsForShutdown(): ActiveSessionForShutdown[] {
  return Array.from(trackedSessions.values());
}

/** Reused helper for clear Active Sessions For Shutdown Tracker behavior in src/gateway. */
export function clearActiveSessionsForShutdownTracker(): void {
  trackedSessions.clear();
}
