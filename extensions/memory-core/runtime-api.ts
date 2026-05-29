// extensions/memory-core runtime api helpers and runtime behavior.
/** Re-exported memory-core plugin public API, starting with get Memory Search Manager. */
export { getMemorySearchManager, MemoryIndexManager } from "./src/memory/index.js";
/** Re-exported memory-core plugin public API, starting with memory Runtime. */
export { memoryRuntime } from "./src/runtime-provider.js";
/** Re-exported memory-core plugin public API. */
export {
  DEFAULT_LOCAL_MODEL,
  getBuiltinMemoryEmbeddingProviderDoctorMetadata,
  listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata,
  registerBuiltInMemoryEmbeddingProviders,
} from "./src/memory/provider-adapters.js";
/** Re-exported memory-core plugin public API, starting with create Embedding Provider. */
export { createEmbeddingProvider } from "./src/memory/embeddings.js";
/** Re-exported memory-core plugin public API. */
export {
  resolveMemoryCacheSummary,
  resolveMemoryFtsState,
  resolveMemoryVectorState,
  type Tone,
} from "openclaw/plugin-sdk/memory-core-host-status";
/** Re-exported memory-core plugin public API, starting with check Qmd Binary Availability. */
export { checkQmdBinaryAvailability } from "openclaw/plugin-sdk/memory-core-host-engine-qmd";
/** Re-exported memory-core plugin public API, starting with has Configured Memory Secret Input. */
export { hasConfiguredMemorySecretInput } from "openclaw/plugin-sdk/memory-core-host-secret";
/** Re-exported memory-core plugin public API, starting with audit Dreaming Artifacts. */
export { auditDreamingArtifacts, repairDreamingArtifacts } from "./src/dreaming-repair.js";
/** Re-exported memory-core plugin public API. */
export {
  auditShortTermPromotionArtifacts,
  removeGroundedShortTermCandidates,
  repairShortTermPromotionArtifacts,
} from "./src/short-term-promotion.js";
/** Re-exported memory-core plugin public API, starting with Builtin Memory Embedding Provider Doctor Metadata. */
export type { BuiltinMemoryEmbeddingProviderDoctorMetadata } from "./src/memory/provider-adapters.js";
/** Re-exported memory-core plugin public API. */
export type {
  DreamingArtifactsAuditSummary,
  RepairDreamingArtifactsResult,
} from "./src/dreaming-repair.js";
/** Re-exported memory-core plugin public API. */
export type {
  RepairShortTermPromotionArtifactsResult,
  ShortTermAuditSummary,
} from "./src/short-term-promotion.js";
