/** Control tokens understood by sessions-send delivery. */
import { HEARTBEAT_TOKEN, isSilentReplyText, SILENT_REPLY_TOKEN } from "../../auto-reply/tokens.js";

/** Reused constant for ANNOUNCE SKIP TOKEN behavior in src/agents/tools. */
export const ANNOUNCE_SKIP_TOKEN = "ANNOUNCE_SKIP";
/** Reused constant for REPLY SKIP TOKEN behavior in src/agents/tools. */
export const REPLY_SKIP_TOKEN = "REPLY_SKIP";

const NON_DELIVERABLE_REPLY_TOKENS = [
  ANNOUNCE_SKIP_TOKEN,
  REPLY_SKIP_TOKEN,
  SILENT_REPLY_TOKEN,
  HEARTBEAT_TOKEN,
] as const;

/** Checks whether announcement delivery should be skipped. */
export function isAnnounceSkip(text?: string) {
  return (text ?? "").trim() === ANNOUNCE_SKIP_TOKEN;
}

/** Checks whether reply delivery should be skipped. */
export function isReplySkip(text?: string) {
  return (text ?? "").trim() === REPLY_SKIP_TOKEN;
}

/** Checks whether a sessions-send reply should not be delivered. */
export function isNonDeliverableSessionsReply(text?: string) {
  return NON_DELIVERABLE_REPLY_TOKENS.some((token) => isSilentReplyText(text, token));
}
