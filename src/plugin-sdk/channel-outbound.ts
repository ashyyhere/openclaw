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

/** Re-exported API for src/plugin-sdk. */
export type {
  DurableInboundReplyDeliveryOptions,
  DurableInboundReplyDeliveryParams,
  DurableInboundReplyDeliveryResult,
} from "../channels/turn/kernel.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  DurableMessageBatchSendParams,
  DurableMessageBatchSendResult,
  DurableMessageSendContext,
  DurableMessageSendContextParams,
} from "../channels/message/runtime.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createReplyPrefixContext,
  createReplyPrefixOptions,
  createTypingCallbacks,
  createChannelReplyPipeline as createChannelMessageReplyPipeline,
  resolveChannelSourceReplyDeliveryMode as resolveChannelMessageSourceReplyDeliveryMode,
} from "../channels/message/index.js";

/** Re-exported API for src/plugin-sdk. */
export {
  createFinalizableDraftLifecycle,
  createFinalizableDraftStreamControls,
  createFinalizableDraftStreamControlsForState,
  clearFinalizableDraftMessage,
  takeMessageIdAfterStop,
} from "../channels/draft-stream-controls.js";
/** Re-exported API for src/plugin-sdk, starting with Finalizable Draft Stream State. */
export type { FinalizableDraftStreamState } from "../channels/draft-stream-controls.js";
/** Re-exported API for src/plugin-sdk, starting with create Draft Stream Loop. */
export { createDraftStreamLoop } from "../channels/draft-stream-loop.js";
/** Re-exported API for src/plugin-sdk, starting with Draft Stream Loop. */
export type { DraftStreamLoop } from "../channels/draft-stream-loop.js";
/** Re-exported API for src/plugin-sdk, starting with create Runtime Outbound Delegates. */
export { createRuntimeOutboundDelegates } from "../channels/plugins/runtime-forwarders.js";
/** Re-exported API for src/plugin-sdk, starting with create Channel Run Queue. */
export { createChannelRunQueue } from "./channel-lifecycle.core.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ChannelRunQueue,
  ChannelRunQueueParams,
  ChannelRunQueueTaskContext,
} from "./channel-lifecycle.core.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createAccountStatusSink,
  keepHttpServerTaskAlive,
  runPassiveAccountLifecycle,
  waitUntilAbort,
} from "./channel-lifecycle.core.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createOutboundPayloadPlan,
  projectOutboundPayloadPlanForDelivery,
} from "../infra/outbound/payloads.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildOutboundSessionContext,
  type OutboundSessionContext,
} from "../infra/outbound/session-context.js";
/** Re-exported API for src/plugin-sdk, starting with Outbound Delivery Formatting Options. */
export type { OutboundDeliveryFormattingOptions } from "../infra/outbound/formatting.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Agent Outbound Identity. */
export { resolveAgentOutboundIdentity } from "../infra/outbound/identity.js";
/** Re-exported API for src/plugin-sdk, starting with Outbound Identity. */
export type { OutboundIdentity } from "../infra/outbound/identity.js";
/** Re-exported API for src/plugin-sdk, starting with create Reply To Fanout. */
export { createReplyToFanout } from "../infra/outbound/reply-policy.js";
/** Re-exported API for src/plugin-sdk, starting with Reply To Resolution. */
export type { ReplyToResolution } from "../infra/outbound/reply-policy.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Outbound Send Dep. */
export { resolveOutboundSendDep } from "../infra/outbound/send-deps.js";
/** Re-exported API for src/plugin-sdk, starting with Outbound Send Deps. */
export type { OutboundSendDeps } from "../infra/outbound/send-deps.js";
/** Re-exported API for src/plugin-sdk, starting with sanitize For Plain Text. */
export { sanitizeForPlainText } from "../infra/outbound/sanitize-text.js";
/** Re-exported API for src/plugin-sdk, starting with log Ack Failure. */
export { logAckFailure, logTypingFailure } from "../channels/logging.js";
export * from "../channels/streaming.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
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

/** Reused constant for deliver Inbound Reply With Message Send Context behavior in src/plugin-sdk. */
export const deliverInboundReplyWithMessageSendContext: ChannelInboundKernelModule["deliverInboundReplyWithMessageSendContext"] =
  async (...args) => {
    const mod = await import("../channels/turn/kernel.js");
    return await mod.deliverInboundReplyWithMessageSendContext(...args);
  };

/** Reused helper for send Durable Message Batch behavior in src/plugin-sdk. */
export async function sendDurableMessageBatch(
  params: DurableMessageSendContextParams,
): Promise<DurableMessageBatchSendResult> {
  const mod = await loadChannelMessageRuntimeModule();
  return await mod.sendDurableMessageBatch(params);
}

/** Reused helper for with Durable Message Send Context behavior in src/plugin-sdk. */
export async function withDurableMessageSendContext<T>(
  params: DurableMessageSendContextParams,
  run: (ctx: DurableMessageSendContext) => Promise<T>,
): Promise<T> {
  const mod = await loadChannelMessageRuntimeModule();
  return await mod.withDurableMessageSendContext(params, run);
}
