// Real workspace contract for memory engine storage/index helpers.

/** Re-exported public API for packages/memory-host-sdk. */
export {
  buildFileEntry,
  buildMultimodalChunkForIndexing,
  chunkMarkdown,
  cosineSimilarity,
  ensureDir,
  hashText,
  listMemoryFiles,
  normalizeExtraMemoryPaths,
  parseEmbedding,
  remapChunkLines,
  runWithConcurrency,
  type MemoryChunk,
  type MemoryFileEntry,
} from "./host/internal.js";
/** Re-exported public API for packages/memory-host-sdk, starting with read Memory File. */
export { readMemoryFile } from "./host/read-file.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  buildMemoryReadResult,
  buildMemoryReadResultFromSlice,
  DEFAULT_MEMORY_READ_LINES,
  DEFAULT_MEMORY_READ_MAX_CHARS,
  type MemoryReadResult,
} from "./host/read-file-shared.js";
/** Re-exported public API for packages/memory-host-sdk, starting with resolve Memory Backend Config. */
export { resolveMemoryBackendConfig } from "./host/backend-config.js";
/** Re-exported public API for packages/memory-host-sdk. */
export type {
  ResolvedMemoryBackendConfig,
  ResolvedQmdConfig,
  ResolvedQmdMcporterConfig,
} from "./host/backend-config.js";
/** Re-exported public API for packages/memory-host-sdk. */
export type {
  MemoryEmbeddingProbeResult,
  MemoryProviderStatus,
  MemorySearchManager,
  MemorySearchRuntimeDebug,
  MemorySearchResult,
  MemorySource,
  MemorySyncProgressUpdate,
} from "./host/types.js";
/** Re-exported public API for packages/memory-host-sdk, starting with ensure Memory Index Schema. */
export { ensureMemoryIndexSchema } from "./host/memory-schema.js";
/** Re-exported public API for packages/memory-host-sdk, starting with load Sqlite Vec Extension. */
export { loadSqliteVecExtension } from "./host/sqlite-vec.js";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  closeMemorySqliteWalMaintenance,
  configureMemorySqliteWalMaintenance,
  requireNodeSqlite,
} from "./host/sqlite.js";
/** Re-exported public API for packages/memory-host-sdk, starting with is File Missing Error. */
export { isFileMissingError, statRegularFile } from "./host/fs-utils.js";
