// Normalizers for session binding conversation references.
// They canonicalize channel/account ids before lookup keys are built.
import { normalizeAccountId } from "../../routing/session-key.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "../../shared/string-coerce.js";

/** Minimal conversation identity stored by binding adapters. */
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

/** Normalize conversation ids and drop redundant parent ids from target refs. */
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

/** Normalize a full conversation ref for stable binding comparisons. */
export function normalizeConversationRef<T extends ConversationRefShape>(ref: T): T {
  const normalizedTarget = normalizeConversationTargetRef(ref);
  return {
    ...normalizedTarget,
    channel: normalizeLowercaseStringOrEmpty(ref.channel),
    accountId: normalizeAccountId(ref.accountId),
  };
}

/** Build the canonical channel/account key used by binding registries. */
export function buildChannelAccountKey(params: { channel: string; accountId: string }): string {
  return `${normalizeLowercaseStringOrEmpty(params.channel)}:${normalizeAccountId(params.accountId)}`;
}
