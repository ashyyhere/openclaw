// Context text formatting for model-visible reply prompts.
import type { FinalizedMsgContext } from "../templating.js";

/** Shared type for Context Text Key in src/auto-reply/reply. */
export type ContextTextKey =
  | "BodyForAgent"
  | "BodyForCommands"
  | "CommandBody"
  | "RawBody"
  | "Body";

/** Reused helper for resolve First Context Text behavior in src/auto-reply/reply. */
export function resolveFirstContextText(
  ctx: FinalizedMsgContext,
  keys: readonly ContextTextKey[],
): string {
  for (const key of keys) {
    const value = ctx[key];
    if (typeof value === "string") {
      return value;
    }
  }
  return "";
}
