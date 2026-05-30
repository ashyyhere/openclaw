// In-memory registry for active realtime/transcription/managed Talk sessions.
/** Stored ownership record for one active Talk session id. */
export type UnifiedTalkSessionRecord =
  | {
      kind: "realtime-relay";
      connId: string;
      relaySessionId: string;
    }
  | {
      kind: "transcription-relay";
      connId: string;
      transcriptionSessionId: string;
    }
  | {
      kind: "managed-room";
      handoffId: string;
      token: string;
      roomId: string;
    };

const unifiedTalkSessions = new Map<string, UnifiedTalkSessionRecord>();

/** Register a Talk session so later gateway calls can resolve its owner/transport. */
export function rememberUnifiedTalkSession(
  sessionId: string,
  session: UnifiedTalkSessionRecord,
): void {
  unifiedTalkSessions.set(sessionId, session);
}

/** Resolve a Talk session or throw the public "unknown session" error. */
export function getUnifiedTalkSession(sessionId: string): UnifiedTalkSessionRecord {
  const session = unifiedTalkSessions.get(sessionId);
  if (!session) {
    throw new Error("Unknown Talk session");
  }
  return session;
}

/** Remove a Talk session after close or failed setup. */
export function forgetUnifiedTalkSession(sessionId: string): void {
  unifiedTalkSessions.delete(sessionId);
}

/** Enforce that a connection-scoped Talk session is controlled by the caller connection. */
export function requireUnifiedTalkSessionConn(
  session: Extract<UnifiedTalkSessionRecord, { connId: string }>,
  connId: string | undefined,
): string {
  if (!connId || session.connId !== connId) {
    throw new Error("Talk session is not owned by this connection");
  }
  return connId;
}

/** Reset the process-local Talk registry for isolated tests. */
export function clearUnifiedTalkSessionsForTest(): void {
  unifiedTalkSessions.clear();
}
