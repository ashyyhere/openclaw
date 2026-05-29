// config types models helpers and runtime behavior.
import type {
  AnthropicMessagesCompat,
  OpenAICompletionsCompat,
  OpenAIResponsesCompat,
  ThinkingLevelMap,
} from "../llm/types.js";
import type { AgentRuntimePolicyConfig } from "./types.agents-shared.js";
import type { ConfiguredModelProviderRequest } from "./types.provider-request.js";
import type { SecretInput } from "./types.secrets.js";

/** Reused constant for MODEL APIS behavior in src/config. */
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

/** Shared type for Model Api in src/config. */
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

/** Shared type for Supported Thinking Format in src/config. */
export type SupportedThinkingFormat =
  | NonNullable<OpenAICompletionsCompat["thinkingFormat"]>
  | "deepseek"
  | "openrouter"
  | "together";

/** Reused constant for MODEL THINKING FORMATS behavior in src/config. */
export const MODEL_THINKING_FORMATS = [
  "openai",
  "openrouter",
  "deepseek",
  "together",
  "qwen",
  "qwen-chat-template",
  "zai",
] as const satisfies readonly SupportedThinkingFormat[];

/** Reused helper for is Model Thinking Format behavior in src/config. */
export function isModelThinkingFormat(value: string): value is SupportedThinkingFormat {
  return (MODEL_THINKING_FORMATS as readonly string[]).includes(value);
}

/** Shared type for Model Compat Config in src/config. */
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

/** Shared type for Model Image Input Config in src/config. */
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

/** Shared type for Model Media Input Config in src/config. */
export type ModelMediaInputConfig = {
  image?: ModelImageInputConfig;
};

/** Shared type for Model Provider Auth Mode in src/config. */
export type ModelProviderAuthMode = "api-key" | "aws-sdk" | "oauth" | "token";

/** Shared type for Model Provider Local Service Config in src/config. */
export type ModelProviderLocalServiceConfig = {
  command: string;
  args?: string[];
  cwd?: string;
  env?: Record<string, string>;
  healthUrl?: string;
  readyTimeoutMs?: number;
  idleStopMs?: number;
};

/** Shared type for Model Definition Config in src/config. */
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

/** Shared type for Model Provider Config in src/config. */
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

/** Shared type for Model Provider Declaration Config in src/config. */
export type ModelProviderDeclarationConfig = ModelProviderConfig;

/** Shared type for Model Provider Config Input in src/config. */
export type ModelProviderConfigInput = Omit<Partial<ModelProviderConfig>, "models"> & {
  models?: ModelDefinitionConfig[];
};

/** Shared type for Bedrock Discovery Config in src/config. */
export type BedrockDiscoveryConfig = {
  enabled?: boolean;
  region?: string;
  providerFilter?: string[];
  refreshInterval?: number;
  defaultContextWindow?: number;
  defaultMaxTokens?: number;
};

/** Shared type for Discovery Toggle Config in src/config. */
export type DiscoveryToggleConfig = {
  enabled?: boolean;
};

/** Shared type for Model Pricing Config in src/config. */
export type ModelPricingConfig = {
  enabled?: boolean;
};

/** Shared type for Models Config in src/config. */
export type ModelsConfig = {
  mode?: "merge" | "replace";
  providers?: Record<string, ModelProviderConfig>;
  pricing?: ModelPricingConfig;
};

/** Shared type for Models Config Input in src/config. */
export type ModelsConfigInput = Omit<ModelsConfig, "providers"> & {
  providers?: Record<string, ModelProviderConfigInput>;
};
