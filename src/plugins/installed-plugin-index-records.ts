// Helpers for reading, writing, and projecting install records through the plugin index.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginInstallRecord } from "../config/types.plugins.js";
import {
  clearLoadInstalledPluginIndexInstallRecordsCache,
  loadInstalledPluginIndexInstallRecords,
  loadInstalledPluginIndexInstallRecordsSync,
  readPersistedInstalledPluginIndexInstallRecords,
  readPersistedInstalledPluginIndexInstallRecordsSync,
} from "./installed-plugin-index-record-reader.js";
import { resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-store-path.js";
import {
  refreshPersistedInstalledPluginIndex,
  refreshPersistedInstalledPluginIndexSync,
} from "./installed-plugin-index-store.js";
import { type RefreshInstalledPluginIndexParams } from "./installed-plugin-index.js";
import { recordPluginInstall, type PluginInstallUpdate } from "./installs.js";

/** Install-record readers and cache reset shared by plugin setup and discovery paths. */
export {
  clearLoadInstalledPluginIndexInstallRecordsCache,
  loadInstalledPluginIndexInstallRecords,
  loadInstalledPluginIndexInstallRecordsSync,
  readPersistedInstalledPluginIndexInstallRecords,
  readPersistedInstalledPluginIndexInstallRecordsSync,
};

/** Config path where legacy plugin install records are projected when needed. */
export const PLUGIN_INSTALLS_CONFIG_PATH = ["plugins", "installs"] as const;

/** Options for locating the persisted installed-plugin index that stores install records. */
export type InstalledPluginIndexRecordStoreOptions = {
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  filePath?: string;
};

type InstalledPluginIndexRecordRefreshOptions = InstalledPluginIndexRecordStoreOptions &
  Partial<Omit<RefreshInstalledPluginIndexParams, "reason" | "installRecords">> & {
    now?: () => Date;
  };

/** Resolves the shared plugin index path used as the install-record backing store. */
export function resolveInstalledPluginIndexRecordsStorePath(
  options: InstalledPluginIndexRecordStoreOptions = {},
): string {
  return resolveInstalledPluginIndexStorePath(options);
}

/** Rewrites persisted install records by refreshing the plugin index with source-changed reason. */
export async function writePersistedInstalledPluginIndexInstallRecords(
  records: Record<string, PluginInstallRecord>,
  options: InstalledPluginIndexRecordRefreshOptions = {},
): Promise<string> {
  await refreshPersistedInstalledPluginIndex({
    ...options,
    reason: "source-changed",
    installRecords: records,
  });
  return resolveInstalledPluginIndexRecordsStorePath(options);
}

/** Synchronous install-record writer for setup paths that update the plugin index inline. */
export function writePersistedInstalledPluginIndexInstallRecordsSync(
  records: Record<string, PluginInstallRecord>,
  options: InstalledPluginIndexRecordRefreshOptions = {},
): string {
  refreshPersistedInstalledPluginIndexSync({
    ...options,
    reason: "source-changed",
    installRecords: records,
  });
  return resolveInstalledPluginIndexRecordsStorePath(options);
}

/** Returns a config copy with plugin install records projected into plugins.installs. */
export function withPluginInstallRecords(
  config: OpenClawConfig,
  records: Record<string, PluginInstallRecord>,
): OpenClawConfig {
  return {
    ...config,
    plugins: {
      ...config.plugins,
      installs: records,
    },
  };
}

/** Returns a config copy with projected plugin install records removed. */
export function withoutPluginInstallRecords(config: OpenClawConfig): OpenClawConfig {
  if (!config.plugins?.installs) {
    return config;
  }
  const { installs: _installs, ...plugins } = config.plugins;
  if (Object.keys(plugins).length === 0) {
    const { plugins: _plugins, ...rest } = config;
    return rest;
  }
  return {
    ...config,
    plugins,
  };
}

/** Applies one install update to an install-record map using the canonical config updater. */
export function recordPluginInstallInRecords(
  records: Record<string, PluginInstallRecord>,
  update: PluginInstallUpdate,
): Record<string, PluginInstallRecord> {
  return recordPluginInstall({ plugins: { installs: records } }, update).plugins?.installs ?? {};
}

/** Removes one plugin install record from a record map without mutating the input. */
export function removePluginInstallRecordFromRecords(
  records: Record<string, PluginInstallRecord>,
  pluginId: string,
): Record<string, PluginInstallRecord> {
  const { [pluginId]: _removed, ...rest } = records;
  return rest;
}
