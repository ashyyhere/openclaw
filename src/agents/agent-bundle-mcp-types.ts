import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { TSchema } from "typebox";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AnyAgentTool } from "./tools/common.js";

/** Materialized MCP tools plus diagnostics and cleanup for one agent run. */
export type BundleMcpToolRuntime = {
  tools: AnyAgentTool[];
  diagnostics?: readonly McpToolCatalogDiagnostic[];
  dispose: () => Promise<void>;
};

/** Catalog entry for one configured MCP server. */
export type McpServerCatalog = {
  serverName: string;
  safeServerName?: string;
  launchSummary: string;
  toolCount: number;
  resources?: {
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  tools?: {
    listChanged?: boolean;
    filteredCount?: number;
  };
  toolFilter?: {
    include?: string[];
    exclude?: string[];
  };
};

/** Catalog entry for one MCP tool after provider-safe naming context is known. */
export type McpCatalogTool = {
  serverName: string;
  safeServerName: string;
  toolName: string;
  title?: string;
  description?: string;
  inputSchema: TSchema;
  fallbackDescription: string;
};

/** Full listed MCP catalog for a session runtime. */
export type McpToolCatalog = {
  version: number;
  generatedAt: number;
  servers: Record<string, McpServerCatalog>;
  tools: McpCatalogTool[];
  diagnostics?: readonly McpToolCatalogDiagnostic[];
};

/** Non-fatal MCP server/tool listing diagnostic. */
export type McpToolCatalogDiagnostic = {
  serverName: string;
  safeServerName: string;
  launchSummary: string;
  message: string;
};

/** Session-owned MCP runtime with lazy cataloging and tool execution. */
export type SessionMcpRuntime = {
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  configFingerprint: string;
  createdAt: number;
  lastUsedAt: number;
  activeLeases?: number;
  acquireLease?: () => () => void;
  /** Lists tools if needed and may connect MCP transports. */
  getCatalog: () => Promise<McpToolCatalog>;
  /** Returns the cached catalog only; must not start runtimes, connect transports, or issue tools/list. */
  peekCatalog: () => McpToolCatalog | null;
  markUsed: () => void;
  callTool: (serverName: string, toolName: string, input: unknown) => Promise<CallToolResult>;
  listResources?: (serverName: string) => Promise<unknown>;
  readResource?: (serverName: string, uri: string) => Promise<unknown>;
  listPrompts?: (serverName: string) => Promise<unknown>;
  getPrompt?: (serverName: string, name: string, args?: Record<string, string>) => Promise<unknown>;
  dispose: () => Promise<void>;
};

/** Process manager for session-scoped MCP runtimes. */
export type SessionMcpRuntimeManager = {
  getOrCreate: (params: {
    sessionId: string;
    sessionKey?: string;
    workspaceDir: string;
    cfg?: OpenClawConfig;
  }) => Promise<SessionMcpRuntime>;
  bindSessionKey: (sessionKey: string, sessionId: string) => void;
  resolveSessionId: (sessionKey: string) => string | undefined;
  /** Looks up an existing runtime only; must not create runtimes or connect transports. */
  peekSession: (params: {
    sessionId?: string;
    sessionKey?: string;
  }) => SessionMcpRuntime | undefined;
  disposeSession: (sessionId: string) => Promise<void>;
  disposeAll: () => Promise<void>;
  sweepIdleRuntimes: () => Promise<number>;
  listSessionIds: () => string[];
};
