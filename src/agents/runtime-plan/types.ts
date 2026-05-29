/** Public type contract for prepared agent runtime plans. */
import type { TSchema } from "typebox";
import type { AgentTool } from "../runtime/index.js";

/** Shared type for Agent Runtime Transport in src/agents/runtime-plan. */
export type AgentRuntimeTransport = "sse" | "websocket" | "auto";

/** Shared type for Agent Runtime Think Level in src/agents/runtime-plan. */
export type AgentRuntimeThinkLevel =
  | "off"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "adaptive"
  | "max";

/** Shared type for Agent Runtime Prompt Mode in src/agents/runtime-plan. */
export type AgentRuntimePromptMode = "full" | "minimal" | "none";
/** Shared type for Agent Runtime Prompt Trigger in src/agents/runtime-plan. */
export type AgentRuntimePromptTrigger =
  | "cron"
  | "heartbeat"
  | "manual"
  | "memory"
  | "overflow"
  | "user";

/** Shared type for Agent Runtime Failover Reason in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Config in src/agents/runtime-plan. */
export type AgentRuntimeConfig = unknown;

/** Shared type for Agent Runtime Model in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Text Replacement in src/agents/runtime-plan. */
export type AgentRuntimeTextReplacement = {
  from: string | RegExp;
  to: string;
};

/** Shared type for Agent Runtime Text Transforms in src/agents/runtime-plan. */
export type AgentRuntimeTextTransforms = {
  input?: AgentRuntimeTextReplacement[];
  output?: AgentRuntimeTextReplacement[];
};

/** Shared type for Agent Runtime Provider Handle in src/agents/runtime-plan. */
export type AgentRuntimeProviderHandle = {
  provider: string;
  config?: AgentRuntimeConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  applyAutoEnable?: boolean;
  bundledProviderVitestCompat?: boolean;
};

/** Shared type for Agent Runtime Interactive Button Style in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Message Presentation Tone in src/agents/runtime-plan. */
export type AgentRuntimeMessagePresentationTone =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

/** Shared type for Agent Runtime Message Presentation Block in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Message Presentation in src/agents/runtime-plan. */
export type AgentRuntimeMessagePresentation = {
  /** Optional short heading rendered before blocks when supported. */
  title?: string;
  /** Optional severity/status tone for renderers that support toned presentations. */
  tone?: AgentRuntimeMessagePresentationTone;
  /** Ordered portable blocks rendered or downgraded by channel adapters. */
  blocks: AgentRuntimeMessagePresentationBlock[];
};

/** Shared type for Agent Runtime Reply Payload Delivery Pin in src/agents/runtime-plan. */
export type AgentRuntimeReplyPayloadDeliveryPin = {
  enabled: boolean;
  notify?: boolean;
  required?: boolean;
};

/** Shared type for Agent Runtime Reply Payload Delivery in src/agents/runtime-plan. */
export type AgentRuntimeReplyPayloadDelivery = {
  pin?: boolean | AgentRuntimeReplyPayloadDeliveryPin;
};

/** Shared type for Agent Runtime Reply Payload in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime System Prompt Section Id in src/agents/runtime-plan. */
export type AgentRuntimeSystemPromptSectionId =
  | "interaction_style"
  | "tool_call_style"
  | "execution_bias";

/** Shared type for Agent Runtime System Prompt Contribution in src/agents/runtime-plan. */
export type AgentRuntimeSystemPromptContribution = {
  stablePrefix?: string;
  dynamicSuffix?: string;
  sectionOverrides?: Partial<Record<AgentRuntimeSystemPromptSectionId, string>>;
};

/** Shared type for Agent Runtime System Prompt Contribution Context in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Followup Fallback Route Result in src/agents/runtime-plan. */
export type AgentRuntimeFollowupFallbackRouteResult = {
  route?: "origin" | "dispatcher" | "drop";
  reason?: string;
};

/** Shared type for Agent Runtime Tool Call Id Mode in src/agents/runtime-plan. */
export type AgentRuntimeToolCallIdMode = "strict" | "strict9";

/** Shared type for Agent Runtime Transcript Policy in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Outcome Classification in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Outcome Classifier in src/agents/runtime-plan. */
export type AgentRuntimeOutcomeClassifier = (params: {
  provider: string;
  model: string;
  result: unknown;
  hasDirectlySentBlockReply?: boolean;
  hasBlockReplyPipelineOutput?: boolean;
}) => AgentRuntimeOutcomeClassification;

/** Shared type for Agent Runtime Resolved Ref in src/agents/runtime-plan. */
export type AgentRuntimeResolvedRef = {
  provider: string;
  modelId: string;
  modelApi?: string;
  harnessId?: string;
  transport?: AgentRuntimeTransport;
};

/** Shared type for Agent Runtime Auth Plan in src/agents/runtime-plan. */
export type AgentRuntimeAuthPlan = {
  providerForAuth: string;
  authProfileProviderForAuth: string;
  harnessAuthProvider?: string;
  forwardedAuthProfileId?: string;
  forwardedAuthProfileCandidateIds?: string[];
};

/** Shared type for Agent Runtime Prompt Plan in src/agents/runtime-plan. */
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
/** Shared type for Agent Runtime Prepared Metadata Snapshot in src/agents/runtime-plan. */
export type AgentRuntimePreparedMetadataSnapshot = object;

/** Shared type for Prepared Open Claw Tool Planning in src/agents/runtime-plan. */
export type PreparedOpenClawToolPlanning = {
  metadataSnapshot?: AgentRuntimePreparedMetadataSnapshot;
  loadMetadataSnapshot?: () => AgentRuntimePreparedMetadataSnapshot;
};

/** Shared type for Agent Runtime Tool Plan in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Delivery Plan in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Outcome Plan in src/agents/runtime-plan. */
export type AgentRuntimeOutcomePlan = {
  classifyRunResult: AgentRuntimeOutcomeClassifier;
};

/** Shared type for Agent Runtime Transport Plan in src/agents/runtime-plan. */
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

/** Shared type for Agent Runtime Plan in src/agents/runtime-plan. */
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

/** Shared type for Build Agent Runtime Delivery Plan Params in src/agents/runtime-plan. */
export type BuildAgentRuntimeDeliveryPlanParams = {
  config?: AgentRuntimeConfig;
  workspaceDir?: string;
  agentDir?: string;
  provider: string;
  modelId: string;
  providerRuntimeHandle?: AgentRuntimeProviderHandle;
};

/** Shared type for Build Agent Runtime Plan Params in src/agents/runtime-plan. */
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
