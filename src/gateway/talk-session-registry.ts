// gateway talk session registry helpers and runtime behavior.
/** Shared type for Unified Talk Session Record in src/gateway. */
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

/** Reused helper for remember Unified Talk Session behavior in src/gateway. */
export function rememberUnifiedTalkSession(
  sessionId: string,
  session: UnifiedTalkSessionRecord,
): void {
  unifiedTalkSessions.set(sessionId, session);
}

/** Reused helper for get Unified Talk Session behavior in src/gateway. */
export function getUnifiedTalkSession(sessionId: string): UnifiedTalkSessionRecord {
  const session = unifiedTalkSessions.get(sessionId);
  if (!session) {
    throw new Error("Unknown Talk session");
  }
  return session;
}

/** Reused helper for forget Unified Talk Session behavior in src/gateway. */
export function forgetUnifiedTalkSession(sessionId: string): void {
  unifiedTalkSessions.delete(sessionId);
}

/** Reused helper for require Unified Talk Session Conn behavior in src/gateway. */
export function requireUnifiedTalkSessionConn(
  session: Extract<UnifiedTalkSessionRecord, { connId: string }>,
  connId: string | undefined,
): string {
  if (!connId || session.connId !== connId) {
    throw new Error("Talk session is not owned by this connection");
  }
  return connId;
}

/** Reused helper for clear Unified Talk Sessions For Test behavior in src/gateway. */
export function clearUnifiedTalkSessionsForTest(): void {
  unifiedTalkSessions.clear();
}
