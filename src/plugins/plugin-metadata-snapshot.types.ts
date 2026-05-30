/** Shared types for plugin metadata snapshots used by control-plane lookups. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginDiscoveryResult } from "./discovery.js";
import type { InstalledPluginIndex } from "./installed-plugin-index-types.js";
import type { PluginManifestRecord, PluginManifestRegistry } from "./manifest-registry.js";
import type { PluginDiagnostic } from "./manifest-types.js";
import type { PluginRegistrySnapshotSource } from "./plugin-registry-snapshot.types.js";

/** Ownership maps from channel/provider/contract ids to plugin ids. */
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

/** Timing and size metrics captured while building a plugin metadata snapshot. */
export type PluginMetadataSnapshotMetrics = {
  registrySnapshotMs: number;
  manifestRegistryMs: number;
  ownerMapsMs: number;
  totalMs: number;
  indexPluginCount: number;
  manifestPluginCount: number;
};

/** Diagnostic explaining how persisted plugin registry data was used. */
export type PluginMetadataSnapshotRegistryDiagnostic = {
  level: "info" | "warn";
  code:
    | "persisted-registry-disabled"
    | "persisted-registry-missing"
    | "persisted-registry-stale-policy"
    | "persisted-registry-stale-source";
  message: string;
};

/** Process-stable plugin metadata snapshot for manifest and registry queries. */
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

/** Minimal snapshot view needed by manifest registry callers. */
export type PluginMetadataRegistryView = Pick<PluginMetadataSnapshot, "index" | "manifestRegistry">;

/** Minimal snapshot view needed by manifest contract callers. */
export type PluginMetadataManifestView = Pick<PluginMetadataSnapshot, "index" | "plugins">;

/** Inputs for building or loading a plugin metadata snapshot. */
export type LoadPluginMetadataSnapshotParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
  index?: InstalledPluginIndex;
  preferPersisted?: boolean;
};

/** Snapshot resolution inputs, including current-snapshot reuse controls. */
export type ResolvePluginMetadataSnapshotParams = LoadPluginMetadataSnapshotParams & {
  allowCurrent?: boolean;
  allowWorkspaceScopedCurrent?: boolean;
};
