// plugins registry lifecycle helpers and runtime behavior.
import type { PluginRegistry } from "./registry-types.js";

const retiredRegistries = new WeakSet<PluginRegistry>();
const activatedRegistries = new WeakSet<PluginRegistry>();

/** Reused helper for mark Plugin Registry Retired behavior in src/plugins. */
export function markPluginRegistryRetired(registry: PluginRegistry | null | undefined): void {
  if (registry) {
    retiredRegistries.add(registry);
  }
}

/** Reused helper for mark Plugin Registry Active behavior in src/plugins. */
export function markPluginRegistryActive(registry: PluginRegistry | null | undefined): void {
  if (registry) {
    activatedRegistries.add(registry);
    retiredRegistries.delete(registry);
  }
}

/** Reused helper for is Plugin Registry Activated behavior in src/plugins. */
export function isPluginRegistryActivated(registry: PluginRegistry): boolean {
  return activatedRegistries.has(registry);
}

/** Reused helper for is Plugin Registry Retired behavior in src/plugins. */
export function isPluginRegistryRetired(registry: PluginRegistry): boolean {
  return retiredRegistries.has(registry);
}
