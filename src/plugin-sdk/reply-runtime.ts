// Shared agent/reply runtime helpers for channel plugins. Keep channel plugins
// off direct src/auto-reply imports by routing common reply primitives here.

/** Re-exported API for src/plugin-sdk. */
export {
  chunkMarkdownText,
  chunkMarkdownTextWithMode,
  chunkText,
  chunkTextWithMode,
  resolveChunkMode,
  resolveTextChunkLimit,
} from "../auto-reply/chunk.js";
/** Re-exported API for src/plugin-sdk, starting with Chunk Mode. */
export type { ChunkMode } from "../auto-reply/chunk.js";
/** Re-exported API for src/plugin-sdk. */
export {
  dispatchInboundMessage,
  dispatchInboundMessageWithBufferedDispatcher,
  dispatchInboundMessageWithDispatcher,
  settleReplyDispatcher,
} from "../auto-reply/dispatch.js";
/** Re-exported API for src/plugin-sdk. */
export {
  normalizeGroupActivation,
  parseActivationCommand,
} from "../auto-reply/group-activation.js";
/** Re-exported API for src/plugin-sdk. */
export {
  HEARTBEAT_PROMPT,
  DEFAULT_HEARTBEAT_ACK_MAX_CHARS,
  resolveHeartbeatPrompt,
  stripHeartbeatToken,
} from "../auto-reply/heartbeat.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Heartbeat Reply Payload. */
export { resolveHeartbeatReplyPayload } from "../auto-reply/heartbeat-reply-payload.js";
/** Re-exported API for src/plugin-sdk, starting with get Reply From Config. */
export { getReplyFromConfig } from "../auto-reply/reply/get-reply.js";
/** Re-exported API for src/plugin-sdk, starting with HEARTBEAT TOKEN. */
export { HEARTBEAT_TOKEN, isSilentReplyText, SILENT_REPLY_TOKEN } from "../auto-reply/tokens.js";
/** Re-exported API for src/plugin-sdk, starting with is Abort Request Text. */
export { isAbortRequestText } from "../auto-reply/reply/abort.js";
/** Re-exported API for src/plugin-sdk, starting with is Btw Request Text. */
export { isBtwRequestText } from "../auto-reply/reply/btw-command.js";
/** Re-exported API for src/plugin-sdk, starting with reset Inbound Dedupe. */
export { resetInboundDedupe } from "../auto-reply/reply/inbound-dedupe.js";
/** Re-exported API for src/plugin-sdk, starting with finalize Inbound Context. */
export { finalizeInboundContext } from "../auto-reply/reply/inbound-context.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createInboundDebouncer,
  resolveInboundDebounceMs,
} from "../auto-reply/inbound-debounce.js";
/** Re-exported API for src/plugin-sdk. */
export {
  dispatchReplyWithBufferedBlockDispatcher,
  dispatchReplyWithDispatcher,
} from "../auto-reply/reply/provider-dispatcher.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createReplyDispatcher,
  createReplyDispatcherWithTyping,
} from "../auto-reply/reply/reply-dispatcher.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ReplyDispatchKind,
  ReplyDispatcher,
} from "../auto-reply/reply/reply-dispatcher.types.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ReplyDispatcherOptions,
  ReplyDispatcherWithTypingOptions,
} from "../auto-reply/reply/reply-dispatcher.js";
/** Re-exported API for src/plugin-sdk, starting with create Reply Reference Planner. */
export { createReplyReferencePlanner } from "../auto-reply/reply/reply-reference.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  GetReplyOptions,
  BlockReplyContext,
  SourceReplyDeliveryMode,
} from "../auto-reply/get-reply-options.types.js";
/** Re-exported API for src/plugin-sdk, starting with Reply Payload. */
export type { ReplyPayload } from "./reply-payload.js";
/** Re-exported API for src/plugin-sdk, starting with Finalized Msg Context. */
export type { FinalizedMsgContext, MsgContext } from "../auto-reply/templating.js";
/** Re-exported API for src/plugin-sdk, starting with Command Turn Context. */
export type { CommandTurnContext } from "../auto-reply/command-turn-context.js";
/** Re-exported API for src/plugin-sdk, starting with generate Conversation Label. */
export { generateConversationLabel } from "../auto-reply/reply/conversation-label-generator.js";
/** Re-exported API for src/plugin-sdk, starting with Conversation Label Params. */
export type { ConversationLabelParams } from "../auto-reply/reply/conversation-label-generator.js";
