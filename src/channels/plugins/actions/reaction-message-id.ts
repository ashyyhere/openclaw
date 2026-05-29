/** Resolves the message id targeted by a channel reaction action. */
import { readStringOrNumberParam } from "../../../agents/tools/common.js";

type ReactionToolContext = {
  currentMessageId?: string | number;
};

/** Reused helper for resolve Reaction Message Id behavior in src/channels/plugins. */
export function resolveReactionMessageId(params: {
  args: Record<string, unknown>;
  toolContext?: ReactionToolContext;
}): string | number | undefined {
  return readStringOrNumberParam(params.args, "messageId") ?? params.toolContext?.currentMessageId;
}
