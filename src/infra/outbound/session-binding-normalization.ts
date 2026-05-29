// infra/outbound session binding normalization helpers and runtime behavior.
import { normalizeAccountId } from "../../routing/session-key.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "../../shared/string-coerce.js";

/** Shared type for Conversation Ref Shape in src/infra/outbound. */
export type ConversationRefShape = {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
};

type ConversationTargetRefShape = {
  conversationId: string;
  parentConversationId?: string | null;
};

/** Reused helper for normalize Conversation Target Ref behavior in src/infra/outbound. */
export function normalizeConversationTargetRef<T extends ConversationTargetRefShape>(ref: T): T {
  const conversationId = normalizeOptionalString(ref.conversationId) ?? "";
  const parentConversationId = normalizeOptionalString(ref.parentConversationId);
  const { parentConversationId: _ignoredParentConversationId, ...rest } = ref;
  return {
    ...rest,
    conversationId,
    ...(parentConversationId && parentConversationId !== conversationId
      ? { parentConversationId }
      : {}),
  } as T;
}

/** Reused helper for normalize Conversation Ref behavior in src/infra/outbound. */
export function normalizeConversationRef<T extends ConversationRefShape>(ref: T): T {
  const normalizedTarget = normalizeConversationTargetRef(ref);
  return {
    ...normalizedTarget,
    channel: normalizeLowercaseStringOrEmpty(ref.channel),
    accountId: normalizeAccountId(ref.accountId),
  };
}

/** Reused helper for build Channel Account Key behavior in src/infra/outbound. */
export function buildChannelAccountKey(params: { channel: string; accountId: string }): string {
  return `${normalizeLowercaseStringOrEmpty(params.channel)}:${normalizeAccountId(params.accountId)}`;
}
