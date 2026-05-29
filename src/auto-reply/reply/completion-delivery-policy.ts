// Delivery policy for final completion payloads.
import { normalizeChatType, type ChatType } from "../../channels/chat-type.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { deriveSessionChatTypeFromKey } from "../../sessions/session-chat-type-shared.js";
import type { DeliveryContext } from "../../utils/delivery-context.types.js";
import { resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode.js";

/** Shared type for Completion Chat Type in src/auto-reply/reply. */
export type CompletionChatType = ChatType | "unknown";

/** Shared type for Completion Delivery Session Entry in src/auto-reply/reply. */
export type CompletionDeliverySessionEntry = {
  chatType?: string | null;
  origin?: { chatType?: string | null } | null;
};

/** Reused helper for resolve Completion Chat Type behavior in src/auto-reply/reply. */
export function resolveCompletionChatType(params: {
  requesterSessionKey?: string | null;
  targetRequesterSessionKey?: string | null;
  requesterEntry?: CompletionDeliverySessionEntry;
  directOrigin?: DeliveryContext;
  requesterSessionOrigin?: DeliveryContext;
}): CompletionChatType {
  const explicit = normalizeChatType(
    params.requesterEntry?.chatType ?? params.requesterEntry?.origin?.chatType ?? undefined,
  );
  if (explicit) {
    return explicit;
  }

  for (const key of [params.targetRequesterSessionKey, params.requesterSessionKey]) {
    const derived = deriveSessionChatTypeFromKey(key);
    if (derived !== "unknown") {
      return derived;
    }
  }

  return inferCompletionChatTypeFromTarget(
    params.directOrigin?.to ?? params.requesterSessionOrigin?.to,
  );
}

/** Reused helper for completion Requires Message Tool Delivery behavior in src/auto-reply/reply. */
export function completionRequiresMessageToolDelivery(params: {
  cfg: OpenClawConfig;
  requesterSessionKey?: string | null;
  targetRequesterSessionKey?: string | null;
  requesterEntry?: CompletionDeliverySessionEntry;
  directOrigin?: DeliveryContext;
  requesterSessionOrigin?: DeliveryContext;
  messageToolAvailable?: boolean;
}): boolean {
  return (
    resolveSourceReplyDeliveryMode({
      cfg: params.cfg,
      ctx: {
        ChatType: resolveCompletionChatType(params),
      },
      messageToolAvailable: params.messageToolAvailable,
    }) === "message_tool_only"
  );
}

/** Reused helper for should Route Completion Through Requester Session behavior in src/auto-reply/reply. */
export function shouldRouteCompletionThroughRequesterSession(
  sessionKey: string | undefined | null,
): boolean {
  const chatType = deriveSessionChatTypeFromKey(sessionKey);
  return chatType === "group" || chatType === "channel";
}

function inferCompletionChatTypeFromTarget(to: string | undefined): CompletionChatType {
  const normalized = to?.trim().toLowerCase();
  if (!normalized) {
    return "unknown";
  }
  if (normalized.startsWith("group:")) {
    return "group";
  }
  if (normalized.startsWith("channel:") || normalized.startsWith("thread:")) {
    return "channel";
  }
  if (
    normalized.startsWith("dm:") ||
    normalized.startsWith("direct:") ||
    normalized.startsWith("user:")
  ) {
    return "direct";
  }
  return "unknown";
}
