// Keep server maxPayload aligned with gateway client maxPayload so high-res canvas snapshots
// don't get disconnected mid-invoke with "Max payload size exceeded".
/** Maximum authenticated gateway payload size accepted by the WebSocket server. */
export const MAX_PAYLOAD_BYTES = 25 * 1024 * 1024;
/** Per-connection buffered-send cap before the gateway drops slow clients. */
export const MAX_BUFFERED_BYTES = 50 * 1024 * 1024; // per-connection send buffer limit (2x max payload)
/** Small payload cap for unauthenticated pre-authentication gateway messages. */
export const MAX_PREAUTH_PAYLOAD_BYTES = 64 * 1024;

const DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES = 6 * 1024 * 1024; // keep history responses comfortably under client WS limits
let maxChatHistoryMessagesBytes = DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES;

/** Read the chat-history byte cap used for gateway history responses. */
export const getMaxChatHistoryMessagesBytes = () => maxChatHistoryMessagesBytes;

/** Override the chat-history byte cap in tests only. */
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
/** Periodic gateway tick interval for housekeeping. */
export const TICK_INTERVAL_MS = 30_000;
/** Minimum interval between gateway health refreshes. */
export const HEALTH_REFRESH_INTERVAL_MS = 60_000;
/** Time window for duplicate gateway message suppression. */
export const DEDUPE_TTL_MS = 5 * 60_000;
/** Maximum duplicate-message keys retained by the gateway. */
export const DEDUPE_MAX = 1000;
