// Focused runtime contract for memory file/backend access.

/** Re-exported public API for packages/memory-host-sdk, starting with list Memory Files. */
export { listMemoryFiles, normalizeExtraMemoryPaths } from "./host/internal.js";
/** Re-exported public API for packages/memory-host-sdk, starting with read Agent Memory File. */
export { readAgentMemoryFile } from "./host/read-file.js";
/** Re-exported public API for packages/memory-host-sdk, starting with resolve Memory Backend Config. */
export { resolveMemoryBackendConfig } from "./host/backend-config.js";
/** Re-exported public API for packages/memory-host-sdk. */
export type {
  MemorySearchManager,
  MemorySearchRuntimeDebug,
  MemorySearchResult,
} from "./host/types.js";
