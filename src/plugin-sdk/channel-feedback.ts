/** Public SDK barrel for channel feedback and acknowledgement reaction helpers. */
export { resolveAckReaction } from "../agents/identity.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createAckReactionHandle,
  removeAckReactionHandleAfterReply,
  removeAckReactionAfterReply,
  shouldAckReaction,
  shouldAckReactionForWhatsApp,
  type AckReactionHandle,
  type AckReactionGateParams,
  type AckReactionScope,
  type WhatsAppAckReactionMode,
} from "../channels/ack-reactions.js";
/** Re-exported API for src/plugin-sdk, starting with log Ack Failure. */
export { logAckFailure, logTypingFailure, type LogFn } from "../channels/logging.js";
/** Re-exported API for src/plugin-sdk, starting with missing Target Error. */
export { missingTargetError } from "../infra/outbound/target-errors.js";
/** Re-exported API for src/plugin-sdk. */
export {
  BUILD_TOOL_TOKENS,
  CODING_TOOL_TOKENS,
  CONCIERGE_TOOL_TOKENS,
  createStatusReactionController,
  DEFAULT_EMOJIS,
  DEFAULT_TIMING,
  DEPLOY_TOOL_TOKENS,
  resolveToolEmoji,
  WEB_TOOL_TOKENS,
  type StatusReactionAdapter,
  type StatusReactionController,
  type StatusReactionEmojis,
  type StatusReactionTiming,
} from "../channels/status-reactions.js";
