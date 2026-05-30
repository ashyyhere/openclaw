import type { OpenClawConfig } from "../config/types.openclaw.js";
import { loggingState } from "../logging/state.js";
import { createLazyImportLoader } from "../shared/lazy-promise.js";
import type { CliPluginRegistryScope } from "./command-catalog.js";

const pluginRegistryModuleLoader = createLazyImportLoader(() => import("./plugin-registry.js"));

function loadPluginRegistryModule() {
  return pluginRegistryModuleLoader.load();
}

/** Scope that determines which plugin commands are loaded into the CLI registry. */
export type CliPluginRegistryLoadPolicy = {
  scope: CliPluginRegistryScope;
};

/** Load the plugin registry once while optionally routing plugin diagnostics to stderr. */
export async function ensureCliPluginRegistryLoaded(params: {
  scope: CliPluginRegistryScope;
  routeLogsToStderr?: boolean;
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
}) {
  const { ensurePluginRegistryLoaded } = await loadPluginRegistryModule();
  const previousForceStderr = loggingState.forceConsoleToStderr;
  if (params.routeLogsToStderr) {
    loggingState.forceConsoleToStderr = true;
  }
  try {
    ensurePluginRegistryLoaded({
      scope: params.scope,
      ...(params.config ? { config: params.config } : {}),
      ...(params.activationSourceConfig
        ? { activationSourceConfig: params.activationSourceConfig }
        : {}),
    });
  } finally {
    loggingState.forceConsoleToStderr = previousForceStderr;
  }
}
