// Shared types for plugins plugin metadata snapshot types behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginDiscoveryResult } from "./discovery.js";
import type { InstalledPluginIndex } from "./installed-plugin-index-types.js";
import type { PluginManifestRecord, PluginManifestRegistry } from "./manifest-registry.js";
import type { PluginDiagnostic } from "./manifest-types.js";
import type { PluginRegistrySnapshotSource } from "./plugin-registry-snapshot.types.js";

/** Shared type for Plugin Metadata Snapshot Owner Maps in src/plugins. */
export type PluginMetadataSnapshotOwnerMaps = {
  channels: ReadonlyMap<string, readonly string[]>;
  channelConfigs: ReadonlyMap<string, readonly string[]>;
  providers: ReadonlyMap<string, readonly string[]>;
  modelCatalogProviders: ReadonlyMap<string, readonly string[]>;
  cliBackends: ReadonlyMap<string, readonly string[]>;
  setupProviders: ReadonlyMap<string, readonly string[]>;
  commandAliases: ReadonlyMap<string, readonly string[]>;
  contracts: ReadonlyMap<string, readonly string[]>;
};

/** Shared type for Plugin Metadata Snapshot Metrics in src/plugins. */
export type PluginMetadataSnapshotMetrics = {
  registrySnapshotMs: number;
  manifestRegistryMs: number;
  ownerMapsMs: number;
  totalMs: number;
  indexPluginCount: number;
  manifestPluginCount: number;
};

/** Shared type for Plugin Metadata Snapshot Registry Diagnostic in src/plugins. */
export type PluginMetadataSnapshotRegistryDiagnostic = {
  level: "info" | "warn";
  code:
    | "persisted-registry-disabled"
    | "persisted-registry-missing"
    | "persisted-registry-stale-policy"
    | "persisted-registry-stale-source";
  message: string;
};

/** Shared type for Plugin Metadata Snapshot in src/plugins. */
export type PluginMetadataSnapshot = {
  policyHash: string;
  configFingerprint?: string;
  registrySource?: PluginRegistrySnapshotSource;
  workspaceDir?: string;
  index: InstalledPluginIndex;
  registryDiagnostics: readonly PluginMetadataSnapshotRegistryDiagnostic[];
  manifestRegistry: PluginManifestRegistry;
  plugins: readonly PluginManifestRecord[];
  diagnostics: readonly PluginDiagnostic[];
  byPluginId: ReadonlyMap<string, PluginManifestRecord>;
  normalizePluginId: (pluginId: string) => string;
  owners: PluginMetadataSnapshotOwnerMaps;
  metrics: PluginMetadataSnapshotMetrics;
  discovery?: PluginDiscoveryResult;
};

/** Shared type for Plugin Metadata Registry View in src/plugins. */
export type PluginMetadataRegistryView = Pick<PluginMetadataSnapshot, "index" | "manifestRegistry">;

/** Shared type for Plugin Metadata Manifest View in src/plugins. */
export type PluginMetadataManifestView = Pick<PluginMetadataSnapshot, "index" | "plugins">;

/** Shared type for Load Plugin Metadata Snapshot Params in src/plugins. */
export type LoadPluginMetadataSnapshotParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
  index?: InstalledPluginIndex;
  preferPersisted?: boolean;
};

/** Shared type for Resolve Plugin Metadata Snapshot Params in src/plugins. */
export type ResolvePluginMetadataSnapshotParams = LoadPluginMetadataSnapshotParams & {
  allowCurrent?: boolean;
  allowWorkspaceScopedCurrent?: boolean;
};
