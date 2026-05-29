// routing peer kind match helpers and runtime behavior.
import type { ChatType } from "../channels/chat-type.js";

/** Reused helper for peer Kind Matches behavior in src/routing. */
export function peerKindMatches(bindingKind: ChatType, scopeKind: ChatType): boolean {
  if (bindingKind === scopeKind) {
    return true;
  }
  return (
    (bindingKind === "group" && scopeKind === "channel") ||
    (bindingKind === "channel" && scopeKind === "group")
  );
}
