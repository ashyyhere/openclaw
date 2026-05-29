/** Parses conversation ids from channel thread binding identifiers. */
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Extracts the conversation id from an account-scoped thread binding id. */
export function resolveThreadBindingConversationIdFromBindingId(params: {
  accountId: string;
  bindingId?: string;
}): string | undefined {
  const bindingId = normalizeOptionalString(params.bindingId);
  if (!bindingId) {
    return undefined;
  }
  const prefix = `${params.accountId}:`;
  if (!bindingId.startsWith(prefix)) {
    return undefined;
  }
  const conversationId = normalizeOptionalString(bindingId.slice(prefix.length));
  return conversationId || undefined;
}
