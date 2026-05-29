/** Loads bundled LSP server config for embedded-agent runs. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { BundleLspServerConfig } from "../plugins/bundle-lsp.js";
import { loadEnabledBundleLspConfig } from "../plugins/bundle-lsp.js";

type EmbeddedAgentLspConfig = {
  lspServers: Record<string, BundleLspServerConfig>;
  diagnostics: Array<{ pluginId: string; message: string }>;
};

/** Load enabled LSP servers and diagnostics for an embedded-agent workspace. */
export function loadEmbeddedAgentLspConfig(params: {
  workspaceDir: string;
  cfg?: OpenClawConfig;
}): EmbeddedAgentLspConfig {
  const bundleLsp = loadEnabledBundleLspConfig({
    workspaceDir: params.workspaceDir,
    cfg: params.cfg,
  });
  // User-configured LSP servers could override bundle defaults here in the future.
  return {
    lspServers: { ...bundleLsp.config.lspServers },
    diagnostics: bundleLsp.diagnostics,
  };
}
