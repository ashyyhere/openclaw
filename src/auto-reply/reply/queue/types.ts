// Shared queue types.
import type { AutoFallbackPrimaryProbe } from "../../../agents/agent-scope.js";
import type { ExecToolDefaults } from "../../../agents/bash-tools.js";
import type { CurrentInboundPromptContext } from "../../../agents/embedded-agent-runner/run/params.js";
import type { SilentReplyPromptMode } from "../../../agents/system-prompt.types.js";
import type { InboundEventKind } from "../../../channels/inbound-event/kind.js";
import type { SessionEntry } from "../../../config/sessions.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { PromptImageOrderEntry } from "../../../media/prompt-image-order.js";
import type { InputProvenance } from "../../../sessions/input-provenance.js";
import type { UserTurnTranscriptRecorder } from "../../../sessions/user-turn-transcript.js";
import type { SkillSnapshot } from "../../../skills/types.js";
import type {
  QueuedReplyDeliveryCorrelation,
  QueuedReplyLifecycle,
  SourceReplyDeliveryMode,
} from "../../get-reply-options.types.js";
import type { OriginatingChannelType } from "../../templating.js";
import type { ElevatedLevel, ReasoningLevel, ThinkLevel, VerboseLevel } from "../directives.js";

/** Queue behavior selected by inline directives or channel policy. */
export type QueueMode = "steer" | "followup" | "collect" | "interrupt";

/** Overflow policy applied when queued followups exceed their cap. */
export type QueueDropPolicy = "old" | "new" | "summarize";

/** Resolved queue settings for one inbound reply path. */
export type QueueSettings = {
  mode: QueueMode;
  debounceMs?: number;
  cap?: number;
  dropPolicy?: QueueDropPolicy;
};

/** Dedupe key strategy for queued inbound messages. */
export type QueueDedupeMode = "message-id" | "prompt" | "none";

/** Control-flow error thrown when a followup turn is intentionally deferred. */
export class FollowupRunDeferredError extends Error {
  constructor(message = "Follow-up run deferred") {
    super(message);
    this.name = "FollowupRunDeferredError";
  }
}

/** Narrows errors raised by intentional followup deferral. */
export function isFollowupRunDeferredError(error: unknown): error is FollowupRunDeferredError {
  return error instanceof FollowupRunDeferredError;
}

/** Queued followup turn plus routing, transcript, model, and execution context. */
export type FollowupRun = {
  prompt: string;
  /** User-visible prompt body persisted to transcript; excludes runtime-only prompt context. */
  transcriptPrompt?: string;
  /** Shared lifecycle owner for the current user-turn transcript append. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
  currentInboundEventKind?: InboundEventKind;
  /** Explicit current-turn context that should be visible for this run but not persisted as user text. */
  currentInboundContext?: CurrentInboundPromptContext;
  /** Abort signal for turns that are canceled by their source-channel admission fence. */
  abortSignal?: AbortSignal;
  deliveryCorrelations?: QueuedReplyDeliveryCorrelation[];
  queuedLifecycle?: QueuedReplyLifecycle;
  /** Provider message ID, when available (for deduplication). */
  messageId?: string;
  summaryLine?: string;
  enqueuedAt: number;
  images?: Array<{ type: "image"; data: string; mimeType: string }>;
  imageOrder?: PromptImageOrderEntry[];
  /**
   * Originating channel for reply routing.
   * When set, replies should be routed back to this provider
   * instead of using the session's lastChannel.
   */
  originatingChannel?: OriginatingChannelType;
  /**
   * Originating destination for reply routing.
   * The chat/channel/user ID where the reply should be sent.
   */
  originatingTo?: string;
  /** Provider account id (multi-account). */
  originatingAccountId?: string;
  /** Thread id for reply routing (Telegram topic id or Matrix thread event id). */
  originatingThreadId?: string | number;
  /** Provider reply target for transports that model threads as message replies. */
  originatingReplyToId?: string;
  /** Chat type for context-aware threading (e.g., DM vs channel). */
  originatingChatType?: string;
  run: {
    agentId: string;
    agentDir: string;
    sessionId: string;
    sessionKey?: string;
    runtimePolicySessionKey?: string;
    messageProvider?: string;
    agentAccountId?: string;
    groupId?: string;
    groupChannel?: string;
    groupSpace?: string;
    senderId?: string;
    senderName?: string;
    senderUsername?: string;
    senderE164?: string;
    senderIsOwner?: boolean;
    traceAuthorized?: boolean;
    sessionFile: string;
    workspaceDir: string;
    /** Task working directory for runtime execution. Defaults to workspaceDir. */
    cwd?: string;
    config: OpenClawConfig;
    skillsSnapshot?: SkillSnapshot;
    provider: string;
    model: string;
    hasSessionModelOverride?: boolean;
    modelOverrideSource?: "auto" | "user";
    hasAutoFallbackProvenance?: boolean;
    autoFallbackPrimaryProbe?: AutoFallbackPrimaryProbe;
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
    thinkLevel?: ThinkLevel;
    verboseLevel?: VerboseLevel;
    reasoningLevel?: ReasoningLevel;
    elevatedLevel?: ElevatedLevel;
    execOverrides?: Pick<ExecToolDefaults, "host" | "security" | "ask" | "node">;
    bashElevated?: {
      enabled: boolean;
      allowed: boolean;
      defaultLevel: ElevatedLevel;
    };
    timeoutMs: number;
    blockReplyBreak: "text_end" | "message_end";
    ownerNumbers?: string[];
    inputProvenance?: InputProvenance;
    extraSystemPrompt?: string;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    silentReplyPromptMode?: SilentReplyPromptMode;
    extraSystemPromptStatic?: string;
    enforceFinalTag?: boolean;
    skipProviderRuntimeHints?: boolean;
    silentExpected?: boolean;
    allowEmptyAssistantReplyAsSilent?: boolean;
    suppressNextUserMessagePersistence?: boolean;
    suppressTranscriptOnlyAssistantPersistence?: boolean;
  };
};

/** Checks whether the source-channel admission fence canceled this followup. */
export function isFollowupRunAborted(run: Pick<FollowupRun, "abortSignal">): boolean {
  return run.abortSignal?.aborted === true;
}

const enqueuedFollowupLifecycles = new WeakSet<QueuedReplyLifecycle>();
const completedFollowupLifecycles = new WeakSet<QueuedReplyLifecycle>();

/** Fires a followup lifecycle enqueue callback at most once. */
export function markFollowupRunEnqueued(run: Pick<FollowupRun, "queuedLifecycle">): void {
  const lifecycle = run.queuedLifecycle;
  if (!lifecycle || enqueuedFollowupLifecycles.has(lifecycle)) {
    return;
  }
  enqueuedFollowupLifecycles.add(lifecycle);
  lifecycle.onEnqueued?.();
}

/** Fires a followup lifecycle completion callback at most once. */
export function completeFollowupRunLifecycle(run: Pick<FollowupRun, "queuedLifecycle">): void {
  const lifecycle = run.queuedLifecycle;
  if (!lifecycle || completedFollowupLifecycles.has(lifecycle)) {
    return;
  }
  completedFollowupLifecycles.add(lifecycle);
  lifecycle.onComplete?.();
}

/** Inputs used to resolve effective queue settings for an inbound source. */
export type ResolveQueueSettingsParams = {
  cfg: OpenClawConfig;
  channel?: string;
  sessionEntry?: SessionEntry;
  inlineMode?: QueueMode;
  inlineOptions?: Partial<QueueSettings>;
  pluginDebounceMs?: number;
};
