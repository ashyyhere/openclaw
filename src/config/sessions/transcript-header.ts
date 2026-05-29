// config/sessions transcript header helpers and runtime behavior.
import { randomUUID } from "node:crypto";
import { CURRENT_SESSION_VERSION } from "./version.js";

/** Shared type for Session Transcript Header Params in src/config/sessions. */
export type SessionTranscriptHeaderParams = {
  sessionId?: string;
  cwd?: string;
};

/** Reused helper for create Session Transcript Header behavior in src/config/sessions. */
export function createSessionTranscriptHeader(params: SessionTranscriptHeaderParams = {}) {
  return {
    type: "session",
    version: CURRENT_SESSION_VERSION,
    id: params.sessionId ?? randomUUID(),
    timestamp: new Date().toISOString(),
    cwd: params.cwd ?? process.cwd(),
  };
}
