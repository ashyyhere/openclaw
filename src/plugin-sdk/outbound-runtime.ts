/** @deprecated Compatibility subpath. Use `openclaw/plugin-sdk/channel-outbound`. */
export {
  buildOutboundSessionContext,
  createOutboundPayloadPlan,
  createReplyToFanout,
  createRuntimeOutboundDelegates,
  projectOutboundPayloadPlanForDelivery,
  resolveAgentOutboundIdentity,
  resolveOutboundSendDep,
  sanitizeForPlainText,
} from "./channel-outbound.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  OutboundDeliveryFormattingOptions,
  OutboundIdentity,
  OutboundSendDeps,
  OutboundSessionContext,
  ReplyToResolution,
} from "./channel-outbound.js";

/** @deprecated Direct outbound delivery is compatibility/runtime substrate. */
export { deliverOutboundPayloads } from "../infra/outbound/deliver.js";
/** @deprecated Direct outbound delivery params are compatibility/runtime substrate. */
export type { DeliverOutboundPayloadsParams } from "../infra/outbound/deliver.js";
/** Re-exported API for src/plugin-sdk, starting with type. */
export { type OutboundDeliveryResult } from "../infra/outbound/deliver.js";
