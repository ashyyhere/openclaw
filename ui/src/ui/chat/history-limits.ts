// Chat transcript render limits shared by history display and input recall.
/** Maximum number of recent messages rendered or scanned for input history. */
export const CHAT_HISTORY_RENDER_LIMIT = 100;
/** Soft character budget for rendered transcript text before pruning. */
export const CHAT_HISTORY_RENDER_CHAR_BUDGET = 240_000;
