/** Memory host SDK barrel for engine embedding helpers. */
export {
  applyEmbeddingBatchOutputLine,
  buildBatchHeaders,
  buildCaseInsensitiveExtensionGlob,
  buildEmbeddingBatchGroupOptions,
  buildRemoteBaseUrlPolicy,
  classifyMemoryMultimodalPath,
  createLocalEmbeddingProvider,
  createRemoteEmbeddingProvider,
  debugEmbeddingsLog,
  DEFAULT_LOCAL_MODEL,
  EMBEDDING_BATCH_ENDPOINT,
  enforceEmbeddingMaxInputTokens,
  estimateStructuredEmbeddingInputBytes,
  estimateUtf8Bytes,
  extractBatchErrorMessage,
  fetchRemoteEmbeddingVectors,
  formatUnavailableBatchError,
  getMemoryMultimodalExtensions,
  hasNonTextEmbeddingParts,
  isMissingEmbeddingApiKeyError,
  mapBatchEmbeddingsByIndex,
  normalizeBatchBaseUrl,
  normalizeEmbeddingModelWithPrefixes,
  postJsonWithRetry,
  resolveBatchCompletionFromStatus,
  resolveCompletedBatchResult,
  resolveRemoteEmbeddingBearerClient,
  resolveRemoteEmbeddingClient,
  runEmbeddingBatchGroups,
  sanitizeAndNormalizeEmbedding,
  sanitizeEmbeddingCacheHeaders,
  throwIfBatchTerminalFailure,
  uploadBatchJsonlFile,
  withRemoteHttpResponse,
} from "../../packages/memory-host-sdk/src/engine-embeddings.js";

/** Shared type for Embedding Batch Status in src/plugin-sdk. */
export type EmbeddingBatchStatus = {
  id?: string;
  status?: string;
  output_file_id?: string | null;
  error_file_id?: string | null;
};

/** Re-exported API for src/plugin-sdk. */
export type {
  BatchCompletionResult,
  BatchHttpClientConfig,
  EmbeddingBatchExecutionParams,
  EmbeddingInput,
  ProviderBatchOutputLine,
  RemoteEmbeddingClient,
  RemoteEmbeddingProviderId,
} from "../../packages/memory-host-sdk/src/engine-embeddings.js";
/** Re-exported API for src/plugin-sdk. */
export {
  getMemoryEmbeddingProvider,
  listMemoryEmbeddingProviders,
  listRegisteredMemoryEmbeddingProviderAdapters,
  listRegisteredMemoryEmbeddingProviders,
} from "../plugins/memory-embedding-provider-runtime.js";
/** Re-exported API for src/plugin-sdk, starting with clear Memory Embedding Providers. */
export { clearMemoryEmbeddingProviders } from "../plugins/memory-embedding-providers.js";
/**
 * @deprecated New embedding providers should use `api.registerEmbeddingProvider(...)`
 * and `contracts.embeddingProviders`. This memory-specific registrar remains
 * available only for compatibility while existing providers migrate.
 */
export { registerMemoryEmbeddingProvider } from "../plugins/memory-embedding-providers.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  MemoryEmbeddingBatchChunk,
  MemoryEmbeddingBatchOptions,
  MemoryEmbeddingProvider,
  MemoryEmbeddingProviderAdapter,
  MemoryEmbeddingProviderCallOptions,
  MemoryEmbeddingProviderCreateOptions,
  MemoryEmbeddingProviderCreateResult,
  MemoryEmbeddingProviderRuntime,
} from "../plugins/memory-embedding-providers.js";
