// Legacy type facade for reply payload imports.
/** Re-exported API for src/auto-reply. */
export type {
  BlockReplyContext,
  GetReplyOptions,
  PartialReplyPayload,
  ReplyThreadingPolicy,
  TypingPolicy,
} from "./get-reply-options.types.js";
/** Re-exported API for src/auto-reply. */
export {
  copyReplyPayloadMetadata,
  markReplyPayloadForSourceSuppressionDelivery,
  setReplyPayloadMetadata,
} from "./reply-payload.js";
/** Re-exported API for src/auto-reply, starting with Reply Payload. */
export type { ReplyPayload } from "./reply-payload.js";
