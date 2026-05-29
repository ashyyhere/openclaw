// Chat search helpers. Search operates on extracted message text rather than raw
// payloads so structured/tool messages match what the user actually sees.
import { normalizeLowercaseStringOrEmpty } from "../string-coerce.ts";
import { extractTextCached } from "./message-extract.ts";

/** Return whether a message's visible text contains the normalized query. */
export function messageMatchesSearchQuery(message: unknown, query: string): boolean {
  const normalizedQuery = normalizeLowercaseStringOrEmpty(query);
  if (!normalizedQuery) {
    return true;
  }
  const text = normalizeLowercaseStringOrEmpty(extractTextCached(message));
  return text.includes(normalizedQuery);
}
