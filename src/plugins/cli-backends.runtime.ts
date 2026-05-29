// Runtime boundary for plugins cli backends runtime behavior.
import { getActiveRuntimePluginRegistry } from "./active-runtime-registry.js";
import type { CliBackendPlugin } from "./cli-backend.types.js";

/** Shared type for Plugin Cli Backend Entry in src/plugins. */
export type PluginCliBackendEntry = CliBackendPlugin & {
  pluginId: string;
};

/** Reused helper for resolve Runtime Cli Backends behavior in src/plugins. */
export function resolveRuntimeCliBackends(): PluginCliBackendEntry[] {
  return (getActiveRuntimePluginRegistry()?.cliBackends ?? []).map((entry) =>
    Object.assign({}, entry.backend, { pluginId: entry.pluginId }),
  );
}
