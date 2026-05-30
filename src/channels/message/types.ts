// Shared channel message adapter, receipt, lifecycle, and capability types.
import type { ReplyPayload } from "../../auto-reply/reply-payload.js";
import type { ReplyToMode } from "../../config/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { OutboundSendDeps } from "../../infra/outbound/send-deps.js";
import type { OutboundMediaAccess } from "../../media/load-options.js";
import type { PollInput } from "../../polls.js";

/** Durability policy for final message delivery. */
export type MessageDurabilityPolicy = "required" | "best_effort" | "disabled";

/** Capabilities a channel may declare for durable final delivery. */
export const durableFinalDeliveryCapabilities = [
  "text",
  "media",
  "poll",
  "payload",
  "silent",
  "replyTo",
  "thread",
  "nativeQuote",
  "messageSendingHooks",
  "batch",
  "reconcileUnknownSend",
  "afterSendSuccess",
  "afterCommit",
] as const;

/** Capability token a channel can declare for required final delivery features. */
export type DurableFinalDeliveryCapability = (typeof durableFinalDeliveryCapabilities)[number];

/** Per-capability requirement map used before committing durable final sends. */
export type DurableFinalDeliveryRequirementMap = Partial<
  Record<DurableFinalDeliveryCapability, boolean>
>;

/** Normalized payload facts used to derive durable final delivery requirements. */
export type DurableFinalDeliveryPayloadShape = {
  text?: string | null;
  replyToId?: string | null;
  mediaUrl?: string | null;
  mediaUrls?: readonly (string | null | undefined)[] | null;
};

/** Raw channel send result fields preserved inside durable message receipts. */
export type MessageReceiptSourceResult = {
  channel?: string;
  messageId?: string;
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  toJid?: string;
  pollId?: string;
  timestamp?: number;
  meta?: Record<string, unknown>;
};

/** Logical kind for one platform message part in a durable receipt. */
export type MessageReceiptPartKind =
  | "text"
  | "media"
  | "voice"
  | "poll"
  | "card"
  | "preview"
  | "unknown";

/** One platform message id emitted while sending a rendered batch. */
export type MessageReceiptPart = {
  platformMessageId: string;
  kind: MessageReceiptPartKind;
  index: number;
  threadId?: string;
  replyToId?: string;
  raw?: MessageReceiptSourceResult;
};

/** Durable send receipt used for edit, delete, reconciliation, and commit hooks. */
export type MessageReceipt = {
  primaryPlatformMessageId?: string;
  platformMessageIds: string[];
  parts: MessageReceiptPart[];
  threadId?: string;
  replyToId?: string;
  editToken?: string;
  deleteToken?: string;
  sentAt: number;
  raw?: readonly MessageReceiptSourceResult[];
};

/** Classification for one rendered outbound message payload. */
export type RenderedMessageBatchPlanKind =
  | "text"
  | "media"
  | "voice"
  | "presentation"
  | "interactive"
  | "channelData"
  | "empty";

/** Summary of one rendered payload inside an outbound batch. */
export type RenderedMessageBatchPlanItem = {
  index: number;
  kinds: readonly RenderedMessageBatchPlanKind[];
  text?: string;
  mediaUrls: readonly string[];
  audioAsVoice?: boolean;
  presentationBlockCount?: number;
  hasInteractive?: boolean;
  hasChannelData?: boolean;
};

/** Aggregate shape of a rendered outbound batch before channel send. */
export type RenderedMessageBatchPlan = {
  payloadCount: number;
  textCount: number;
  mediaCount: number;
  voiceCount: number;
  presentationCount: number;
  interactiveCount: number;
  channelDataCount: number;
  items: readonly RenderedMessageBatchPlanItem[];
};

/** Rendered payloads plus a stable plan for send and reconciliation decisions. */
export type RenderedMessageBatch<TPayload = unknown> = {
  payloads: TPayload[];
  plan: RenderedMessageBatchPlan;
};

