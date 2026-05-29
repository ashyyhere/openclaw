// Public reply payload facade.
/** Re-exported API for src/auto-reply/reply. */
export {
  applyReplyTagsToPayload,
  applyReplyThreading,
  formatBtwTextForExternalDelivery,
  isRenderablePayload,
  shouldSuppressReasoningPayload,
} from "./reply-payloads-base.js";
/** Re-exported API for src/auto-reply/reply. */
export {
  filterMessagingToolDuplicates,
  filterMessagingToolMediaDuplicates,
  resolveMessagingToolPayloadDedupe,
  shouldDedupeMessagingToolRepliesForRoute,
} from "./reply-payloads-dedupe.js";
