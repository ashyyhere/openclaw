// packages/memory-host-sdk/src/host openclaw runtime memory helpers and runtime behavior.
/** Re-exported public API for packages/memory-host-sdk. */
export {
  buildActiveMemoryPromptSection,
  emptyPluginConfigSchema,
  getMemoryCapabilityRegistration,
  getMemoryEmbeddingProvider,
  listActiveMemoryPublicArtifacts,
  listMemoryEmbeddingProviders,
  listRegisteredMemoryEmbeddingProviderAdapters,
  listRegisteredMemoryEmbeddingProviders,
  resolveCanonicalRootMemoryFile,
  shouldSkipRootMemoryAuxiliaryPath,
} from "./openclaw-runtime.js";
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
  MemoryFlushPlan,
  MemoryFlushPlanResolver,
  MemoryPluginCapability,
  MemoryPluginPublicArtifact,
  MemoryPluginPublicArtifactsProvider,
  MemoryPluginRuntime,
  MemoryPromptSectionBuilder,
  OpenClawPluginApi,
} from "./openclaw-runtime.js";
