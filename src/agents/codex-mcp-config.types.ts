/** Shared types for projecting bundle MCP into Codex thread configuration. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { BundleMcpDiagnostic } from "../plugins/bundle-mcp.js";

/** Codex MCP server map keyed by server name. */
export type CodexMcpServersConfig = Record<string, Record<string, unknown>>;

/** Bundle MCP thread configuration patch plus diagnostics. */
export type CodexBundleMcpThreadConfig = {
  configPatch?: {
    mcp_servers: CodexMcpServersConfig;
  };
  diagnostics: BundleMcpDiagnostic[];
  evaluated: boolean;
  fingerprint?: string;
};

/** Inputs needed to decide and build a Codex bundle MCP patch. */
export type LoadCodexBundleMcpThreadConfigParams = {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  toolsEnabled?: boolean;
  disableTools?: boolean;
  toolsAllow?: string[];
};
