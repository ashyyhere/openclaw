/** Public SDK barrel for reply reference parsing and formatting helpers. */
export {
  createReplyReferencePlanner,
  isSingleUseReplyToMode,
} from "../auto-reply/reply/reply-reference.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Batched Reply Threading Policy. */
export { resolveBatchedReplyThreadingPolicy } from "../auto-reply/reply/reply-threading.js";
/** Re-exported API for src/plugin-sdk, starting with Reply Threading Policy. */
export type { ReplyThreadingPolicy } from "../auto-reply/get-reply-options.types.js";
