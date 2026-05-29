// Reply payload sending hook invocation.
import { getGlobalHookRunner } from "../../plugins/hook-runner-global.js";
import type { PluginHookReplyPayloadSendingContext } from "../../plugins/hook-types.js";
import type { ReplyPayload } from "../reply-payload.js";
import type { ReplyDispatchKind } from "./reply-dispatcher.types.js";

/** Reused helper for has Reply Payload Sending Hooks behavior in src/auto-reply/reply. */
export function hasReplyPayloadSendingHooks(): boolean {
  return getGlobalHookRunner()?.hasHooks("reply_payload_sending") === true;
}

/** Reused helper for run Reply Payload Sending Hook behavior in src/auto-reply/reply. */
export async function runReplyPayloadSendingHook(params: {
  payload: ReplyPayload;
  kind: ReplyDispatchKind;
  channel?: string;
  sessionKey?: string;
  runId?: string;
  context: PluginHookReplyPayloadSendingContext;
}): Promise<ReplyPayload | null> {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("reply_payload_sending")) {
    return params.payload;
  }

  const result = await hookRunner.runReplyPayloadSending(
    {
      payload: params.payload,
      kind: params.kind,
      channel: params.channel,
      sessionKey: params.sessionKey,
      runId: params.runId,
    },
    params.context,
  );

  if (result?.cancel) {
    return null;
  }
  return (result?.payload as ReplyPayload | undefined) ?? params.payload;
}
