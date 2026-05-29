// plugins manifest contract eligibility helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { sortUniqueStrings } from "../shared/string-normalization.js";
import { isInstalledPluginEnabled } from "./installed-plugin-index.js";
import type { PluginManifestContractListKey, PluginManifestRecord } from "./manifest-registry.js";
import { resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot.js";
import type {
  PluginMetadataManifestView,
  PluginMetadataRegistryView,
  PluginMetadataSnapshot,
} from "./plugin-metadata-snapshot.types.js";

/** Reused helper for is Manifest Plugin Available For Control Plane behavior in src/plugins. */
export function isManifestPluginAvailableForControlPlane(params: {
  snapshot: Pick<PluginMetadataSnapshot, "index">;
  plugin: Pick<
    PluginManifestRecord,
    "id" | "origin" | "enabledByDefault" | "enabledByDefaultOnPlatforms"
  >;
  config?: OpenClawConfig;
}): boolean {
  if (params.plugin.origin === "bundled") {
    return true;
  }
  return isInstalledPluginEnabled(params.snapshot.index, params.plugin.id, params.config);
}

/** Reused helper for has Manifest Contract Value behavior in src/plugins. */
export function hasManifestContractValue(params: {
  plugin: Pick<PluginManifestRecord, "contracts">;
  contract: PluginManifestContractListKey;
  value?: string;
}): boolean {
  const values = params.plugin.contracts?.[params.contract] ?? [];
  return values.length > 0 && (!params.value || values.includes(params.value));
}

/** Reused helper for list Available Manifest Contract Plugins behavior in src/plugins. */
export function listAvailableManifestContractPlugins(params: {
  snapshot: Pick<PluginMetadataSnapshot, "index" | "plugins">;
  contract: PluginManifestContractListKey;
  value?: string;
  config?: OpenClawConfig;
}): PluginManifestRecord[] {
  return params.snapshot.plugins.filter(
    (plugin) =>
      hasManifestContractValue({
        plugin,
        contract: params.contract,
        value: params.value,
      }) &&
      isManifestPluginAvailableForControlPlane({
        snapshot: params.snapshot,
        plugin,
        config: params.config,
      }),
  );
}

/** Reused helper for list Available Manifest Contract Values behavior in src/plugins. */
export function listAvailableManifestContractValues(params: {
  snapshot: Pick<PluginMetadataSnapshot, "index" | "plugins">;
  contract: PluginManifestContractListKey;
  config?: OpenClawConfig;
}): string[] {
  const values = new Set<string>();
  for (const plugin of listAvailableManifestContractPlugins(params)) {
    for (const value of plugin.contracts?.[params.contract] ?? []) {
      values.add(value);
    }
  }
  return sortUniqueStrings(values);
}

/** Reused helper for load Manifest Contract Snapshot behavior in src/plugins. */
export function loadManifestContractSnapshot(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): PluginMetadataManifestView {
  const snapshot = loadManifestMetadataSnapshot(params);
  return {
    index: snapshot.index,
    plugins: snapshot.plugins,
  };
}

/** Reused helper for load Manifest Metadata Registry behavior in src/plugins. */
export function loadManifestMetadataRegistry(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): PluginMetadataRegistryView {
  const snapshot = loadManifestMetadataSnapshot(params);
  return {
    index: snapshot.index,
    manifestRegistry: snapshot.manifestRegistry,
  };
}

/** Reused helper for load Manifest Metadata Snapshot behavior in src/plugins. */
export function loadManifestMetadataSnapshot(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): PluginMetadataSnapshot {
  const config = params.config ?? {};
  const env = params.env ?? process.env;
  return resolvePluginMetadataSnapshot({
    config,
    env,
    ...(params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}),
    allowWorkspaceScopedCurrent: params.workspaceDir === undefined,
  });
}
