// Lazy runtime boundary for gateway node-event handling; keeps server startup
// separated from heavier command, channel, session, and media helpers.
/** Resolves the agent scope for session-backed node events. */
export { resolveSessionAgentId } from "../agents/agent-scope.js";
/** Normalizes inbound system tags before node events enter reply handling. */
export { sanitizeInboundSystemTags } from "../auto-reply/reply/inbound-text.js";
/** Normalizes plugin channel ids carried by node event payloads. */
export { normalizeChannelId } from "../channels/plugins/index.js";
/** Durable channel send helper used when node events fan out messages. */
export { sendDurableMessageBatch } from "../channels/message/runtime.js";
/** Creates outbound-send dependencies for gateway-originated node events. */
export { createOutboundSendDeps } from "../cli/outbound-send-deps.js";
/** Routes ingress-style node events into the agent command path. */
export { agentCommandFromIngress } from "../commands/agent.js";
/** Reads current runtime config for node-event decisions. */
export { getRuntimeConfig } from "../config/io.js";
/** Session-store writer used by node-event handlers. */
export { updateSessionStore } from "../config/sessions.js";
/** Device identity loader used by node-event push/device flows. */
export { loadOrCreateDeviceIdentity } from "../infra/device-identity.js";
/** Heartbeat wake helper used after event-driven session updates. */
export { requestHeartbeat } from "../infra/heartbeat-wake.js";
/** Builds outbound session context for node-event replies. */
export { buildOutboundSessionContext } from "../infra/outbound/session-context.js";
/** Resolves outbound channel targets carried by node event payloads. */
export { resolveOutboundTarget } from "../infra/outbound/targets.js";
/** APNs registration helper for gateway node/device events. */
export { registerApnsRegistration } from "../infra/push-apns.js";
/** Queues system events emitted while processing gateway node events. */
export { enqueueSystemEvent } from "../infra/system-events.js";
/** Removes temporary media buffers referenced by node events. */
export { deleteMediaBuffer } from "../media/store.js";
/** Session-key helpers for heartbeat scoping from node events. */
export { normalizeMainKey, scopedHeartbeatWakeOptions } from "../routing/session-key.js";
/** Default model runtime used by node-event agent invocations. */
export { defaultRuntime } from "../runtime.js";
/** Attachment parsing helpers for chat-like node event payloads. */
export { parseMessageWithAttachments, resolveChatAttachmentMaxBytes } from "./chat-attachments.js";
/** Converts RPC attachment payloads to chat attachment records. */
export { normalizeRpcAttachmentsToChatAttachments } from "./server-methods/attachment-normalize.js";
/** Session lookup/model helpers reused by node-event handlers. */
export {
  loadSessionEntry,
  migrateAndPruneGatewaySessionStoreKey,
  resolveGatewayModelSupportsImages,
  resolveSessionModelRef,
} from "./session-utils.js";
/** Log formatter for bounded node-event payload diagnostics. */
export { formatForLog } from "./ws-log.js";
