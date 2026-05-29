// Reply turn admission policy for suppressing or allowing inbound turns.
import {
  createReplyOperation,
  REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS,
  replyRunRegistry,
  ReplyRunAlreadyActiveError,
  type ReplyOperation,
} from "./reply-run-registry.js";

/** Shared type for Reply Turn Kind in src/auto-reply/reply. */
export type ReplyTurnKind = "visible" | "heartbeat" | "queued_followup" | "control_abort";

/** Shared type for Reply Turn Admission in src/auto-reply/reply. */
export type ReplyTurnAdmission =
  | { status: "owned"; operation: ReplyOperation }
  | {
      status: "skipped";
      reason: "active-run" | "aborted";
      activeOperation?: ReplyOperation;
    };

function isAbortSignalAborted(signal: AbortSignal | undefined): boolean {
  return signal?.aborted === true;
}

/** Reused helper for admit Reply Turn behavior in src/auto-reply/reply. */
export async function admitReplyTurn(params: {
  sessionKey: string;
  sessionId: string;
  kind: ReplyTurnKind;
  resetTriggered: boolean;
  upstreamAbortSignal?: AbortSignal;
  waitTimeoutMs?: number;
  waitForActive?: boolean;
}): Promise<ReplyTurnAdmission> {
  let sessionId = params.sessionId;
  while (true) {
    if (isAbortSignalAborted(params.upstreamAbortSignal)) {
      return { status: "skipped", reason: "aborted" };
    }
    try {
      return {
        status: "owned",
        operation: createReplyOperation({
          sessionKey: params.sessionKey,
          sessionId,
          resetTriggered: params.resetTriggered,
          upstreamAbortSignal: params.upstreamAbortSignal,
        }),
      };
    } catch (error) {
      if (!(error instanceof ReplyRunAlreadyActiveError)) {
        throw error;
      }
      const activeOperation = replyRunRegistry.get(params.sessionKey);
      if (params.kind === "heartbeat" || params.kind === "control_abort") {
        return { status: "skipped", reason: "active-run", activeOperation };
      }
      if (params.waitForActive === false) {
        return { status: "skipped", reason: "active-run", activeOperation };
      }
      const waitTimeoutMs =
        params.waitTimeoutMs ??
        (params.kind === "queued_followup" ? REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS : undefined);
      const ended = await replyRunRegistry.waitForIdle(params.sessionKey, waitTimeoutMs, {
        signal: params.upstreamAbortSignal,
      });
      if (!ended) {
        return {
          status: "skipped",
          reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run",
          activeOperation,
        };
      }
      if (activeOperation) {
        sessionId = activeOperation.sessionId;
      }
    }
  }
}

/** Reused helper for resolve Reply Turn Kind behavior in src/auto-reply/reply. */
export function resolveReplyTurnKind(opts?: { isHeartbeat?: boolean }): ReplyTurnKind {
  return opts?.isHeartbeat === true ? "heartbeat" : "visible";
}
