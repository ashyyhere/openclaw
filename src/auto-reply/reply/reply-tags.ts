// Reply tag parsing helpers.
import { parseInlineDirectives } from "../../utils/directive-tags.js";

/** Reused helper for extract Reply To Tag behavior in src/auto-reply/reply. */
export function extractReplyToTag(
  text?: string,
  currentMessageId?: string,
): {
  cleaned: string;
  replyToId?: string;
  replyToCurrent: boolean;
  hasTag: boolean;
} {
  const result = parseInlineDirectives(text, {
    currentMessageId,
    stripAudioTag: false,
  });
  return {
    cleaned: result.text,
    replyToId: result.replyToId,
    replyToCurrent: result.replyToCurrent,
    hasTag: result.hasReplyTag,
  };
}
