// Model/provider config contracts shared by config loading, provider routing, and docs.
import type {
  AnthropicMessagesCompat,
  OpenAICompletionsCompat,
  OpenAIResponsesCompat,
  ThinkingLevelMap,
} from "../llm/types.js";
import type { AgentRuntimePolicyConfig } from "./types.agents-shared.js";
import type { ConfiguredModelProviderRequest } from "./types.provider-request.js";
import type { SecretInput } from "./types.secrets.js";

/** Supported provider API protocol identifiers in `models.providers.*.api`. */
export const MODEL_APIS = [
  "openai-completions",
  "openai-responses",
  "openai-codex-responses",
  "anthropic-messages",
  "google-generative-ai",
  "google-vertex",
  "github-copilot",
  "bedrock-converse-stream",
  "ollama",
  "azure-openai-responses",
] as const;

/** Provider API protocol identifier used to select request/stream adapters. */
export type ModelApi = (typeof MODEL_APIS)[number];

type SupportedOpenAICompatFields = Pick<
  OpenAICompletionsCompat,
  | "supportsStore"
  | "supportsDeveloperRole"
  | "supportsReasoningEffort"
  | "supportsUsageInStreaming"
  | "supportsStrictMode"
  | "maxTokensField"
  | "requiresToolResultName"
  | "requiresAssistantAfterToolResult"
  | "requiresThinkingAsText"
  | "openRouterRouting"
  | "vercelGatewayRouting"
  | "zaiToolStream"
  | "cacheControlFormat"
  | "sendSessionAffinityHeaders"
  | "supportsLongCacheRetention"
>;

type SupportedOpenAIResponsesCompatFields = Pick<
  OpenAIResponsesCompat,
  "sendSessionIdHeader" | "supportsLongCacheRetention"
>;

type SupportedAnthropicMessagesCompatFields = Pick<
  AnthropicMessagesCompat,
  "supportsEagerToolInputStreaming" | "supportsLongCacheRetention"
>;

/** Known provider-specific encodings for visible/internal reasoning content. */
export type SupportedThinkingFormat =
  | NonNullable<OpenAICompletionsCompat["thinkingFormat"]>
  | "deepseek"
  | "openrouter"
  | "together";

/** Config-accepted thinking-format values, kept in sync with provider compat handling. */
export const MODEL_THINKING_FORMATS = [
  "openai",
  "openrouter",
  "deepseek",
  "together",
  "qwen",
  "qwen-chat-template",
  "zai",
] as const satisfies readonly SupportedThinkingFormat[];

/** Narrow arbitrary config strings to thinking formats supported by this build. */
export function isModelThinkingFormat(value: string): value is SupportedThinkingFormat {
  return (MODEL_THINKING_FORMATS as readonly string[]).includes(value);
}

/** Provider/model compatibility flags consumed by request shaping and streaming adapters. */
export type ModelCompatConfig = SupportedOpenAICompatFields &
  SupportedOpenAIResponsesCompatFields &
  SupportedAnthropicMessagesCompatFields & {
    thinkingFormat?: SupportedThinkingFormat;
    supportedReasoningEfforts?: string[];
    reasoningEffortMap?: Record<string, string>;
    visibleReasoningDetailTypes?: string[];
    supportsTools?: boolean;
    supportsPromptCacheKey?: boolean;
    requiresStringContent?: boolean;
    strictMessageKeys?: boolean;
    toolSchemaProfile?: string;
    unsupportedToolSchemaKeywords?: string[];
    nativeWebSearchTool?: boolean;
    toolCallArgumentsEncoding?: string;
    requiresMistralToolIds?: boolean;
    requiresOpenAiAnthropicToolPayload?: boolean;
  };

/** Image input limits and compression hints for a configured model. */
export type ModelImageInputConfig = {
  /** Provider-documented maximum encoded image payload size. */
  maxBytes?: number;
  /** Provider-documented maximum accepted input pixels. */
  maxPixels?: number;
  /** Provider-documented maximum accepted width/height in pixels. */
  maxSidePx?: number;
  /** Preferred resize side for the default balanced compression policy. */
  preferredSidePx?: number;
  /** Token accounting style, used as documentation for provider-owned policy. */
  tokenMode?: "tile" | "detail" | "provider";
};

/** Media input capability metadata grouped by attachment kind. */
export type ModelMediaInputConfig = {
  image?: ModelImageInputConfig;
};

