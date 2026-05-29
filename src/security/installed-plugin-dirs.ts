// security installed plugin dirs helpers and runtime behavior.
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

const IGNORED_INSTALLED_PLUGIN_DIR_NAMES = new Set(["node_modules", ".openclaw-install-backups"]);

/** Reused helper for should Ignore Installed Plugin Dir Name behavior in src/security. */
export function shouldIgnoreInstalledPluginDirName(name: string): boolean {
  const normalized = normalizeOptionalLowercaseString(name);
  if (!normalized) {
    return true;
  }
  if (IGNORED_INSTALLED_PLUGIN_DIR_NAMES.has(normalized)) {
    return true;
  }
  if (normalized.startsWith(".")) {
    return true;
  }
  if (normalized.endsWith(".bak")) {
    return true;
  }
  if (normalized.includes(".backup-")) {
    return true;
  }
  if (normalized.includes(".disabled")) {
    return true;
  }
  return false;
}
