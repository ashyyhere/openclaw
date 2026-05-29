// Runtime re-export for reply payload deduplication.
/** Re-exported API for src/auto-reply/reply. */
export {
  filterMessagingToolDuplicates,
  filterMessagingToolMediaDuplicates,
  resolveMessagingToolPayloadDedupe,
  shouldDedupeMessagingToolRepliesForRoute,
  type MessagingToolPayloadDedupeDecision,
} from "./reply-payloads-dedupe.js";
