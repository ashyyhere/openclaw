// plugins installed plugin index store path helpers and runtime behavior.
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";

const INSTALLED_PLUGIN_INDEX_STORE_PATH = path.join("plugins", "installs.json");

/** Shared type for Installed Plugin Index Store Options in src/plugins. */
export type InstalledPluginIndexStoreOptions = {
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  filePath?: string;
};

/** Reused helper for resolve Installed Plugin Index Store Path behavior in src/plugins. */
export function resolveInstalledPluginIndexStorePath(
  options: InstalledPluginIndexStoreOptions = {},
): string {
  if (options.filePath) {
    return options.filePath;
  }
  const env = options.env ?? process.env;
  const stateDir = options.stateDir ?? resolveStateDir(env);
  return path.join(stateDir, INSTALLED_PLUGIN_INDEX_STORE_PATH);
}
