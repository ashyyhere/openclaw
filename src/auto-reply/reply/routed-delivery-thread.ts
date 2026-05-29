// Routed delivery thread helpers for session-specific replies.
import { parseSessionThreadInfoFast } from "../../config/sessions/thread-info.js";
import type { MsgContext } from "../templating.js";

/** Reused helper for resolve Routed Delivery Thread Id behavior in src/auto-reply/reply. */
export function resolveRoutedDeliveryThreadId(params: {
  ctx: MsgContext;
  sessionKey?: string;
}): string | number | undefined {
  if (params.ctx.MessageThreadId != null) {
    return params.ctx.MessageThreadId;
  }
  if (params.ctx.TransportThreadId != null) {
    return params.ctx.TransportThreadId;
  }
  return parseSessionThreadInfoFast(params.sessionKey).threadId;
}