/** Authentication mechanism a model provider entry expects. */
export type ModelProviderAuthMode = "api-key" | "aws-sdk" | "oauth" | "token";

/** Local helper service that must be started before a provider is called. */
export type ModelProviderLocalServiceConfig = {
  command: string;
  args?: string[];
  cwd?: string;
  env?: Record<string, string>;
  healthUrl?: string;
  readyTimeoutMs?: number;
  idleStopMs?: number;
};

/** Per-model runtime metadata nested under a configured provider. */
export type ModelDefinitionConfig = {
  id: string;
  name: string;
  api?: ModelApi;
  baseUrl?: string;
  reasoning: boolean;
  input: Array<"text" | "image" | "video" | "audio">;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    /** Optional tiered pricing.  When present, cost calculation uses
     *  per-tier rates instead of the flat rates above.  Prices are
     *  USD / million tokens; ranges are half-open `[start, end)` on the
     *  input-token axis. */
    tieredPricing?: Array<{
      input: number;
      output: number;
      cacheRead: number;
      cacheWrite: number;
      /** Bounded tier: `[start, end)`. Open-ended top tier: `[start]` (normalized to `[start, Infinity]` at load time). */
      range: [number, number] | [number];
    }>;
  };
  contextWindow: number;
  /**
   * Optional effective runtime cap used for compaction/session budgeting.
   * Keeps provider/native contextWindow metadata intact while letting configs
   * prefer a smaller practical window.
   */
  contextTokens?: number;
  maxTokens: number;
  /** Maps OpenClaw thinking levels to provider/model-specific values. */
  thinkingLevelMap?: ThinkingLevelMap;
  /** Provider-specific request/runtime parameters passed through to provider plugins. */
  params?: Record<string, unknown>;
  /** Optional agent execution runtime override for this provider/model pair. */
  agentRuntime?: AgentRuntimePolicyConfig;
  headers?: Record<string, string>;
  compat?: ModelCompatConfig;
  mediaInput?: ModelMediaInputConfig;
  metadataSource?: "models-add";
};

/** Provider-level config plus the model definitions served through that provider. */
export type ModelProviderConfig = {
  baseUrl: string;
  apiKey?: SecretInput;
  auth?: ModelProviderAuthMode;
  api?: ModelApi;
  contextWindow?: number;
  contextTokens?: number;
  maxTokens?: number;
  timeoutSeconds?: number;
  /** Optional provider deployment/API region used by provider plugins that expose regional endpoints. */
  region?: string;
  injectNumCtxForOpenAICompat?: boolean;
  /** Provider-specific runtime parameters interpreted by provider plugins. */
  params?: Record<string, unknown>;
  /** Optional default agent execution runtime for models under this provider. */
  agentRuntime?: AgentRuntimePolicyConfig;
  /** Optional local service to start before calling this provider. */
  localService?: ModelProviderLocalServiceConfig;
  headers?: Record<string, SecretInput>;
  authHeader?: boolean;
  request?: ConfiguredModelProviderRequest;
  models: ModelDefinitionConfig[];
};

/** Public declaration alias kept for model config authoring surfaces. */
export type ModelProviderDeclarationConfig = ModelProviderConfig;

/** Partial provider config accepted before defaults/schema normalization. */
export type ModelProviderConfigInput = Omit<Partial<ModelProviderConfig>, "models"> & {
  models?: ModelDefinitionConfig[];
};

/** Bedrock model discovery controls used when provider catalogs are refreshed. */
export type BedrockDiscoveryConfig = {
  enabled?: boolean;
  region?: string;
  providerFilter?: string[];
  refreshInterval?: number;
  defaultContextWindow?: number;
  defaultMaxTokens?: number;
};

/** Generic enable/disable wrapper for provider catalog discovery sections. */
export type DiscoveryToggleConfig = {
  enabled?: boolean;
};

/** Pricing refresh controls for model cost metadata. */
export type ModelPricingConfig = {
  enabled?: boolean;
};

/** Top-level models config block from `openclaw.json`. */
export type ModelsConfig = {
  mode?: "merge" | "replace";
  providers?: Record<string, ModelProviderConfig>;
  pricing?: ModelPricingConfig;
};

/** Top-level models config shape accepted before provider defaults are applied. */
export type ModelsConfigInput = Omit<ModelsConfig, "providers"> & {
  providers?: Record<string, ModelProviderConfigInput>;
};
