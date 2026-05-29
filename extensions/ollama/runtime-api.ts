// extensions/ollama runtime api helpers and runtime behavior.
/** Re-exported ollama plugin public API. */
export {
  buildAssistantMessage,
  buildOllamaChatRequest,
  createConfiguredOllamaCompatStreamWrapper,
  convertToOllamaMessages,
  createConfiguredOllamaCompatNumCtxWrapper,
  createConfiguredOllamaStreamFn,
  createOllamaStreamFn,
  isOllamaCompatProvider,
  OLLAMA_NATIVE_BASE_URL,
  parseNdjsonStream,
  resolveOllamaBaseUrlForRun,
  resolveOllamaCompatNumCtxEnabled,
  shouldInjectOllamaCompatNumCtx,
  wrapOllamaCompatNumCtx,
} from "./src/stream.js";
/** Re-exported ollama plugin public API. */
export {
  createOllamaEmbeddingProvider,
  DEFAULT_OLLAMA_EMBEDDING_MODEL,
  type OllamaEmbeddingClient,
  type OllamaEmbeddingProvider,
} from "./src/embedding-provider.js";
