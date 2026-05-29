// config types memory helpers and runtime behavior.
import type { SessionSendPolicyConfig } from "./types.base.js";

/** Shared type for Memory Backend in src/config. */
export type MemoryBackend = "builtin" | "qmd";
/** Shared type for Memory Citations Mode in src/config. */
export type MemoryCitationsMode = "auto" | "on" | "off";
/** Shared type for Memory Qmd Search Mode in src/config. */
export type MemoryQmdSearchMode = "query" | "search" | "vsearch";
/** Shared type for Memory Qmd Startup Mode in src/config. */
export type MemoryQmdStartupMode = "off" | "idle" | "immediate";

/** Shared type for Memory Config in src/config. */
export type MemoryConfig = {
  backend?: MemoryBackend;
  citations?: MemoryCitationsMode;
  qmd?: MemoryQmdConfig;
};

/** Shared type for Memory Qmd Config in src/config. */
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

/** Shared type for Memory Qmd Mcporter Config in src/config. */
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

/** Shared type for Memory Qmd Index Path in src/config. */
export type MemoryQmdIndexPath = {
  path: string;
  name?: string;
  pattern?: string;
};

/** Shared type for Memory Qmd Session Config in src/config. */
export type MemoryQmdSessionConfig = {
  enabled?: boolean;
  exportDir?: string;
  retentionDays?: number;
};

/** Shared type for Memory Qmd Update Config in src/config. */
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

/** Shared type for Memory Qmd Limits Config in src/config. */
export type MemoryQmdLimitsConfig = {
  maxResults?: number;
  maxSnippetChars?: number;
  maxInjectedChars?: number;
  timeoutMs?: number;
};
