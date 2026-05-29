// In-process pub/sub for session transcript writes.
import { asPositiveSafeInteger } from "../shared/number-coercion.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Normalized notification payload for a transcript append or rewrite. */
export type SessionTranscriptUpdate = {
  sessionFile: string;
  sessionKey?: string;
  agentId?: string;
  message?: unknown;
  messageId?: string;
  messageSeq?: number;
};

type SessionTranscriptListener = (update: SessionTranscriptUpdate) => void;

const SESSION_TRANSCRIPT_LISTENERS = new Set<SessionTranscriptListener>();

/** Registers a transcript listener and returns an unsubscribe function. */
export function onSessionTranscriptUpdate(listener: SessionTranscriptListener): () => void {
  SESSION_TRANSCRIPT_LISTENERS.add(listener);
  return () => {
    SESSION_TRANSCRIPT_LISTENERS.delete(listener);
  };
}

/** Emits a normalized transcript update to best-effort listeners. */
export function emitSessionTranscriptUpdate(update: string | SessionTranscriptUpdate): void {
  const normalized =
    typeof update === "string"
      ? { sessionFile: update }
      : {
          sessionFile: update.sessionFile,
          sessionKey: update.sessionKey,
          agentId: update.agentId,
          message: update.message,
          messageId: update.messageId,
          messageSeq: update.messageSeq,
        };
  const trimmed = normalizeOptionalString(normalized.sessionFile);
  if (!trimmed) {
    return;
  }
  const messageSeq = asPositiveSafeInteger(normalized.messageSeq);
  const nextUpdate: SessionTranscriptUpdate = {
    sessionFile: trimmed,
    ...(normalizeOptionalString(normalized.sessionKey)
      ? { sessionKey: normalizeOptionalString(normalized.sessionKey) }
      : {}),
    ...(normalizeOptionalString(normalized.agentId)
      ? { agentId: normalizeOptionalString(normalized.agentId) }
      : {}),
    ...(normalized.message !== undefined ? { message: normalized.message } : {}),
    ...(normalizeOptionalString(normalized.messageId)
      ? { messageId: normalizeOptionalString(normalized.messageId) }
      : {}),
    ...(messageSeq !== undefined ? { messageSeq } : {}),
  };
  for (const listener of SESSION_TRANSCRIPT_LISTENERS) {
    try {
      listener(nextUpdate);
    } catch {
      /* ignore */
    }
  }
}
