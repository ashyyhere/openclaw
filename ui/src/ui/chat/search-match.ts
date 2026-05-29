// ui/src/ui/chat search match helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../string-coerce.ts";
import { extractTextCached } from "./message-extract.ts";

/** Reused helper for message Matches Search Query behavior in ui/src/ui/chat. */
export function messageMatchesSearchQuery(message: unknown, query: string): boolean {
  const normalizedQuery = normalizeLowercaseStringOrEmpty(query);
  if (!normalizedQuery) {
    return true;
  }
  const text = normalizeLowercaseStringOrEmpty(extractTextCached(message));
  return text.includes(normalizedQuery);
}
