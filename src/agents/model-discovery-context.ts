/** Resolves workspace and plugin metadata context for model discovery. */
import { getRuntimeConfig } from "../config/config.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { getCurrentPluginMetadataSnapshot } from "../plugins/current-plugin-metadata-snapshot.js";
import { resolvePluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.js";
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "./agent-scope.js";
import type { PluginModelCatalogMetadataSnapshot } from "./plugin-model-catalog.js";

/** Resolve workspace dir used by model discovery. */
export function resolveModelWorkspaceDir(
  cfg: OpenClawConfig | undefined,
  explicitWorkspaceDir: string | undefined,
): string | undefined {
  if (explicitWorkspaceDir !== undefined || !cfg) {
    return explicitWorkspaceDir;
  }
  return resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
}

/** Resolve plugin metadata snapshot used by model discovery/catalog loading. */
export function resolveModelPluginMetadataSnapshot(params: {
  allowWorkspaceScopedCurrent?: boolean;
  config?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  pluginMetadataSnapshot?: PluginModelCatalogMetadataSnapshot;
  useRuntimeConfig?: boolean;
  workspaceDir?: string;
}): PluginModelCatalogMetadataSnapshot | undefined {
  if (params.pluginMetadataSnapshot) {
    return params.pluginMetadataSnapshot;
  }
  const env = params.env ?? process.env;
  try {
    const config = params.config ?? (params.useRuntimeConfig ? getRuntimeConfig() : undefined);
    return (
      getCurrentPluginMetadataSnapshot({
        allowWorkspaceScopedSnapshot: true,
        env,
        ...(config ? { config } : {}),
        ...(params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}),
      }) ??
      resolvePluginMetadataSnapshot({
        config: config ?? {},
        env,
        ...(params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}),
        ...(params.allowWorkspaceScopedCurrent !== undefined
          ? { allowWorkspaceScopedCurrent: params.allowWorkspaceScopedCurrent }
          : {}),
      })
    );
  } catch {
    return undefined;
  }
}
