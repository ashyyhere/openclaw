// Pinned-message summary helper for compact pinned message lists.
import { extractTextCached } from "./message-extract.ts";

/** Extract display text for a pinned message summary. */
export function getPinnedMessageSummary(message: unknown): string {
  return extractTextCached(message) ?? "";
}
