// Shared outbound/message lifecycle helpers for channel plugins.
import type {
  DurableMessageBatchSendResult,
  DurableMessageSendContext,
  DurableMessageSendContextParams,
} from "../channels/message/runtime.js";
type ChannelInboundKernelModule = typeof import("../channels/turn/kernel.js");
type ChannelMessageRuntimeModule = typeof import("../channels/message/runtime.js");

let channelMessageRuntimeModulePromise: Promise<ChannelMessageRuntimeModule> | null = null;

const loadChannelMessageRuntimeModule = async () => {
  channelMessageRuntimeModulePromise ??= import("../channels/message/runtime.js");
  return await channelMessageRuntimeModulePromise;
};

/** Durable inbound reply delivery contracts from the channel turn kernel. */
export type {
  DurableInboundReplyDeliveryOptions,
  DurableInboundReplyDeliveryParams,
  DurableInboundReplyDeliveryResult,
} from "../channels/turn/kernel.js";
/** Durable outbound message runtime parameter and result contracts. */
export type {
  DurableMessageBatchSendParams,
  DurableMessageBatchSendResult,
  DurableMessageSendContext,
  DurableMessageSendContextParams,
} from "../channels/message/runtime.js";
/** Reply prefix, typing callback, and message reply pipeline helpers. */
export {
  createReplyPrefixContext,
  createReplyPrefixOptions,
  createTypingCallbacks,
  createChannelReplyPipeline as createChannelMessageReplyPipeline,
  resolveChannelSourceReplyDeliveryMode as resolveChannelMessageSourceReplyDeliveryMode,
} from "../channels/message/index.js";

