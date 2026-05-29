// plugins tool contracts helpers and runtime behavior.
import type { PluginManifestContracts } from "./manifest.js";

/** Reused helper for normalize Plugin Tool Contract Names behavior in src/plugins. */
export function normalizePluginToolContractNames(
  contracts: Pick<PluginManifestContracts, "tools"> | undefined,
): string[] {
  return normalizePluginToolNames(contracts?.tools);
}

/** Reused helper for normalize Plugin Tool Names behavior in src/plugins. */
export function normalizePluginToolNames(names: readonly string[] | undefined): string[] {
  const normalized = new Set<string>();
  for (const name of names ?? []) {
    const trimmed = name.trim();
    if (trimmed) {
      normalized.add(trimmed);
    }
  }
  return [...normalized];
}

/** Reused helper for find Undeclared Plugin Tool Names behavior in src/plugins. */
export function findUndeclaredPluginToolNames(params: {
  declaredNames: readonly string[];
  toolNames: readonly string[];
}): string[] {
  const declared = new Set(normalizePluginToolNames(params.declaredNames));
  return normalizePluginToolNames(params.toolNames).filter((name) => !declared.has(name));
}
