// Public channel message adapter and delivery facade.
/** Derives durable final-send requirements from adapter capabilities. */
export { deriveDurableFinalDeliveryRequirements } from "./capabilities.js";
/** Defines a channel message adapter with normalized capability metadata. */
export { defineChannelMessageAdapter } from "./adapter.js";
/** Bridges legacy outbound handlers into the channel message adapter contract. */
export { createChannelMessageAdapterFromOutbound } from "./outbound-bridge.js";
/** Creates the durable inbound receive journal used for ack/release bookkeeping. */
export { createDurableInboundReceiveJournal } from "./durable-receive.js";
/** Capability declaration and proof helpers for channel message adapters. */
export {
  listDeclaredChannelMessageLiveCapabilities,
  listDeclaredDurableFinalCapabilities,
  listDeclaredLivePreviewFinalizerCapabilities,
  listDeclaredReceiveAckPolicies,
  verifyChannelMessageAdapterCapabilityProofs,
  verifyChannelMessageLiveCapabilityAdapterProofs,
  verifyChannelMessageLiveFinalizerProofs,
  verifyChannelMessageLiveCapabilityProofs,
  verifyChannelMessageReceiveAckPolicyAdapterProofs,
  verifyChannelMessageReceiveAckPolicyProofs,
  verifyDurableFinalCapabilityProofs,
  verifyLivePreviewFinalizerCapabilityProofs,
} from "./contracts.js";
/** Live preview state, receipt, and finalization helpers for streaming message delivery. */
export {
  createLiveMessageState,
  createPreviewMessageReceipt,
  defineFinalizableLivePreviewAdapter,
  deliverFinalizableLivePreview,
  deliverWithFinalizableLivePreviewAdapter,
  markLiveMessageCancelled,
  markLiveMessageFinalized,
  markLiveMessagePreviewUpdated,
} from "./live.js";
/** Receipt helpers for turning outbound results into stable platform ids. */
export {
  createMessageReceiptFromOutboundResults,
  listMessageReceiptPlatformIds,
  resolveMessageReceiptPrimaryId,
} from "./receipt.js";
/** Receive context and ack-policy helpers for inbound channel messages. */
export { createMessageReceiveContext, shouldAckMessageAfterStage } from "./receive.js";
/** Reply prefix, typing callback, and source-delivery helpers for channel responses. */
export {
  createChannelReplyPipeline,
  createReplyPrefixContext,
  createReplyPrefixOptions,
  createTypingCallbacks,
  resolveChannelSourceReplyDeliveryMode,
} from "./reply-pipeline.js";
/** Durable send state helpers for recovery after interrupted final delivery. */
export { classifyDurableSendRecoveryState, createDurableMessageStateRecord } from "./state.js";
/** Durable inbound receive journal contracts. */
export type {
  DurableInboundReceiveAcceptOptions,
  DurableInboundReceiveAcceptResult,
  DurableInboundReceiveCompletedRecord,
  DurableInboundReceiveCompleteOptions,
  DurableInboundReceiveJournal,
  DurableInboundReceiveJournalOptions,
  DurableInboundReceivePendingRecord,
  DurableInboundReceiveReleaseOptions,
} from "./durable-receive.js";
/** Outbound bridge adapter contracts. */
export type {
  ChannelMessageOutboundBridgeAdapter,
  ChannelMessageOutboundBridgeResult,
  CreateChannelMessageAdapterFromOutboundParams,
} from "./outbound-bridge.js";
/** Adapter capability proof contracts exported for tests and plugin assertions. */
export type {
  ChannelMessageLiveCapabilityProof,
  ChannelMessageLiveCapabilityProofMap,
  ChannelMessageLiveCapabilityProofResult,
  ChannelMessageReceiveAckPolicyProof,
  ChannelMessageReceiveAckPolicyProofMap,
  ChannelMessageReceiveAckPolicyProofResult,
  DurableFinalCapabilityProof,
  DurableFinalCapabilityProofMap,
  DurableFinalCapabilityProofResult,
  LivePreviewFinalizerCapabilityProof,
  LivePreviewFinalizerCapabilityProofMap,
  LivePreviewFinalizerCapabilityProofResult,
} from "./contracts.js";
/** Reply pipeline contracts used by channel adapters and SDK facades. */
export type {
  ChannelReplyPipeline,
  CreateChannelReplyPipelineParams,
  CreateTypingCallbacksParams,
  ReplyPrefixContext,
  ReplyPrefixContextBundle,
  ReplyPrefixOptions,
  SourceReplyDeliveryMode,
  TypingCallbacks,
} from "./reply-pipeline.js";
/** Inbound receive ack policy contracts. */
export type {
  MessageAckPolicy,
  MessageAckStage,
  MessageAckState,
  MessageReceiveContext,
} from "./receive.js";
/** Live preview finalizer contracts. */
export type {
  LivePreviewFinalizerDraft,
  FinalizableLivePreviewAdapter,
  LivePreviewFinalizerResult,
  LivePreviewFinalizerResultKind,
} from "./live.js";
/** Durable message send state record contracts. */
export type { DurableMessageSendState, DurableMessageStateRecord } from "./state.js";
/** Core channel message adapter, send lifecycle, receipt, and rendered batch contracts. */
export type {
  ChannelMessageAdapter,
  ChannelMessageAdapterShape,
  ChannelMessageDurableFinalAdapter,
  ChannelMessageLiveFinalizerAdapterShape,
  ChannelMessageLiveAdapterShape,
  ChannelMessageLiveCapability,
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
  DeriveDurableFinalDeliveryRequirementsParams,
  DurableFinalDeliveryCapability,
  DurableFinalDeliveryPayloadShape,
  DurableFinalDeliveryRequirementMap,
  DurableFinalRequirementExtras,
  DurableMessageSendIntent,
  MessageSendContext,
  MessageDurabilityPolicy,
  LiveMessagePhase,
  LiveMessageState,
  LivePreviewFinalizerCapability,
  LivePreviewFinalizerCapabilityMap,
  MessageReceipt,
  MessageReceiptPart,
  MessageReceiptPartKind,
  MessageReceiptSourceResult,
  RenderedMessageBatch,
  RenderedMessageBatchPlan,
  RenderedMessageBatchPlanItem,
  RenderedMessageBatchPlanKind,
} from "./types.js";
