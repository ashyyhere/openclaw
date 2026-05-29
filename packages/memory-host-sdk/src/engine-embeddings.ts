// Real workspace contract for memory embedding providers and batch helpers.

/** Re-exported public API for packages/memory-host-sdk. */
export {
  getMemoryEmbeddingProvider,
  listRegisteredMemoryEmbeddingProviders,
  listMemoryEmbeddingProviders,
  listRegisteredMemoryEmbeddingProviderAdapters,
} from "./host/openclaw-runtime-memory.js";
/** Re-exported public API for packages/memory-host-sdk. */
export type {
  MemoryEmbeddingBatchChunk,
  MemoryEmbeddingBatchOptions,
  MemoryEmbeddingProvider,
  MemoryEmbeddingProviderAdapter,
  MemoryEmbeddingProviderCallOptions,
  MemoryEmbeddingProviderCreateOptions,
  MemoryEmbeddingProviderCreateResult,
  MemoryEmbeddingProviderRuntime,
} from "./host/openclaw-runtime-memory.js";
/** Re-exported public API for packages/memory-host-sdk, starting with create Local Embedding Provider. */
export { createLocalEmbeddingProvider, DEFAULT_LOCAL_MODEL } from "./host/embeddings.js";
/** Re-exported public API for packages/memory-host-sdk, starting with extract Batch Error Message. */
export { extractBatchErrorMessage, formatUnavailableBatchError } from "./host/batch-error-utils.js";
/** Re-exported public API for packages/memory-host-sdk, starting with post Json With Retry. */
export { postJsonWithRetry } from "./host/batch-http.js";
/** Re-exported public API for packages/memory-host-sdk, starting with apply Embedding Batch Output Line. */
export { applyEmbeddingBatchOutputLine } from "./host/batch-output.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  EMBEDDING_BATCH_ENDPOINT,
  type EmbeddingBatchStatus,
  type ProviderBatchOutputLine,
} from "./host/batch-provider-common.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  buildEmbeddingBatchGroupOptions,
  runEmbeddingBatchGroups,
  type EmbeddingBatchExecutionParams,
} from "./host/batch-runner.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  resolveBatchCompletionFromStatus,
  resolveCompletedBatchResult,
  throwIfBatchTerminalFailure,
  type BatchCompletionResult,
} from "./host/batch-status.js";
/** Re-exported public API for packages/memory-host-sdk, starting with upload Batch Jsonl File. */
export { uploadBatchJsonlFile } from "./host/batch-upload.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  buildBatchHeaders,
  normalizeBatchBaseUrl,
  type BatchHttpClientConfig,
} from "./host/batch-utils.js";
/** Re-exported public API for packages/memory-host-sdk, starting with enforce Embedding Max Input Tokens. */
export { enforceEmbeddingMaxInputTokens } from "./host/embedding-chunk-limits.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  isMissingEmbeddingApiKeyError,
  mapBatchEmbeddingsByIndex,
  sanitizeEmbeddingCacheHeaders,
} from "./host/embedding-provider-adapter-utils.js";
/** Re-exported public API for packages/memory-host-sdk, starting with sanitize And Normalize Embedding. */
export { sanitizeAndNormalizeEmbedding } from "./host/embedding-vectors.js";
/** Re-exported public API for packages/memory-host-sdk, starting with debug Embeddings Log. */
export { debugEmbeddingsLog } from "./host/embeddings-debug.js";
/** Re-exported public API for packages/memory-host-sdk, starting with normalize Embedding Model With Prefixes. */
export { normalizeEmbeddingModelWithPrefixes } from "./host/embeddings-model-normalize.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  resolveRemoteEmbeddingBearerClient,
  type RemoteEmbeddingProviderId,
} from "./host/embeddings-remote-client.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  createRemoteEmbeddingProvider,
  resolveRemoteEmbeddingClient,
  type RemoteEmbeddingClient,
} from "./host/embeddings-remote-provider.js";
/** Re-exported public API for packages/memory-host-sdk, starting with fetch Remote Embedding Vectors. */
export { fetchRemoteEmbeddingVectors } from "./host/embeddings-remote-fetch.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  estimateStructuredEmbeddingInputBytes,
  estimateUtf8Bytes,
} from "./host/embedding-input-limits.js";
/** Re-exported public API for packages/memory-host-sdk, starting with has Non Text Embedding Parts. */
export { hasNonTextEmbeddingParts, type EmbeddingInput } from "./host/embedding-inputs.js";
/** Re-exported public API for packages/memory-host-sdk, starting with build Remote Base Url Policy. */
export { buildRemoteBaseUrlPolicy, withRemoteHttpResponse } from "./host/remote-http.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  buildCaseInsensitiveExtensionGlob,
  classifyMemoryMultimodalPath,
  getMemoryMultimodalExtensions,
} from "./host/multimodal.js";
