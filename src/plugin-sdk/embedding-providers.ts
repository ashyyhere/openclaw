/** Public SDK barrel for embedding provider contracts and registration helpers. */
export {
  getEmbeddingProvider,
  listEmbeddingProviders,
} from "../plugins/embedding-provider-runtime.js";

/** Re-exported API for src/plugin-sdk. */
export type {
  EmbeddingInput,
  EmbeddingProvider,
  EmbeddingProviderAdapter,
  EmbeddingProviderCallOptions,
  EmbeddingProviderCreateOptions,
  EmbeddingProviderCreateResult,
  EmbeddingProviderRuntime,
} from "../plugins/embedding-providers.js";
