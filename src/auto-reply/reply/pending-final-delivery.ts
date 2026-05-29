// Pending final delivery tracking for streamed replies.
import {
  isSilentReplyPayloadText,
  isSilentReplyText,
  SILENT_REPLY_TOKEN,
  startsWithSilentToken,
  stripLeadingSilentToken,
  stripSilentToken,
} from "../tokens.js";
import { stripInternalMetadataForDisplay } from "./display-text-sanitize.js";

/** Reused helper for sanitize Pending Final Delivery Text behavior in src/auto-reply/reply. */
export function sanitizePendingFinalDeliveryText(text: string): string {
  let stripped = stripInternalMetadataForDisplay(text).trim();
  if (isSilentReplyPayloadText(stripped, SILENT_REPLY_TOKEN)) {
    return "";
  }
  if (stripped && !isSilentReplyText(stripped, SILENT_REPLY_TOKEN)) {
    const hasLeadingSilentToken = startsWithSilentToken(stripped, SILENT_REPLY_TOKEN);
    if (hasLeadingSilentToken) {
      stripped = stripLeadingSilentToken(stripped, SILENT_REPLY_TOKEN);
    }
    if (
      hasLeadingSilentToken ||
      stripped.toLowerCase().includes(SILENT_REPLY_TOKEN.toLowerCase())
    ) {
      stripped = stripSilentToken(stripped, SILENT_REPLY_TOKEN);
    }
  }
  if (!stripped.trim()) {
    return "";
  }
  return isSilentReplyPayloadText(stripped, SILENT_REPLY_TOKEN) ? "" : stripped.trim();
}
