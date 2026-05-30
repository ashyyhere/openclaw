// Shared agent/reply runtime helpers for channel plugins. Keep channel plugins
// off direct src/auto-reply imports by routing common reply primitives here.

/** Reply chunking helpers used by channels that split long outbound text. */
export {
  chunkMarkdownText,
  chunkMarkdownTextWithMode,
  chunkText,
  chunkTextWithMode,
  resolveChunkMode,
  resolveTextChunkLimit,
} from "../auto-reply/chunk.js";
/** Chunking mode selected by reply text splitters. */
export type { ChunkMode } from "../auto-reply/chunk.js";
/** Inbound dispatch entrypoints that hand channel messages to the reply loop. */
export {
  dispatchInboundMessage,
  dispatchInboundMessageWithBufferedDispatcher,
  dispatchInboundMessageWithDispatcher,
  settleReplyDispatcher,
} from "../auto-reply/dispatch.js";
/** Group activation parser and normalizer for opt-in channel threads. */
export {
  normalizeGroupActivation,
  parseActivationCommand,
} from "../auto-reply/group-activation.js";
/** Heartbeat prompt helpers for liveness acknowledgements in channels. */
export {
  HEARTBEAT_PROMPT,
  DEFAULT_HEARTBEAT_ACK_MAX_CHARS,
  resolveHeartbeatPrompt,
  stripHeartbeatToken,
} from "../auto-reply/heartbeat.js";
/** Builds the reply payload used for heartbeat acknowledgement messages. */
export { resolveHeartbeatReplyPayload } from "../auto-reply/heartbeat-reply-payload.js";
/** Resolves reply behavior from channel config and runtime context. */
export { getReplyFromConfig } from "../auto-reply/reply/get-reply.js";
/** Silent and heartbeat reply tokens shared with channel send paths. */
export { HEARTBEAT_TOKEN, isSilentReplyText, SILENT_REPLY_TOKEN } from "../auto-reply/tokens.js";
/** Detects user text that should abort the active reply run. */
export { isAbortRequestText } from "../auto-reply/reply/abort.js";
/** Detects side-channel `btw` reply requests. */
export { isBtwRequestText } from "../auto-reply/reply/btw-command.js";
/** Test/runtime hook for clearing inbound message dedupe state. */
export { resetInboundDedupe } from "../auto-reply/reply/inbound-dedupe.js";
/** Finalizes inbound message context before reply templating and dispatch. */
export { finalizeInboundContext } from "../auto-reply/reply/inbound-context.js";
/** Inbound debounce helpers for coalescing rapid channel events. */
export {
  createInboundDebouncer,
  resolveInboundDebounceMs,
} from "../auto-reply/inbound-debounce.js";
/** Provider dispatch helpers that stream reply blocks into channel dispatchers. */
export {
  dispatchReplyWithBufferedBlockDispatcher,
  dispatchReplyWithDispatcher,
} from "../auto-reply/reply/provider-dispatcher.js";
/** Reply dispatcher factories, including typing-indicator integration. */
export {
  createReplyDispatcher,
  createReplyDispatcherWithTyping,
} from "../auto-reply/reply/reply-dispatcher.js";
/** Reply dispatcher event and sink contracts. */
export type {
  ReplyDispatchKind,
  ReplyDispatcher,
} from "../auto-reply/reply/reply-dispatcher.types.js";
/** Options accepted by reply dispatcher factory helpers. */
export type {
  ReplyDispatcherOptions,
  ReplyDispatcherWithTypingOptions,
} from "../auto-reply/reply/reply-dispatcher.js";
/** Plans reply references such as thread quoting and reply-to metadata. */
export { createReplyReferencePlanner } from "../auto-reply/reply/reply-reference.js";
/** Reply request option contracts shared by channel reply providers. */
export type {
  GetReplyOptions,
  BlockReplyContext,
  SourceReplyDeliveryMode,
} from "../auto-reply/get-reply-options.types.js";
/** Channel-facing reply payload shape. */
export type { ReplyPayload } from "./reply-payload.js";
/** Message context shapes used after inbound templating has been finalized. */
export type { FinalizedMsgContext, MsgContext } from "../auto-reply/templating.js";
/** Context passed to command turns initiated from channel messages. */
export type { CommandTurnContext } from "../auto-reply/command-turn-context.js";
/** Generates a stable human-readable label for a channel conversation. */
export { generateConversationLabel } from "../auto-reply/reply/conversation-label-generator.js";
/** Input shape for channel conversation label generation. */
export type { ConversationLabelParams } from "../auto-reply/reply/conversation-label-generator.js";
