// plugins installed plugin index registry helpers and runtime behavior.
import { normalizePluginsConfig } from "./config-state.js";
import {
  discoverOpenClawPlugins,
  type PluginCandidate,
  type PluginDiscoveryResult,
} from "./discovery.js";
import { loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader.js";
import type { LoadInstalledPluginIndexParams } from "./installed-plugin-index-types.js";
import { loadPluginManifestRegistry, type PluginManifestRegistry } from "./manifest-registry.js";

/** Reused helper for resolve Installed Plugin Index Registry behavior in src/plugins. */
export function resolveInstalledPluginIndexRegistry(params: LoadInstalledPluginIndexParams): {
  registry: PluginManifestRegistry;
  candidates: readonly PluginCandidate[];
  discovery?: PluginDiscoveryResult;
} {
  if (params.candidates) {
    return {
      candidates: params.candidates,
      registry: loadPluginManifestRegistry({
        config: params.config,
        workspaceDir: params.workspaceDir,
        env: params.env,
        candidates: params.candidates,
        diagnostics: params.diagnostics,
        installRecords: params.installRecords,
      }),
    };
  }

  const normalized = normalizePluginsConfig(params.config?.plugins);
  const installRecords =
    params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env: params.env });
  const discovery =
    params.discovery ??
    discoverOpenClawPlugins({
      workspaceDir: params.workspaceDir,
      extraPaths: normalized.loadPaths,
      env: params.env,
      installRecords,
    });
  return {
    candidates: discovery.candidates,
    discovery,
    registry: loadPluginManifestRegistry({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
      candidates: discovery.candidates,
      diagnostics: discovery.diagnostics,
      installRecords,
    }),
  };
}
