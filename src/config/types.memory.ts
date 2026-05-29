// Memory config contracts for built-in memory and QMD-backed recall.
import type { SessionSendPolicyConfig } from "./types.base.js";

/** Memory backend selected by config. */
export type MemoryBackend = "builtin" | "qmd";
/** Citation emission policy for memory-injected context. */
export type MemoryCitationsMode = "auto" | "on" | "off";
/** QMD command family used for memory search. */
export type MemoryQmdSearchMode = "query" | "search" | "vsearch";
/** Startup scheduling policy for QMD memory indexing. */
export type MemoryQmdStartupMode = "off" | "idle" | "immediate";

/** Top-level memory config block. */
export type MemoryConfig = {
  backend?: MemoryBackend;
  citations?: MemoryCitationsMode;
  qmd?: MemoryQmdConfig;
};

/** QMD-backed memory config for search paths, session exports, updates, and limits. */
export type MemoryQmdConfig = {
  command?: string;
  mcporter?: MemoryQmdMcporterConfig;
  searchMode?: MemoryQmdSearchMode;
  searchTool?: string;
  includeDefaultMemory?: boolean;
  paths?: MemoryQmdIndexPath[];
  sessions?: MemoryQmdSessionConfig;
  update?: MemoryQmdUpdateConfig;
  limits?: MemoryQmdLimitsConfig;
  scope?: SessionSendPolicyConfig;
};

/** mcporter integration config for keeping a QMD MCP server warm. */
export type MemoryQmdMcporterConfig = {
  /**
   * Route QMD searches through mcporter (MCP runtime) instead of spawning `qmd` per query.
   * Requires:
   * - `mcporter` installed and on PATH
   * - A configured mcporter server that runs `qmd mcp` with `lifecycle: keep-alive`
   */
  enabled?: boolean;
  /** mcporter server name (defaults to "qmd") */
  serverName?: string;
  /** Start the mcporter daemon automatically (defaults to true when enabled). */
  startDaemon?: boolean;
};

/** Filesystem path and optional filter indexed by QMD memory. */
export type MemoryQmdIndexPath = {
  path: string;
  name?: string;
  pattern?: string;
};

/** Session transcript export settings for QMD indexing. */
export type MemoryQmdSessionConfig = {
  enabled?: boolean;
  exportDir?: string;
  retentionDays?: number;
};

/** QMD update and embedding scheduling/time-limit config. */
export type MemoryQmdUpdateConfig = {
  interval?: string;
  debounceMs?: number;
  onBoot?: boolean;
  startup?: MemoryQmdStartupMode;
  startupDelayMs?: number;
  waitForBootSync?: boolean;
  embedInterval?: string;
  commandTimeoutMs?: number;
  updateTimeoutMs?: number;
  embedTimeoutMs?: number;
};

/** QMD memory query and injection limits. */
export type MemoryQmdLimitsConfig = {
  maxResults?: number;
  maxSnippetChars?: number;
  maxInjectedChars?: number;
  timeoutMs?: number;
};
