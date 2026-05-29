// Memory capability facade for plugin/runtime memory registration helpers.
/** Memory provider registry, prompt, artifact, and root-file helpers. */
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
/** Memory plugin and embedding provider contracts from the core runtime facade. */
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
