/** Public type contract for prepared agent runtime plans. */
import type { TSchema } from "typebox";
import type { AgentTool } from "../runtime/index.js";

/** Transport preference for agent runtime communication. */
export type AgentRuntimeTransport = "sse" | "websocket" | "auto";

/** Reasoning effort level accepted by agent runtime planning. */
export type AgentRuntimeThinkLevel =
  | "off"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "adaptive"
  | "max";

/** Amount of system prompt context injected into an agent runtime turn. */
export type AgentRuntimePromptMode = "full" | "minimal" | "none";
/** Source that triggered prompt construction for an agent turn. */
export type AgentRuntimePromptTrigger =
  | "cron"
  | "heartbeat"
  | "manual"
  | "memory"
  | "overflow"
  | "user";

/** Normalized reason a provider/model result may need failover handling. */
export type AgentRuntimeFailoverReason =
  | "auth"
  | "auth_permanent"
  | "format"
  | "rate_limit"
  | "overloaded"
  | "billing"
  | "server_error"
  | "timeout"
  | "model_not_found"
  | "session_expired"
  | "empty_response"
  | "no_error_details"
  | "unclassified"
  | "unknown";

/** Opaque config payload passed through runtime planning seams. */
export type AgentRuntimeConfig = unknown;

/** Provider model metadata consumed by runtime planning and compat decisions. */
export type AgentRuntimeModel = {
  id?: string;
  name?: string;
  api?: string;
  provider?: string;
  baseUrl?: string;
  reasoning?: boolean;
  input?: readonly string[];
  cost?: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
  contextWindow?: number;
  maxTokens?: number;
  contextTokens?: number;
  compat?: unknown;
};

/** Search/replace transform applied to runtime prompt or output text. */
export type AgentRuntimeTextReplacement = {
  from: string | RegExp;
  to: string;
};

/** Input/output text transforms attached to a runtime prompt plan. */
export type AgentRuntimeTextTransforms = {
  input?: AgentRuntimeTextReplacement[];
  output?: AgentRuntimeTextReplacement[];
};

/** Provider runtime handle carried to planning code that needs provider context. */
export type AgentRuntimeProviderHandle = {
  provider: string;
  config?: AgentRuntimeConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  applyAutoEnable?: boolean;
  bundledProviderVitestCompat?: boolean;
};

/** Visual style hint for portable interactive message buttons. */
export type AgentRuntimeInteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";

/** Portable action control exposed to agent runtime reply payloads. */
export type AgentRuntimeMessagePresentationButton = {
  /** User-visible button label. */
  label: string;
  /** Callback command or opaque value sent when pressed. */
  value?: string;
  /** External URL opened by the button. */
  url?: string;
  /** Channel-native web app URL for renderers that support embedded web apps. */
  webApp?: { url: string };
  /** Higher values are kept first when channel action limits require dropping controls. */
  priority?: number;
  /** Disabled action hint; channels without disabled-state support render fallback text. */
  disabled?: boolean;
  /** Optional visual style hint for renderers that support styled actions. */
  style?: AgentRuntimeInteractiveButtonStyle;
};

/** Portable select/menu option exposed to agent runtime reply payloads. */
export type AgentRuntimeMessagePresentationOption = {
  /** User-visible option label. */
  label: string;
  /** Callback command or opaque value sent when selected. */
  value: string;
};

/**
 * @deprecated Use AgentRuntimeMessagePresentationButton.
 */
export type AgentRuntimeInteractiveReplyButton = AgentRuntimeMessagePresentationButton;

/**
 * @deprecated Use AgentRuntimeMessagePresentationOption.
 */
export type AgentRuntimeInteractiveReplyOption = AgentRuntimeMessagePresentationOption;

/**
 * @deprecated Use AgentRuntimeMessagePresentationBlock.
 */
export type AgentRuntimeInteractiveReplyBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "buttons";
      buttons: AgentRuntimeInteractiveReplyButton[];
    }
  | {
      type: "select";
      placeholder?: string;
      options: AgentRuntimeInteractiveReplyOption[];
    };

/**
 * @deprecated Use AgentRuntimeMessagePresentation.
 */
export type AgentRuntimeInteractiveReply = {
  blocks: AgentRuntimeInteractiveReplyBlock[];
};

/** Severity/status tone for portable message presentation blocks. */
export type AgentRuntimeMessagePresentationTone =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

/** Portable presentation block rendered or downgraded by channel adapters. */
export type AgentRuntimeMessagePresentationBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "context";
      text: string;
    }
  | {
      type: "divider";
    }
  | {
      type: "buttons";
      buttons: AgentRuntimeMessagePresentationButton[];
    }
  | {
      type: "select";
      placeholder?: string;
      options: AgentRuntimeMessagePresentationOption[];
    };

/** Portable structured message presentation emitted by agent runtimes. */
export type AgentRuntimeMessagePresentation = {
  /** Optional short heading rendered before blocks when supported. */
  title?: string;
  /** Optional severity/status tone for renderers that support toned presentations. */
  tone?: AgentRuntimeMessagePresentationTone;
  /** Ordered portable blocks rendered or downgraded by channel adapters. */
  blocks: AgentRuntimeMessagePresentationBlock[];
};

