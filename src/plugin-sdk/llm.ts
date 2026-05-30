/** Public SDK barrel for LLM/provider transport contracts. */
export {
  getApiProvider,
  getApiProviders,
  registerApiProvider,
  unregisterApiProviders,
  type ApiProvider,
} from "../llm/api-registry.js";
/** Reads model provider API keys from supported environment variable names. */
export { getEnvApiKey } from "../llm/env-api-keys.js";
/** Model cost and thinking-level helpers shared by provider implementations. */
export { calculateCost, clampThinkingLevel } from "../llm/model-utils.js";
/** Common option normalizers for simple provider implementations. */
export {
  adjustMaxTokensForThinking,
  buildBaseOptions,
  clampReasoning,
} from "../llm/providers/simple-options.js";
/** Converts OpenClaw message objects into provider-ready text/content payloads. */
export { transformMessages } from "../llm/providers/transform-messages.js";
/** Generic completion and streaming entrypoints for SDK-backed LLM providers. */
export { complete, completeSimple, stream, streamSimple } from "../llm/stream.js";
/** Public LLM message, model, tool, usage, and streaming contract types. */
export type {
  Api,
  AssistantMessage,
  AssistantMessageEvent,
  AssistantMessageEventStreamContract,
  CacheRetention,
  Context,
  ImageContent,
  Message,
  Model,
  ModelThinkingLevel,
  ProviderResponse,
  ProviderStreamOptions,
  SimpleStreamOptions,
  StopReason,
  StreamFunction,
  StreamOptions,
  TextContent,
  ThinkingBudgets,
  ThinkingContent,
  ThinkingLevel,
  Tool,
  ToolCall,
  ToolResultMessage,
  Usage,
  UserMessage,
} from "../llm/types.js";
/** Assistant event stream builder used by streaming provider adapters. */
export {
  AssistantMessageEventStream,
  createAssistantMessageEventStream,
} from "../../packages/llm-core/src/utils/event-stream.js";
export { parseStreamingJson } from "../llm/utils/json-parse.js";
/** Creates HTTP proxy agents for a target provider endpoint. */
export { createHttpProxyAgentsForTarget } from "../llm/utils/node-http-proxy.js";
/** Sanitizes invalid Unicode surrogate pairs before provider transport. */
export { sanitizeSurrogates } from "../llm/utils/sanitize-unicode.js";
export { validateToolArguments, validateToolCall } from "../../packages/llm-core/src/validation.js";
