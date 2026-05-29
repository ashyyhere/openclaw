/** Public SDK barrel for LLM/provider transport contracts. */
export {
  getApiProvider,
  getApiProviders,
  registerApiProvider,
  unregisterApiProviders,
  type ApiProvider,
} from "../llm/api-registry.js";
/** Re-exported API for src/plugin-sdk, starting with get Env Api Key. */
export { getEnvApiKey } from "../llm/env-api-keys.js";
/** Re-exported API for src/plugin-sdk, starting with calculate Cost. */
export { calculateCost, clampThinkingLevel } from "../llm/model-utils.js";
/** Re-exported API for src/plugin-sdk. */
export {
  adjustMaxTokensForThinking,
  buildBaseOptions,
  clampReasoning,
} from "../llm/providers/simple-options.js";
/** Re-exported API for src/plugin-sdk, starting with transform Messages. */
export { transformMessages } from "../llm/providers/transform-messages.js";
/** Re-exported API for src/plugin-sdk, starting with complete. */
export { complete, completeSimple, stream, streamSimple } from "../llm/stream.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
export {
  AssistantMessageEventStream,
  createAssistantMessageEventStream,
} from "../../packages/llm-core/src/utils/event-stream.js";
export { parseStreamingJson } from "../llm/utils/json-parse.js";
/** Re-exported API for src/plugin-sdk, starting with create Http Proxy Agents For Target. */
export { createHttpProxyAgentsForTarget } from "../llm/utils/node-http-proxy.js";
/** Re-exported API for src/plugin-sdk, starting with sanitize Surrogates. */
export { sanitizeSurrogates } from "../llm/utils/sanitize-unicode.js";
export { validateToolArguments, validateToolCall } from "../../packages/llm-core/src/validation.js";
