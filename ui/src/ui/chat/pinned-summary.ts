// ui/src/ui/chat pinned summary helpers and runtime behavior.
import { extractTextCached } from "./message-extract.ts";

/** Reused helper for get Pinned Message Summary behavior in ui/src/ui/chat. */
export function getPinnedMessageSummary(message: unknown): string {
  return extractTextCached(message) ?? "";
}