/** Lifecycle phase for live preview/final message state. */
export type LiveMessagePhase = "idle" | "previewing" | "finalizing" | "finalized" | "cancelled";

/** Current live-preview state carried between render, edit, send, and finalization. */
export type LiveMessageState<TPayload = unknown> = {
  phase: LiveMessagePhase;
  canFinalizeInPlace: boolean;
  receipt?: MessageReceipt;
  lastRendered?: RenderedMessageBatch<TPayload>;
};

/** Durable send transaction callbacks and state passed to channel send runners. */
export type MessageSendContext<TPayload = unknown, TSendResult = unknown> = {
  id: string;
  channel: string;
  to: string;
  accountId?: string;
  durability: Exclude<MessageDurabilityPolicy, "disabled">;
  attempt: number;
  signal: AbortSignal;
  intent?: DurableMessageSendIntent;
  previousReceipt?: MessageReceipt;
  preview?: LiveMessageState<TPayload>;
  render(): Promise<RenderedMessageBatch<TPayload>>;
  previewUpdate(rendered: RenderedMessageBatch<TPayload>): Promise<LiveMessageState<TPayload>>;
  send(rendered: RenderedMessageBatch<TPayload>): Promise<TSendResult>;
  edit(receipt: MessageReceipt, rendered: RenderedMessageBatch<TPayload>): Promise<MessageReceipt>;
  delete(receipt: MessageReceipt): Promise<void>;
  commit(receipt: MessageReceipt): Promise<void>;
  fail(error: unknown): Promise<void>;
};

/** Text send context exposed to channel message adapters. */
export type ChannelMessageSendTextContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  to: string;
  text: string;
  accountId?: string | null;
  deps?: OutboundSendDeps;
  replyToId?: string | null;
  replyToIdSource?: "explicit" | "implicit";
  replyToMode?: ReplyToMode;
  threadId?: string | number | null;
  silent?: boolean;
  signal?: AbortSignal;
  gatewayClientScopes?: readonly string[];
};

/** Media send context exposed to channel message adapters. */
export type ChannelMessageSendMediaContext<TConfig = OpenClawConfig> =
  ChannelMessageSendTextContext<TConfig> & {
    mediaUrl: string;
    mediaAccess?: OutboundMediaAccess;
    mediaLocalRoots?: readonly string[];
    mediaReadFile?: (filePath: string) => Promise<Buffer>;
    audioAsVoice?: boolean;
    gifPlayback?: boolean;
    forceDocument?: boolean;
  };

/** Structured reply-payload send context exposed to channel message adapters. */
export type ChannelMessageSendPayloadContext<TConfig = OpenClawConfig> =
  ChannelMessageSendTextContext<TConfig> & {
    payload: ReplyPayload;
    mediaUrl?: string;
    mediaAccess?: OutboundMediaAccess;
    mediaLocalRoots?: readonly string[];
    mediaReadFile?: (filePath: string) => Promise<Buffer>;
    audioAsVoice?: boolean;
    gifPlayback?: boolean;
    forceDocument?: boolean;
  };

/** Poll send context exposed to channel message adapters. */
export type ChannelMessageSendPollContext<TConfig = OpenClawConfig> = Omit<
  ChannelMessageSendTextContext<TConfig>,
  "text" | "threadId"
> & {
  poll: PollInput;
  threadId?: string | null;
  isAnonymous?: boolean;
};

/** Canonical result returned by channel message send adapters. */
export type ChannelMessageSendResult = {
  receipt: MessageReceipt;
  messageId?: string;
};

/** Discriminator for outbound channel message send attempts. */
export type ChannelMessageSendAttemptKind = "text" | "media" | "payload" | "poll";

