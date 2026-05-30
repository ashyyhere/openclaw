/** Runtime imports isolated for embedded gateway stub tests and wiring. */
export { resolveSessionAgentId } from "../../agents/agent-scope.js";
/** Runtime config accessor used by embedded gateway session tools. */
export { getRuntimeConfig } from "../../config/config.js";
/** Chat history projection helpers used by embedded gateway stubs. */
export {
  projectRecentChatDisplayMessages,
  resolveEffectiveChatHistoryMaxChars,
} from "../../gateway/chat-display-projection.js";
/** Attach imported CLI session history to gateway chat history. */
export { augmentChatHistoryWithCliSessionImports } from "../../gateway/cli-session-history.js";
/** Runtime byte cap for chat-history message responses. */
export { getMaxChatHistoryMessagesBytes } from "../../gateway/server-constants.js";
/** Chat history budget and canvas-block helpers used by session tools. */
export {
  augmentChatHistoryWithCanvasBlocks,
  CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES,
  enforceChatHistoryFinalBudget,
  replaceOversizedChatHistoryMessages,
} from "../../gateway/server-methods/chat.js";
/** Cap JSON arrays by serialized byte size for session tool payloads. */
export { capArrayByJsonBytes } from "../../gateway/session-utils.fs.js";
/** Session store readers used by embedded gateway session tools. */
export {
  listSessionsFromStoreAsync,
  loadCombinedSessionStoreForGateway,
  loadSessionEntry,
  readSessionMessagesAsync,
  resolveSessionModelRef,
} from "../../gateway/session-utils.js";
/** Resolve a session key from sessions.resolve-style input. */
export { resolveSessionKeyFromResolveParams } from "../../gateway/sessions-resolve.js";
/** Sessions list response type returned by gateway session utilities. */
export type { SessionsListResult } from "../../gateway/session-utils.types.js";
