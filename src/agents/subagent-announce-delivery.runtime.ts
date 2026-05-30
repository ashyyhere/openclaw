/** Runtime imports isolated for subagent announcement delivery tests and lazy loading. */
export { getRuntimeConfig } from "../config/config.js";
/** Session-store helpers used by subagent announce delivery. */
export {
  loadSessionStore,
  resolveAgentIdFromSessionKey,
  resolveStorePath,
} from "../config/sessions.js";
/** Gateway caller used when announce delivery routes through gateway RPC. */
export { callGateway } from "../gateway/call.js";
/** In-process gateway dispatcher used by local announce delivery. */
export { dispatchGatewayMethodInProcess } from "../gateway/server-plugins.js";
/** Queue settings resolver used before enqueueing announce replies. */
export { resolveQueueSettings } from "../auto-reply/reply/queue.js";
/** Best-effort outbound target resolver for announce delivery fallback. */
export { resolveExternalBestEffortDeliveryTarget } from "../infra/outbound/best-effort-delivery.js";
/** Outbound message sender used by subagent announce delivery. */
export { sendMessage } from "../infra/outbound/message.js";
/** Bound delivery router factory for scoped announce delivery. */
export { createBoundDeliveryRouter } from "../infra/outbound/bound-delivery-router.js";
/** Conversation id resolver for announce delivery target metadata. */
export { resolveConversationIdFromTargets } from "../infra/outbound/conversation-id.js";
/** Hook runner accessor used to notify delivery lifecycle hooks. */
export { getGlobalHookRunner } from "../plugins/hook-runner-global.js";
/** Embedded run queue helpers used by subagent announce delivery. */
export {
  formatEmbeddedAgentQueueFailureSummary,
  isEmbeddedAgentRunActive,
  isEmbeddedRunAbandoned,
  queueEmbeddedAgentMessageWithOutcomeAsync,
  resolveActiveEmbeddedRunSessionId,
} from "./embedded-agent-runner/runs.js";
