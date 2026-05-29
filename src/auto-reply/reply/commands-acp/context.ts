// ACP command context resolution helpers.
import { normalizeConversationText } from "../../../acp/conversation-id.js";
import { normalizeConversationTargetRef } from "../../../infra/outbound/session-binding-normalization.js";
import { normalizeLowercaseStringOrEmpty } from "../../../shared/string-coerce.js";
import type { HandleCommandsParams } from "../commands-types.js";
import {
  resolveConversationBindingAccountIdFromMessage,
  resolveConversationBindingChannelFromMessage,
  resolveConversationBindingContextFromAcpCommand,
  resolveConversationBindingThreadIdFromMessage,
} from "../conversation-binding-input.js";

/** Reused helper for resolve Acp Command Channel behavior in src/auto-reply/reply. */
export function resolveAcpCommandChannel(params: HandleCommandsParams): string {
  const resolved = resolveConversationBindingChannelFromMessage(params.ctx, params.command.channel);
  return normalizeLowercaseStringOrEmpty(normalizeConversationText(resolved));
}

/** Reused helper for resolve Acp Command Account Id behavior in src/auto-reply/reply. */
export function resolveAcpCommandAccountId(params: HandleCommandsParams): string {
  return resolveConversationBindingAccountIdFromMessage({
    ctx: params.ctx,
    cfg: params.cfg,
    commandChannel: params.command.channel,
  });
}

/** Reused helper for resolve Acp Command Thread Id behavior in src/auto-reply/reply. */
export function resolveAcpCommandThreadId(params: HandleCommandsParams): string | undefined {
  return resolveConversationBindingThreadIdFromMessage(params.ctx);
}

function resolveAcpCommandConversationRef(params: HandleCommandsParams): {
  conversationId: string;
  parentConversationId?: string;
} | null {
  const resolved = resolveConversationBindingContextFromAcpCommand(params);
  if (!resolved) {
    return null;
  }
  return normalizeConversationTargetRef({
    conversationId: resolved.conversationId,
    parentConversationId: resolved.parentConversationId,
  });
}

/** Reused helper for resolve Acp Command Conversation Id behavior in src/auto-reply/reply. */
export function resolveAcpCommandConversationId(params: HandleCommandsParams): string | undefined {
  return resolveAcpCommandConversationRef(params)?.conversationId;
}

/** Reused helper for resolve Acp Command Parent Conversation Id behavior in src/auto-reply/reply. */
export function resolveAcpCommandParentConversationId(
  params: HandleCommandsParams,
): string | undefined {
  return resolveAcpCommandConversationRef(params)?.parentConversationId;
}

/** Reused helper for resolve Acp Command Binding Context behavior in src/auto-reply/reply. */
export function resolveAcpCommandBindingContext(params: HandleCommandsParams): {
  channel: string;
  accountId: string;
  threadId?: string;
  conversationId?: string;
  parentConversationId?: string;
} {
  const conversationRef = resolveAcpCommandConversationRef(params);
  if (!conversationRef) {
    return {
      channel: resolveAcpCommandChannel(params),
      accountId: resolveAcpCommandAccountId(params),
      threadId: resolveAcpCommandThreadId(params),
    };
  }
  return {
    channel: resolveAcpCommandChannel(params),
    accountId: resolveAcpCommandAccountId(params),
    threadId: resolveAcpCommandThreadId(params),
    conversationId: conversationRef.conversationId,
    ...(conversationRef.parentConversationId
      ? { parentConversationId: conversationRef.parentConversationId }
      : {}),
  };
}
