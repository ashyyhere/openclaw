/** Normalizes plugin install records from hooks and package specs. */
import type { HookInstallRecord } from "../config/types.hooks.js";
import type { PluginInstallRecord } from "../config/types.plugins.js";
import { parseRegistryNpmSpec } from "../infra/npm-registry-spec.js";

/** Reused helper for extract Installed Npm Package Name behavior in src/cli. */
export function extractInstalledNpmPackageName(install: PluginInstallRecord): string | undefined {
  if (install.source !== "npm") {
    return undefined;
  }
  const resolvedName = install.resolvedName?.trim();
  if (resolvedName) {
    return resolvedName;
  }
  return (
    (install.spec ? parseRegistryNpmSpec(install.spec)?.name : undefined) ??
    (install.resolvedSpec ? parseRegistryNpmSpec(install.resolvedSpec)?.name : undefined)
  );
}

/** Reused helper for extract Installed Npm Hook Package Name behavior in src/cli. */
export function extractInstalledNpmHookPackageName(install: HookInstallRecord): string | undefined {
  const resolvedName = install.resolvedName?.trim();
  if (resolvedName) {
    return resolvedName;
  }
  return (
    (install.spec ? parseRegistryNpmSpec(install.spec)?.name : undefined) ??
    (install.resolvedSpec ? parseRegistryNpmSpec(install.resolvedSpec)?.name : undefined)
  );
}
