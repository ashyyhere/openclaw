// extensions/ollama api helpers and runtime behavior.
/** Re-exported ollama plugin public API. */
export {
  OLLAMA_DEFAULT_BASE_URL,
  OLLAMA_DEFAULT_CONTEXT_WINDOW,
  OLLAMA_DEFAULT_COST,
  OLLAMA_DEFAULT_MAX_TOKENS,
  OLLAMA_DEFAULT_MODEL,
} from "./src/defaults.js";
/** Re-exported ollama plugin public API. */
export {
  buildOllamaModelDefinition,
  enrichOllamaModelsWithContext,
  fetchOllamaModels,
  isReasoningModelHeuristic,
  queryOllamaContextWindow,
  queryOllamaModelShowInfo,
  resolveOllamaApiBase,
  type OllamaModelShowInfo,
  type OllamaModelWithContext,
  type OllamaTagModel,
  type OllamaTagsResponse,
} from "./src/provider-models.js";
/** Re-exported ollama plugin public API. */
export {
  buildOllamaProvider,
  configureOllamaNonInteractive,
  ensureOllamaModelPulled,
  promptAndConfigureOllama,
} from "./src/setup.js";
/** Re-exported ollama plugin public API. */
export {
  buildOllamaChatRequest,
  createConfiguredOllamaCompatStreamWrapper,
  isOllamaCompatProvider,
  resolveOllamaCompatNumCtxEnabled,
  shouldInjectOllamaCompatNumCtx,
  wrapOllamaCompatNumCtx,
} from "./src/stream.js";