/** Union of all send attempt contexts delivered to lifecycle hooks. */
export type ChannelMessageSendAttemptContext<TConfig = OpenClawConfig> =
  | (ChannelMessageSendTextContext<TConfig> & { kind: "text" })
  | (ChannelMessageSendMediaContext<TConfig> & { kind: "media" })
  | (ChannelMessageSendPayloadContext<TConfig> & { kind: "payload" })
  | (ChannelMessageSendPollContext<TConfig> & { kind: "poll" });

/** Lifecycle hook context for a successful platform send attempt. */
export type ChannelMessageSendSuccessContext<
  TConfig = OpenClawConfig,
  TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult,
> = ChannelMessageSendAttemptContext<TConfig> & {
  result: TSendResult;
  attemptToken?: unknown;
};

/** Lifecycle hook context for a failed platform send attempt. */
export type ChannelMessageSendFailureContext<TConfig = OpenClawConfig> =
  ChannelMessageSendAttemptContext<TConfig> & {
    error: unknown;
    attemptToken?: unknown;
  };

/** Lifecycle hook context after a successful durable send is committed. */
export type ChannelMessageSendCommitContext<
  TConfig = OpenClawConfig,
  TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult,
> = ChannelMessageSendSuccessContext<TConfig, TSendResult>;

/** Reconciliation context for sends whose platform outcome is unknown. */
export type ChannelMessageUnknownSendContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  queueId: string;
  channel: string;
  to: string;
  accountId?: string | null;
  enqueuedAt: number;
  retryCount: number;
  platformSendStartedAt?: number;
  payloads: readonly ReplyPayload[];
  renderedBatchPlan?: RenderedMessageBatchPlan;
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  threadId?: string | number | null;
  silent?: boolean;
};

/** Result of asking a channel whether an unknown send reached the platform. */
export type ChannelMessageUnknownSendReconciliationResult =
  | {
      status: "sent";
      receipt: MessageReceipt;
      messageId?: string;
    }
  | {
      status: "not_sent";
    }
  | {
      status: "unresolved";
      error?: string;
      retryable?: boolean;
    };

/** Optional lifecycle hooks around channel message send attempts and commits. */
export type ChannelMessageSendLifecycleAdapter<
  TConfig = OpenClawConfig,
  TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult,
> = {
  beforeSendAttempt?: (ctx: ChannelMessageSendAttemptContext<TConfig>) => unknown;
  afterSendSuccess?: (
    ctx: ChannelMessageSendSuccessContext<TConfig, TSendResult>,
  ) => Promise<void> | void;
  afterSendFailure?: (ctx: ChannelMessageSendFailureContext<TConfig>) => Promise<void> | void;
  afterCommit?: (
    ctx: ChannelMessageSendCommitContext<TConfig, TSendResult>,
  ) => Promise<void> | void;
};

/** Channel outbound message adapter grouped by supported payload kind. */
export type ChannelMessageSendAdapter<
  TConfig = OpenClawConfig,
  TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult,
> = {
  text?: (ctx: ChannelMessageSendTextContext<TConfig>) => Promise<TSendResult>;
  media?: (ctx: ChannelMessageSendMediaContext<TConfig>) => Promise<TSendResult>;
  payload?: (ctx: ChannelMessageSendPayloadContext<TConfig>) => Promise<TSendResult>;
  poll?: (ctx: ChannelMessageSendPollContext<TConfig>) => Promise<TSendResult>;
  lifecycle?: ChannelMessageSendLifecycleAdapter<TConfig, TSendResult>;
};

/** Channel durable-final delivery capabilities and reconciliation hook. */
export type ChannelMessageDurableFinalAdapter = {
  capabilities?: DurableFinalDeliveryRequirementMap;
  reconcileUnknownSend?: (
    ctx: ChannelMessageUnknownSendContext,
  ) =>
    | Promise<ChannelMessageUnknownSendReconciliationResult | null>
    | ChannelMessageUnknownSendReconciliationResult
    | null;
};

/** Live-preview behavior a channel can support while generating a final answer. */
export type ChannelMessageLiveCapability =
  | "draftPreview"
  | "previewFinalization"
  | "progressUpdates"
  | "nativeStreaming"
  | "quietFinalization";

