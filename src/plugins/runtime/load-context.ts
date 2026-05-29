// plugins/runtime load context helpers and runtime behavior.
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../../agents/agent-scope.js";
import { getRuntimeConfig } from "../../config/config.js";
import { applyPluginAutoEnable } from "../../config/plugin-auto-enable.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginInstallRecord } from "../../config/types.plugins.js";
import { createSubsystemLogger } from "../../logging.js";
import { resolvePluginActivationSourceConfig } from "../activation-source-config.js";
import {
  clearCurrentPluginMetadataSnapshot,
  isReusableCurrentPluginMetadataSnapshot,
  setCurrentPluginMetadataSnapshot,
} from "../current-plugin-metadata-snapshot.js";
import { extractPluginInstallRecordsFromInstalledPluginIndex } from "../installed-plugin-index-install-records.js";
import type { PluginLoadOptions } from "../loader.js";
import type { PluginManifestRegistry } from "../manifest-registry.js";
import { resolvePluginMetadataSnapshot } from "../plugin-metadata-snapshot.js";
import type { PluginLogger } from "../types.js";

const log = createSubsystemLogger("plugins");

/** Shared type for Plugin Runtime Load Context in src/plugins/runtime. */
export type PluginRuntimeLoadContext = {
  rawConfig: OpenClawConfig;
  config: OpenClawConfig;
  activationSourceConfig: OpenClawConfig;
  autoEnabledReasons: Readonly<Record<string, string[]>>;
  workspaceDir: string | undefined;
  env: NodeJS.ProcessEnv;
  logger: PluginLogger;
  manifestRegistry?: PluginManifestRegistry;
  installRecords?: Record<string, PluginInstallRecord>;
};

/** Shared type for Plugin Runtime Resolved Load Values in src/plugins/runtime. */
export type PluginRuntimeResolvedLoadValues = Pick<
  PluginLoadOptions,
  | "config"
  | "activationSourceConfig"
  | "autoEnabledReasons"
  | "workspaceDir"
  | "env"
  | "logger"
  | "manifestRegistry"
  | "installRecords"
>;

/** Shared type for Plugin Runtime Load Context Options in src/plugins/runtime. */
export type PluginRuntimeLoadContextOptions = {
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  logger?: PluginLogger;
  manifestRegistry?: PluginManifestRegistry;
};

/** Reused helper for create Plugin Runtime Loader Logger behavior in src/plugins/runtime. */
export function createPluginRuntimeLoaderLogger(): PluginLogger {
  return {
    info: (message) => log.info(message),
    warn: (message) => log.warn(message),
    error: (message) => log.error(message),
    debug: (message) => log.debug(message),
  };
}

/** Reused helper for resolve Plugin Runtime Load Context behavior in src/plugins/runtime. */
export function resolvePluginRuntimeLoadContext(
  options?: PluginRuntimeLoadContextOptions,
): PluginRuntimeLoadContext {
  const env = options?.env ?? process.env;
  const rawConfig = options?.config ?? getRuntimeConfig();
  const rawWorkspaceDir =
    options?.workspaceDir ?? resolveAgentWorkspaceDir(rawConfig, resolveDefaultAgentId(rawConfig));
  const metadataSnapshot = options?.manifestRegistry
    ? undefined
    : resolvePluginMetadataSnapshot({
        config: rawConfig,
        env,
        workspaceDir: rawWorkspaceDir,
        allowWorkspaceScopedCurrent: true,
      });
  const manifestRegistry = options?.manifestRegistry ?? metadataSnapshot?.manifestRegistry;
  const installRecords = metadataSnapshot
    ? extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index)
    : undefined;
  const activationSourceConfig = resolvePluginActivationSourceConfig({
    config: rawConfig,
    activationSourceConfig: options?.activationSourceConfig,
  });
  const autoEnabled = applyPluginAutoEnable({
    config: rawConfig,
    env,
    manifestRegistry,
    discovery: metadataSnapshot?.discovery,
  });
  const config = autoEnabled.config;
  const workspaceDir =
    options?.workspaceDir ?? resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
  if (metadataSnapshot) {
    if (isReusableCurrentPluginMetadataSnapshot(metadataSnapshot)) {
      setCurrentPluginMetadataSnapshot(metadataSnapshot, {
        config: rawConfig,
        compatibleConfigs: [config, activationSourceConfig],
        env,
        workspaceDir,
      });
    } else {
      clearCurrentPluginMetadataSnapshot();
    }
  }
  return {
    rawConfig,
    config,
    activationSourceConfig,
    autoEnabledReasons: autoEnabled.autoEnabledReasons,
    workspaceDir,
    env,
    logger: options?.logger ?? createPluginRuntimeLoaderLogger(),
    manifestRegistry,
    installRecords,
  };
}

/** Reused helper for build Plugin Runtime Load Options behavior in src/plugins/runtime. */
export function buildPluginRuntimeLoadOptions(
  context: PluginRuntimeLoadContext,
  overrides?: Partial<PluginLoadOptions>,
): PluginLoadOptions {
  return buildPluginRuntimeLoadOptionsFromValues(context, overrides);
}

/** Reused helper for build Plugin Runtime Load Options From Values behavior in src/plugins/runtime. */
export function buildPluginRuntimeLoadOptionsFromValues(
  values: PluginRuntimeResolvedLoadValues,
  overrides?: Partial<PluginLoadOptions>,
): PluginLoadOptions {
  return {
    config: values.config,
    activationSourceConfig: values.activationSourceConfig,
    autoEnabledReasons: values.autoEnabledReasons,
    workspaceDir: values.workspaceDir,
    env: values.env,
    logger: values.logger,
    manifestRegistry: values.manifestRegistry,
    installRecords: values.installRecords,
    ...overrides,
  };
}
