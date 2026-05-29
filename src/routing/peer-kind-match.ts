// Compares route binding peer kinds with caller chat types.
import type { ChatType } from "../channels/chat-type.js";

/** Treats group and channel as compatible peer kinds while keeping direct distinct. */
export function peerKindMatches(bindingKind: ChatType, scopeKind: ChatType): boolean {
  if (bindingKind === scopeKind) {
    return true;
  }
  return (
    (bindingKind === "group" && scopeKind === "channel") ||
    (bindingKind === "channel" && scopeKind === "group")
  );
}
