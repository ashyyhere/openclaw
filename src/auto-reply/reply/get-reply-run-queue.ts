// Queue helpers for delayed get-reply runs.
import { logVerbose } from "../../globals.js";
import type { ReplyPayload } from "../types.js";
import type { ActiveRunQueueAction } from "./queue-policy.js";
import type { QueueSettings } from "./queue.js";

/** Shared type for Reply Run Queue Busy State in src/auto-reply/reply. */
export type ReplyRunQueueBusyState = {
  activeSessionId: string | undefined;
  isActive: boolean;
  isStreaming: boolean;
};

/** Reused constant for REPLY RUN STILL SHUTTING DOWN TEXT behavior in src/auto-reply/reply. */
export const REPLY_RUN_STILL_SHUTTING_DOWN_TEXT =
  "⚠️ Previous run is still shutting down. Please try again in a moment.";

/** Reused helper for resolve Prepared Reply Queue State behavior in src/auto-reply/reply. */
export async function resolvePreparedReplyQueueState(params: {
  activeRunQueueAction: ActiveRunQueueAction;
  activeSessionId: string | undefined;
  queueMode: QueueSettings["mode"];
  sessionKey: string | undefined;
  sessionId: string;
  abortActiveRun: (sessionId: string) => boolean;
  waitForActiveRunEnd: (sessionId: string) => Promise<unknown>;
  refreshPreparedState: () => Promise<void>;
  resolveBusyState: () => ReplyRunQueueBusyState;
}): Promise<
  { kind: "continue"; busyState: ReplyRunQueueBusyState } | { kind: "reply"; reply: ReplyPayload }
> {
  if (params.activeRunQueueAction !== "run-now" || !params.activeSessionId) {
    return { kind: "continue", busyState: params.resolveBusyState() };
  }

  if (params.queueMode === "interrupt") {
    const aborted = params.abortActiveRun(params.activeSessionId);
    logVerbose(
      `Interrupting active run for ${params.sessionKey ?? params.sessionId} (aborted=${aborted})`,
    );
  }

  await params.waitForActiveRunEnd(params.activeSessionId);
  await params.refreshPreparedState();
  const refreshedBusyState = params.resolveBusyState();
  if (refreshedBusyState.isActive) {
    return {
      kind: "reply",
      reply: {
        text: REPLY_RUN_STILL_SHUTTING_DOWN_TEXT,
      },
    };
  }
  return { kind: "continue", busyState: refreshedBusyState };
}
