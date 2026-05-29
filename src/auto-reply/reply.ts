// Public reply facade that preserves legacy import paths.
/** Re-exported API for src/auto-reply. */
export {
  extractElevatedDirective,
  extractReasoningDirective,
  extractTraceDirective,
  extractThinkDirective,
  extractVerboseDirective,
} from "./reply/directives.js";
/** Re-exported API for src/auto-reply, starting with get Reply From Config. */
export { getReplyFromConfig } from "./reply/get-reply.js";
/** Re-exported API for src/auto-reply, starting with extract Exec Directive. */
export { extractExecDirective } from "./reply/exec.js";
/** Re-exported API for src/auto-reply, starting with extract Queue Directive. */
export { extractQueueDirective } from "./reply/queue.js";
/** Re-exported API for src/auto-reply, starting with extract Reply To Tag. */
export { extractReplyToTag } from "./reply/reply-tags.js";
/** Re-exported API for src/auto-reply, starting with Get Reply Options. */
export type { GetReplyOptions, ReplyPayload } from "./types.js";