/** Pinning options for reply payload delivery on channels that support pins. */
export type AgentRuntimeReplyPayloadDeliveryPin = {
  enabled: boolean;
  notify?: boolean;
  required?: boolean;
};

/** Delivery controls attached to an agent runtime reply payload. */
export type AgentRuntimeReplyPayloadDelivery = {
  pin?: boolean | AgentRuntimeReplyPayloadDeliveryPin;
};

/** Agent runtime reply payload before channel-specific rendering. */
export type AgentRuntimeReplyPayload = {
  text?: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  trustedLocalMedia?: boolean;
  sensitiveMedia?: boolean;
  presentation?: AgentRuntimeMessagePresentation;
  delivery?: AgentRuntimeReplyPayloadDelivery;
  /**
   * @deprecated Use presentation.
   */
  interactive?: AgentRuntimeInteractiveReply;
  btw?: {
    question: string;
  };
  replyToId?: string;
  replyToTag?: boolean;
  replyToCurrent?: boolean;
  audioAsVoice?: boolean;
  spokenText?: string;
  ttsSupplement?: {
    spokenText: string;
    visibleTextAlreadyDelivered?: boolean;
  };
  isError?: boolean;
  isReasoning?: boolean;
  isReasoningSnapshot?: boolean;
  isCompactionNotice?: boolean;
  isFallbackNotice?: boolean;
  isStatusNotice?: boolean;
  channelData?: Record<string, unknown>;
};

/** System-prompt section id that runtime plans may override. */
export type AgentRuntimeSystemPromptSectionId =
  | "interaction_style"
  | "tool_call_style"
  | "execution_bias";

/** Stable and dynamic system-prompt additions supplied by a runtime plan. */
export type AgentRuntimeSystemPromptContribution = {
  stablePrefix?: string;
  dynamicSuffix?: string;
  sectionOverrides?: Partial<Record<AgentRuntimeSystemPromptSectionId, string>>;
};

/** Context used to resolve provider/model-specific system prompt contributions. */
export type AgentRuntimeSystemPromptContributionContext = {
  config?: AgentRuntimeConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  promptMode: AgentRuntimePromptMode;
  runtimeChannel?: string;
  runtimeCapabilities?: string[];
  agentId?: string;
  trigger?: AgentRuntimePromptTrigger;
};

/** Follow-up routing decision when origin delivery is unavailable or unsuitable. */
export type AgentRuntimeFollowupFallbackRouteResult = {
  route?: "origin" | "dispatcher" | "drop";
  reason?: string;
};

/** Tool-call id sanitization mode required by a runtime transcript policy. */
export type AgentRuntimeToolCallIdMode = "strict" | "strict9";

/** Provider transcript normalization and validation policy for runtime history. */
export type AgentRuntimeTranscriptPolicy = {
  sanitizeMode: "full" | "images-only";
  sanitizeToolCallIds: boolean;
  toolCallIdMode?: AgentRuntimeToolCallIdMode;
  preserveNativeAnthropicToolUseIds: boolean;
  repairToolUseResultPairing: boolean;
  preserveSignatures: boolean;
  sanitizeThoughtSignatures?: {
    allowBase64Only?: boolean;
    includeCamelCase?: boolean;
  };
  sanitizeThinkingSignatures: boolean;
  dropThinkingBlocks: boolean;
  dropReasoningFromHistory?: boolean;
  applyGoogleTurnOrdering: boolean;
  validateGeminiTurns: boolean;
  validateAnthropicTurns: boolean;
  allowSyntheticToolResults: boolean;
};

/** Normalized run-result classification returned by runtime outcome handlers. */
export type AgentRuntimeOutcomeClassification =
  | {
      message: string;
      reason?: AgentRuntimeFailoverReason;
      status?: number;
      code?: string;
      rawError?: string;
    }
  | {
      error: unknown;
    }
  | null
  | undefined;

/** Classifier that maps provider/model run results to failover-aware outcomes. */
export type AgentRuntimeOutcomeClassifier = (params: {
  provider: string;
  model: string;
  result: unknown;
  hasDirectlySentBlockReply?: boolean;
  hasBlockReplyPipelineOutput?: boolean;
}) => AgentRuntimeOutcomeClassification;

/** Fully resolved provider/model/harness/transport reference for a runtime turn. */
export type AgentRuntimeResolvedRef = {
  provider: string;
  modelId: string;
  modelApi?: string;
  harnessId?: string;
  transport?: AgentRuntimeTransport;
};

/** Auth providers and forwarded profile ids selected for a runtime turn. */
export type AgentRuntimeAuthPlan = {
  providerForAuth: string;
  authProfileProviderForAuth: string;
  harnessAuthProvider?: string;
  forwardedAuthProfileId?: string;
  forwardedAuthProfileCandidateIds?: string[];
};

