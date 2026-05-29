// Typing policy helpers for channel delivery.
import { INTERNAL_MESSAGE_CHANNEL } from "../../utils/message-channel.js";
import type { TypingPolicy } from "../types.js";

/** Shared type for Resolve Run Typing Policy Params in src/auto-reply/reply. */
export type ResolveRunTypingPolicyParams = {
  requestedPolicy?: TypingPolicy;
  suppressTyping?: boolean;
  isHeartbeat?: boolean;
  originatingChannel?: string;
  systemEvent?: boolean;
};

/** Shared type for Resolved Run Typing Policy in src/auto-reply/reply. */
export type ResolvedRunTypingPolicy = {
  typingPolicy: TypingPolicy;
  suppressTyping: boolean;
};

/** Reused helper for resolve Run Typing Policy behavior in src/auto-reply/reply. */
export function resolveRunTypingPolicy(
  params: ResolveRunTypingPolicyParams,
): ResolvedRunTypingPolicy {
  const typingPolicy = params.isHeartbeat
    ? "heartbeat"
    : params.originatingChannel === INTERNAL_MESSAGE_CHANNEL
      ? "internal_webchat"
      : params.systemEvent
        ? "system_event"
        : (params.requestedPolicy ?? "auto");

  const suppressTyping =
    params.suppressTyping === true ||
    typingPolicy === "heartbeat" ||
    typingPolicy === "system_event" ||
    typingPolicy === "internal_webchat";

  return { typingPolicy, suppressTyping };
}
