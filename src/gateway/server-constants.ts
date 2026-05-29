// Keep server maxPayload aligned with gateway client maxPayload so high-res canvas snapshots
// don't get disconnected mid-invoke with "Max payload size exceeded".
/** Reused constant for MAX PAYLOAD BYTES behavior in src/gateway. */
export const MAX_PAYLOAD_BYTES = 25 * 1024 * 1024;
/** Reused constant for MAX BUFFERED BYTES behavior in src/gateway. */
export const MAX_BUFFERED_BYTES = 50 * 1024 * 1024; // per-connection send buffer limit (2x max payload)
/** Reused constant for MAX PREAUTH PAYLOAD BYTES behavior in src/gateway. */
export const MAX_PREAUTH_PAYLOAD_BYTES = 64 * 1024;

const DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES = 6 * 1024 * 1024; // keep history responses comfortably under client WS limits
let maxChatHistoryMessagesBytes = DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES;

/** Reused constant for get Max Chat History Messages Bytes behavior in src/gateway. */
export const getMaxChatHistoryMessagesBytes = () => maxChatHistoryMessagesBytes;

/** Reused constant for set Max Chat History Messages Bytes For Test behavior in src/gateway. */
export const setMaxChatHistoryMessagesBytesForTest = (value?: number) => {
  if (!process.env.VITEST && process.env.NODE_ENV !== "test") {
    return;
  }
  if (value === undefined) {
    maxChatHistoryMessagesBytes = DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES;
    return;
  }
  if (Number.isFinite(value) && value > 0) {
    maxChatHistoryMessagesBytes = value;
  }
};
/** Reused constant for TICK INTERVAL MS behavior in src/gateway. */
export const TICK_INTERVAL_MS = 30_000;
/** Reused constant for HEALTH REFRESH INTERVAL MS behavior in src/gateway. */
export const HEALTH_REFRESH_INTERVAL_MS = 60_000;
/** Reused constant for DEDUPE TTL MS behavior in src/gateway. */
export const DEDUPE_TTL_MS = 5 * 60_000;
/** Reused constant for DEDUPE MAX behavior in src/gateway. */
export const DEDUPE_MAX = 1000;