/** Prompt contribution and transform functions selected for a runtime turn. */
export type AgentRuntimePromptPlan = {
  provider: string;
  modelId: string;
  textTransforms?: AgentRuntimeTextTransforms;
  resolveSystemPromptContribution(
    context: AgentRuntimeSystemPromptContributionContext,
  ): AgentRuntimeSystemPromptContribution | undefined;
  transformSystemPrompt(
    context: AgentRuntimeSystemPromptContributionContext & {
      systemPrompt: string;
    },
  ): string;
};

// Keep the leaf runtime-plan contract decoupled from plugin metadata internals.
/** Opaque plugin metadata snapshot prepared before hot-path tool planning. */
export type AgentRuntimePreparedMetadataSnapshot = object;

/** Prepared tool-planning metadata that avoids rediscovery during a turn. */
export type PreparedOpenClawToolPlanning = {
  metadataSnapshot?: AgentRuntimePreparedMetadataSnapshot;
  loadMetadataSnapshot?: () => AgentRuntimePreparedMetadataSnapshot;
};

/** Tool normalization and diagnostics behavior selected for a runtime turn. */
export type AgentRuntimeToolPlan = {
  preparedPlanning?: PreparedOpenClawToolPlanning;
  normalize<TSchemaType extends TSchema = TSchema, TResult = unknown>(
    tools: AgentTool<TSchemaType, TResult>[],
    params?: {
      workspaceDir?: string;
      modelApi?: string;
      model?: AgentRuntimeModel;
    },
  ): AgentTool<TSchemaType, TResult>[];
  logDiagnostics(
    tools: AgentTool[],
    params?: {
      workspaceDir?: string;
      modelApi?: string;
      model?: AgentRuntimeModel;
    },
  ): void;
};

/** Delivery helpers selected for reply payload routing and silence checks. */
export type AgentRuntimeDeliveryPlan = {
  isSilentPayload(
    payload: Pick<
      AgentRuntimeReplyPayload,
      "text" | "mediaUrl" | "mediaUrls" | "presentation" | "interactive" | "channelData"
    >,
  ): boolean;
  resolveFollowupRoute(params: {
    payload: AgentRuntimeReplyPayload;
    originatingChannel?: string;
    originatingTo?: string;
    originRoutable: boolean;
    dispatcherAvailable: boolean;
  }): AgentRuntimeFollowupFallbackRouteResult | undefined;
};

/** Outcome classification behavior selected for a runtime turn. */
export type AgentRuntimeOutcomePlan = {
  classifyRunResult: AgentRuntimeOutcomeClassifier;
};

/** Transport extra-parameter resolver selected for a runtime turn. */
export type AgentRuntimeTransportPlan = {
  extraParams: Record<string, unknown>;
  resolveExtraParams(params?: {
    extraParamsOverride?: Record<string, unknown>;
    thinkingLevel?: AgentRuntimeThinkLevel;
    agentId?: string;
    workspaceDir?: string;
    model?: AgentRuntimeModel;
    resolvedTransport?: AgentRuntimeTransport;
  }): Record<string, unknown>;
};

/** Prepared runtime plan carrying all provider/model/auth/prompt/tool policies for a turn. */
export type AgentRuntimePlan = {
  resolvedRef: AgentRuntimeResolvedRef;
  providerRuntimeHandle?: AgentRuntimeProviderHandle;
  auth: AgentRuntimeAuthPlan;
  prompt: AgentRuntimePromptPlan;
  tools: AgentRuntimeToolPlan;
  transcript: {
    policy: AgentRuntimeTranscriptPolicy;
    resolvePolicy(params?: {
      workspaceDir?: string;
      modelApi?: string;
      model?: AgentRuntimeModel;
    }): AgentRuntimeTranscriptPolicy;
  };
  delivery: AgentRuntimeDeliveryPlan;
  outcome: AgentRuntimeOutcomePlan;
  transport: AgentRuntimeTransportPlan;
  observability: {
    resolvedRef: string;
    provider: string;
    modelId: string;
    modelApi?: string;
    harnessId?: string;
    authProfileId?: string;
    transport?: AgentRuntimeTransport;
  };
};

/** Inputs needed to build delivery helpers for an agent runtime plan. */
export type BuildAgentRuntimeDeliveryPlanParams = {
  config?: AgentRuntimeConfig;
  workspaceDir?: string;
  agentDir?: string;
  provider: string;
  modelId: string;
  providerRuntimeHandle?: AgentRuntimeProviderHandle;
};

/** Inputs needed to build a complete agent runtime plan. */
export type BuildAgentRuntimePlanParams = {
  config?: AgentRuntimeConfig;
  workspaceDir?: string;
  agentDir?: string;
  provider: string;
  modelId: string;
  model?: AgentRuntimeModel;
  modelApi?: string | null;
  harnessId?: string;
  harnessRuntime?: string;
  allowHarnessAuthProfileForwarding?: boolean;
  authProfileProvider?: string;
  authProfileMode?: string;
  sessionAuthProfileId?: string;
  sessionAuthProfileCandidateIds?: string[];
  agentId?: string;
  thinkingLevel?: AgentRuntimeThinkLevel;
  extraParamsOverride?: Record<string, unknown>;
  resolvedTransport?: AgentRuntimeTransport;
  providerRuntimeHandle?: AgentRuntimeProviderHandle;
};