/** Ordered list of live-preview capability tokens accepted by channel adapters. */
export const channelMessageLiveCapabilities = [
  "draftPreview",
  "previewFinalization",
  "progressUpdates",
  "nativeStreaming",
  "quietFinalization",
] as const satisfies readonly ChannelMessageLiveCapability[];

/** Ordered list of live-preview finalizer capability tokens. */
export const livePreviewFinalizerCapabilities = [
  "finalEdit",
  "normalFallback",
  "discardPending",
  "previewReceipt",
  "retainOnAmbiguousFailure",
] as const;

/** Capability token for how a live preview may be finalized. */
export type LivePreviewFinalizerCapability = (typeof livePreviewFinalizerCapabilities)[number];

/** Per-capability map for live-preview finalization behavior. */
export type LivePreviewFinalizerCapabilityMap = Partial<
  Record<LivePreviewFinalizerCapability, boolean>
>;

/** Channel live-preview finalizer declaration. */
export type ChannelMessageLiveFinalizerAdapterShape = {
  capabilities?: LivePreviewFinalizerCapabilityMap;
};

/** Channel live-preview adapter declaration. */
export type ChannelMessageLiveAdapterShape = {
  capabilities?: Partial<Record<ChannelMessageLiveCapability, boolean>>;
  finalizer?: ChannelMessageLiveFinalizerAdapterShape;
};

/** Policy for when inbound channel messages are acknowledged. */
export type ChannelMessageReceiveAckPolicy =
  | "after_receive_record"
  | "after_agent_dispatch"
  | "after_durable_send"
  | "manual";

/** Ordered list of supported inbound receive acknowledgement policies. */
export const channelMessageReceiveAckPolicies = [
  "after_receive_record",
  "after_agent_dispatch",
  "after_durable_send",
  "manual",
] as const satisfies readonly ChannelMessageReceiveAckPolicy[];

/** Channel inbound receive acknowledgement declaration. */
export type ChannelMessageReceiveAdapterShape = {
  defaultAckPolicy?: ChannelMessageReceiveAckPolicy;
  supportedAckPolicies?: readonly ChannelMessageReceiveAckPolicy[];
};

/** Complete internal channel message adapter declaration. */
export type ChannelMessageAdapterShape<
  TConfig = OpenClawConfig,
  TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult,
> = {
  id?: string;
  durableFinal?: ChannelMessageDurableFinalAdapter;
  send?: ChannelMessageSendAdapter<TConfig, TSendResult>;
  live?: ChannelMessageLiveAdapterShape;
  receive?: ChannelMessageReceiveAdapterShape;
};

/** Concrete internal channel message adapter type. */
export type ChannelMessageAdapter<
  TAdapter extends ChannelMessageAdapterShape = ChannelMessageAdapterShape,
> = TAdapter;

/** Extra durable-final requirements supplied by a caller or channel. */
export type DurableFinalRequirementExtras = DurableFinalDeliveryRequirementMap;

/** Inputs used to derive the minimum durable-final capabilities for a payload. */
export type DeriveDurableFinalDeliveryRequirementsParams = {
  payload: DurableFinalDeliveryPayloadShape;
  replyToId?: string | null;
  threadId?: string | number | null;
  silent?: boolean;
  messageSendingHooks?: boolean;
  payloadTransport?: boolean;
  batch?: boolean;
  reconcileUnknownSend?: boolean;
  afterSendSuccess?: boolean;
  afterCommit?: boolean;
  extraCapabilities?: DurableFinalRequirementExtras;
};

/** Durable outbound send intent carried through queueing and delivery. */
export type DurableMessageSendIntent<TPayload = unknown> = {
  id: string;
  channel: string;
  to: string;
  accountId?: string;
  durability: Exclude<MessageDurabilityPolicy, "disabled">;
  renderedBatch?: RenderedMessageBatch<TPayload>;
};