/** Finalizable draft lifecycle helpers for streaming channel previews. */
export {
  createFinalizableDraftLifecycle,
  createFinalizableDraftStreamControls,
  createFinalizableDraftStreamControlsForState,
  clearFinalizableDraftMessage,
  takeMessageIdAfterStop,
} from "../channels/draft-stream-controls.js";
/** Mutable state contract for finalizable draft streaming controls. */
export type { FinalizableDraftStreamState } from "../channels/draft-stream-controls.js";
/** Creates the loop that drives draft preview updates. */
export { createDraftStreamLoop } from "../channels/draft-stream-loop.js";
/** Draft stream loop controller contract. */
export type { DraftStreamLoop } from "../channels/draft-stream-loop.js";
/** Builds runtime forwarding delegates for plugin outbound adapters. */
export { createRuntimeOutboundDelegates } from "../channels/plugins/runtime-forwarders.js";
/** Creates a serialized channel run queue for account lifecycle tasks. */
export { createChannelRunQueue } from "./channel-lifecycle.core.js";
/** Channel run queue contracts used by lifecycle helpers. */
export type {
  ChannelRunQueue,
  ChannelRunQueueParams,
  ChannelRunQueueTaskContext,
} from "./channel-lifecycle.core.js";
/** Account status, server keepalive, passive lifecycle, and abort wait helpers. */
export {
  createAccountStatusSink,
  keepHttpServerTaskAlive,
  runPassiveAccountLifecycle,
  waitUntilAbort,
} from "./channel-lifecycle.core.js";
/** Outbound payload planning helpers for delivery-specific projection. */
export {
  createOutboundPayloadPlan,
  projectOutboundPayloadPlanForDelivery,
} from "../infra/outbound/payloads.js";
/** Builds outbound session context from configured agent/channel state. */
export {
  buildOutboundSessionContext,
  type OutboundSessionContext,
} from "../infra/outbound/session-context.js";
/** Formatting options applied while rendering outbound delivery batches. */
export type { OutboundDeliveryFormattingOptions } from "../infra/outbound/formatting.js";
/** Resolves the agent identity used for outbound channel delivery. */
export { resolveAgentOutboundIdentity } from "../infra/outbound/identity.js";
/** Outbound identity facts rendered into channel replies. */
export type { OutboundIdentity } from "../infra/outbound/identity.js";
/** Expands reply-to targets into concrete outbound fanout destinations. */
export { createReplyToFanout } from "../infra/outbound/reply-policy.js";
/** Reply-to target resolution contract for outbound delivery. */
export type { ReplyToResolution } from "../infra/outbound/reply-policy.js";
/** Resolves optional outbound send dependencies from runtime context. */
export { resolveOutboundSendDep } from "../infra/outbound/send-deps.js";
/** Optional dependency bundle consumed by outbound send helpers. */
export type { OutboundSendDeps } from "../infra/outbound/send-deps.js";
/** Converts rich outbound content to plain text for limited channels. */
export { sanitizeForPlainText } from "../infra/outbound/sanitize-text.js";
/** Logging helpers for failed ack and typing notifications. */
export { logAckFailure, logTypingFailure } from "../channels/logging.js";
export * from "../channels/streaming.js";
/** Message adapter, durability, receipt, live-preview, and proof helpers. */
export {
  classifyDurableSendRecoveryState,
  createChannelMessageAdapterFromOutbound,
  createDurableInboundReceiveJournal,
  createMessageReceiptFromOutboundResults,
  listMessageReceiptPlatformIds,
  createMessageReceiveContext,
  createPreviewMessageReceipt,
  defineFinalizableLivePreviewAdapter,
  deriveDurableFinalDeliveryRequirements,
  deliverFinalizableLivePreview,
  deliverWithFinalizableLivePreviewAdapter,
  listDeclaredChannelMessageLiveCapabilities,
  listDeclaredDurableFinalCapabilities,
  listDeclaredLivePreviewFinalizerCapabilities,
  listDeclaredReceiveAckPolicies,
  createLiveMessageState,
  createDurableMessageStateRecord,
  defineChannelMessageAdapter,
  markLiveMessageCancelled,
  markLiveMessageFinalized,
  markLiveMessagePreviewUpdated,
  resolveMessageReceiptPrimaryId,
  shouldAckMessageAfterStage,
  verifyChannelMessageAdapterCapabilityProofs,
  verifyChannelMessageLiveCapabilityAdapterProofs,
  verifyChannelMessageLiveCapabilityProofs,
  verifyChannelMessageLiveFinalizerProofs,
  verifyChannelMessageReceiveAckPolicyAdapterProofs,
  verifyChannelMessageReceiveAckPolicyProofs,
  verifyDurableFinalCapabilityProofs,
  verifyLivePreviewFinalizerCapabilityProofs,
} from "../channels/message/index.js";
/** Message adapter, durability, receipt, live-preview, and proof contracts. */
export type {
  ChannelMessageAdapter,
  ChannelMessageAdapterShape,
  ChannelMessageDurableFinalAdapter,
  ChannelMessageLiveFinalizerAdapterShape,
  ChannelMessageLiveAdapterShape,
  ChannelMessageLiveCapability,
  ChannelMessageOutboundBridgeAdapter,
  ChannelMessageOutboundBridgeResult,
  ChannelMessageReceiveAckPolicy,
  ChannelMessageReceiveAdapterShape,
  ChannelMessageSendAdapter,
  ChannelMessageSendAttemptContext,
  ChannelMessageSendAttemptKind,
  ChannelMessageSendCommitContext,
  ChannelMessageSendFailureContext,
  ChannelMessageSendLifecycleAdapter,
  ChannelMessageSendMediaContext,
  ChannelMessageSendPayloadContext,
  ChannelMessageSendPollContext,
  ChannelMessageSendResult,
  ChannelMessageSendSuccessContext,
  ChannelMessageSendTextContext,
  ChannelMessageUnknownSendContext,
  ChannelMessageUnknownSendReconciliationResult,
  CreateChannelReplyPipelineParams,
  CreateChannelMessageAdapterFromOutboundParams,
  DeriveDurableFinalDeliveryRequirementsParams,
  ChannelMessageLiveCapabilityProof,
  ChannelMessageLiveCapabilityProofMap,
  ChannelMessageLiveCapabilityProofResult,
  ChannelMessageReceiveAckPolicyProof,
  ChannelMessageReceiveAckPolicyProofMap,
  ChannelMessageReceiveAckPolicyProofResult,
  DurableFinalCapabilityProof,
  DurableFinalCapabilityProofMap,
  DurableFinalCapabilityProofResult,
  DurableFinalDeliveryCapability,
  DurableFinalDeliveryPayloadShape,
  DurableFinalDeliveryRequirementMap,
  DurableFinalRequirementExtras,
  DurableInboundReceiveAcceptOptions,
  DurableInboundReceiveAcceptResult,
  DurableInboundReceiveCompletedRecord,
  DurableInboundReceiveCompleteOptions,
  DurableInboundReceiveJournal,
  DurableInboundReceiveJournalOptions,
  DurableInboundReceivePendingRecord,
  DurableInboundReceiveReleaseOptions,
  DurableMessageSendIntent,
  DurableMessageSendState,
  DurableMessageStateRecord,
  FinalizableLivePreviewAdapter,
  LiveMessagePhase,
  LiveMessageState,
  LivePreviewFinalizerCapability,
  LivePreviewFinalizerCapabilityMap,
  LivePreviewFinalizerDraft,
  LivePreviewFinalizerCapabilityProof,
  LivePreviewFinalizerCapabilityProofMap,
  LivePreviewFinalizerCapabilityProofResult,
  LivePreviewFinalizerResult,
  LivePreviewFinalizerResultKind,
  MessageAckPolicy,
  MessageAckStage,
  MessageAckState,
  MessageReceiveContext,
  MessageSendContext,
  MessageDurabilityPolicy,
  MessageReceipt,
  MessageReceiptPart,
  MessageReceiptPartKind,
  MessageReceiptSourceResult,
  RenderedMessageBatch,
  RenderedMessageBatchPlan,
  RenderedMessageBatchPlanItem,
  RenderedMessageBatchPlanKind,
} from "../channels/message/index.js";

/** Lazy bridge for delivering inbound replies inside a durable message-send context. */
export const deliverInboundReplyWithMessageSendContext: ChannelInboundKernelModule["deliverInboundReplyWithMessageSendContext"] =
  async (...args) => {
    const mod = await import("../channels/turn/kernel.js");
    return await mod.deliverInboundReplyWithMessageSendContext(...args);
  };

/** Lazy wrapper for sending a rendered durable message batch. */
export async function sendDurableMessageBatch(
  params: DurableMessageSendContextParams,
): Promise<DurableMessageBatchSendResult> {
  const mod = await loadChannelMessageRuntimeModule();
  return await mod.sendDurableMessageBatch(params);
}

/** Lazy wrapper for running work inside a durable message-send context. */
export async function withDurableMessageSendContext<T>(
  params: DurableMessageSendContextParams,
  run: (ctx: DurableMessageSendContext) => Promise<T>,
): Promise<T> {
  const mod = await loadChannelMessageRuntimeModule();
  return await mod.withDurableMessageSendContext(params, run);
}
