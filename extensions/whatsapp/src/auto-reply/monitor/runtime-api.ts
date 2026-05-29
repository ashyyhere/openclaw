// extensions/whatsapp/src/auto-reply/monitor runtime api helpers and runtime behavior.
/** Re-exported whatsapp plugin public API, starting with resolve Identity Name Prefix. */
export { resolveIdentityNamePrefix } from "openclaw/plugin-sdk/agent-runtime";
/** Re-exported whatsapp plugin public API, starting with format Inbound Envelope. */
export { formatInboundEnvelope } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported whatsapp plugin public API, starting with resolve Inbound Session Envelope Context. */
export { resolveInboundSessionEnvelopeContext } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported whatsapp plugin public API, starting with to Location Context. */
export { toLocationContext } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported whatsapp plugin public API. */
export {
  createChannelMessageReplyPipeline,
  resolveChannelMessageSourceReplyDeliveryMode,
} from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported whatsapp plugin public API. */
export {
  isControlCommandMessage,
  shouldComputeCommandAuthorized,
} from "openclaw/plugin-sdk/command-detection";
/** Re-exported whatsapp plugin public API, starting with resolve Channel Context Visibility Mode. */
export { resolveChannelContextVisibilityMode } from "../config.runtime.js";
/** Re-exported whatsapp plugin public API, starting with get Agent Scoped Media Local Roots. */
export { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
/** Public whatsapp plugin type for Load Config Fn. */
export type LoadConfigFn = typeof import("../config.runtime.js").getRuntimeConfig;
/** Re-exported whatsapp plugin public API. */
export {
  buildHistoryContextFromEntries,
  type HistoryEntry,
} from "openclaw/plugin-sdk/reply-history";
/** Re-exported whatsapp plugin public API, starting with resolve Sendable Outbound Reply Parts. */
export { resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
/** Re-exported whatsapp plugin public API. */
export {
  dispatchReplyWithBufferedBlockDispatcher,
  finalizeInboundContext,
  resolveChunkMode,
  resolveTextChunkLimit,
  type getReplyFromConfig,
  type ReplyPayload,
} from "openclaw/plugin-sdk/reply-runtime";
/** Re-exported whatsapp plugin public API. */
export {
  resolveInboundLastRouteSessionKey,
  type resolveAgentRoute,
} from "openclaw/plugin-sdk/routing";
/** Re-exported whatsapp plugin public API, starting with log Verbose. */
export { logVerbose, shouldLogVerbose, type getChildLogger } from "openclaw/plugin-sdk/runtime-env";
/** Re-exported whatsapp plugin public API, starting with resolve Pinned Main Dm Owner From Allowlist. */
export { resolvePinnedMainDmOwnerFromAllowlist } from "openclaw/plugin-sdk/security-runtime";
/** Re-exported whatsapp plugin public API, starting with resolve Markdown Table Mode. */
export { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
/** Re-exported whatsapp plugin public API, starting with jid To E164. */
export { jidToE164, normalizeE164 } from "../../text-runtime.js";
