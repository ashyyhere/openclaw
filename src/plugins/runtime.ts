// Process-local plugin registry runtime state for active, HTTP route, and
// channel surfaces.
import { onAgentEvent } from "../infra/agent-events.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import {
  clearPluginHostRuntimeState,
  dispatchPluginAgentEventSubscriptions,
} from "./host-hook-runtime.js";
import { clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle.js";
import { createEmptyPluginRegistry } from "./registry-empty.js";
import { markPluginRegistryActive, markPluginRegistryRetired } from "./registry-lifecycle.js";
import type { PluginRegistry } from "./registry-types.js";
import { getActivePluginChannelRegistrySnapshotFromState } from "./runtime-channel-state.js";
import {
  PLUGIN_REGISTRY_STATE,
  type RegistryState,
  type RegistrySurfaceState,
} from "./runtime-state.js";

const log = createSubsystemLogger("plugins/runtime");

function asPluginRegistry(registry: RegistryState["activeRegistry"]): PluginRegistry | null {
  return registry;
}

const state: RegistryState = (() => {
  const globalState = globalThis as typeof globalThis & {
    [PLUGIN_REGISTRY_STATE]?: RegistryState;
  };
  let registryState = globalState[PLUGIN_REGISTRY_STATE];
  if (!registryState) {
    registryState = {
      activeRegistry: null,
      activeVersion: 0,
      httpRoute: {
        registry: null,
        pinned: false,
        version: 0,
      },
      channel: {
        registry: null,
        pinned: false,
        version: 0,
      },
      agentEventBridgeUnsubscribe: undefined,
      key: null,
      workspaceDir: null,
      runtimeSubagentMode: "default",
      importedPluginIds: new Set<string>(),
    };
    globalState[PLUGIN_REGISTRY_STATE] = registryState;
  }
  return registryState;
})();

function registryHasPluginHostCleanupWork(registry: PluginRegistry | null): boolean {
  if (!registry) {
    return false;
  }
  return (
    registry.plugins.some((plugin) => plugin.status === "loaded") ||
    (registry.sessionExtensions?.length ?? 0) > 0 ||
    (registry.runtimeLifecycles?.length ?? 0) > 0 ||
    (registry.agentEventSubscriptions?.length ?? 0) > 0 ||
    (registry.sessionSchedulerJobs?.length ?? 0) > 0
  );
}

function isRegistryPinned(registry: PluginRegistry): boolean {
  return (
    (state.httpRoute.pinned && state.httpRoute.registry === registry) ||
    (state.channel.pinned && state.channel.registry === registry)
  );
}

function isRegistryLive(registry: PluginRegistry): boolean {
  return state.activeRegistry === registry || isRegistryPinned(registry);
}

async function cleanupPreviousPluginHostRegistry(params: {
  previousRegistry: PluginRegistry;
}): Promise<void> {
  const [{ getRuntimeConfig }, { cleanupReplacedPluginHostRegistry }] = await Promise.all([
    import("../config/config.js"),
    import("./host-hook-cleanup.js"),
  ]);
  const nextRegistry = asPluginRegistry(state.activeRegistry);
  if (!nextRegistry || nextRegistry === params.previousRegistry) {
    return;
  }
  // Async cleanup must not clear state for a registry that has been restored
  // active, but later swaps should not strand cleanup for the retiring registry.
  const shouldCleanup = () => state.activeRegistry !== params.previousRegistry;
  await cleanupReplacedPluginHostRegistry({
    cfg: getRuntimeConfig(),
    previousRegistry: params.previousRegistry,
    nextRegistry,
    shouldCleanup,
  });
}

function cleanupRetiredPluginHostRegistry(previousRegistry: PluginRegistry): void {
  if (!registryHasPluginHostCleanupWork(previousRegistry)) {
    return;
  }
  void cleanupPreviousPluginHostRegistry({
    previousRegistry,
  }).catch((error) => {
    log.warn(`plugin host registry cleanup failed: ${String(error)}`);
  });
}

function retirePluginRegistryIfUnused(registry: PluginRegistry | null): boolean {
  if (!registry || isRegistryLive(registry)) {
    return false;
  }
  markPluginRegistryRetired(registry);
  return true;
}

function collectLivePluginAgentEventRegistries(): PluginRegistry[] {
  const registries: PluginRegistry[] = [];
  const seen = new Set<PluginRegistry>();
  const addRegistry = (registry: PluginRegistry | null) => {
    if (!registry || seen.has(registry)) {
      return;
    }
    seen.add(registry);
    registries.push(registry);
  };
  addRegistry(asPluginRegistry(state.activeRegistry));
  addRegistry(asPluginRegistry(state.httpRoute.registry));
  addRegistry(asPluginRegistry(state.channel.registry));
  return registries;
}

function syncPluginAgentEventBridge(): void {
  state.agentEventBridgeUnsubscribe?.();
  state.agentEventBridgeUnsubscribe = undefined;
  if (collectLivePluginAgentEventRegistries().length === 0) {
    return;
  }
  state.agentEventBridgeUnsubscribe = onAgentEvent((event) => {
    for (const registry of collectLivePluginAgentEventRegistries()) {
      dispatchPluginAgentEventSubscriptions({ registry, event });
    }
  });
}

/** Records a plugin id whose runtime module was imported in this process. */
export function recordImportedPluginId(pluginId: string): void {
  state.importedPluginIds.add(pluginId);
}

function installSurfaceRegistry(
  surface: RegistrySurfaceState,
  registry: RegistryState["activeRegistry"],
  pinned: boolean,
) {
  if (surface.registry === registry && surface.pinned === pinned) {
    return;
  }
  surface.registry = registry;
  surface.pinned = pinned;
  surface.version += 1;
}

function syncTrackedSurface(
  surface: RegistrySurfaceState,
  registry: RegistryState["activeRegistry"],
  refreshVersion = false,
) {
  if (surface.pinned) {
    return;
  }
  if (surface.registry === registry && !surface.pinned) {
    if (refreshVersion) {
      surface.version += 1;
    }
    return;
  }
  installSurfaceRegistry(surface, registry, false);
}

/** Installs the active plugin registry and retires replaced registries when unused. */
export function setActivePluginRegistry(
  registry: PluginRegistry,
  cacheKey?: string,
  runtimeSubagentMode: "default" | "explicit" | "gateway-bindable" = "default",
  workspaceDir?: string,
) {
  const previousRegistry = asPluginRegistry(state.activeRegistry);
  state.activeRegistry = registry;
  markPluginRegistryActive(registry);
  state.activeVersion += 1;
  syncTrackedSurface(state.httpRoute, registry, true);
  syncTrackedSurface(state.channel, registry, true);
  state.key = cacheKey ?? null;
  state.workspaceDir = workspaceDir ?? null;
  state.runtimeSubagentMode = runtimeSubagentMode;
  syncPluginAgentEventBridge();
  if (!previousRegistry || previousRegistry === registry) {
    return;
  }
  if (!retirePluginRegistryIfUnused(previousRegistry)) {
    return;
  }
  cleanupRetiredPluginHostRegistry(previousRegistry);
}

/** Returns the current active registry without creating a fallback registry. */
export function getActivePluginRegistry(): PluginRegistry | null {
  return asPluginRegistry(state.activeRegistry);
}

/** Returns the workspace directory associated with the active registry. */
export function getActivePluginRegistryWorkspaceDir(): string | undefined {
  return state.workspaceDir ?? undefined;
}

/** Returns the active registry, creating an empty one for runtime callers if needed. */
export function requireActivePluginRegistry(): PluginRegistry {
  if (!state.activeRegistry) {
    state.activeRegistry = createEmptyPluginRegistry();
    markPluginRegistryActive(state.activeRegistry);
    state.activeVersion += 1;
    syncTrackedSurface(state.httpRoute, state.activeRegistry);
    syncTrackedSurface(state.channel, state.activeRegistry);
  }
  return asPluginRegistry(state.activeRegistry)!;
}

/** Pins a registry for HTTP route handling independently of active swaps. */
export function pinActivePluginHttpRouteRegistry(registry: PluginRegistry) {
  const previousRegistry = asPluginRegistry(state.httpRoute.registry);
  installSurfaceRegistry(state.httpRoute, registry, true);
  markPluginRegistryActive(registry);
  syncPluginAgentEventBridge();
  if (retirePluginRegistryIfUnused(previousRegistry)) {
    cleanupRetiredPluginHostRegistry(previousRegistry!);
  }
}

/** Releases the pinned HTTP route registry back to active-registry tracking. */
export function releasePinnedPluginHttpRouteRegistry(registry?: PluginRegistry) {
  if (registry && state.httpRoute.registry !== registry) {
    return;
  }
  const previousRegistry = asPluginRegistry(state.httpRoute.registry);
  installSurfaceRegistry(state.httpRoute, state.activeRegistry, false);
  syncPluginAgentEventBridge();
  if (retirePluginRegistryIfUnused(previousRegistry)) {
    cleanupRetiredPluginHostRegistry(previousRegistry!);
  }
}

/** Returns the registry used for plugin-owned HTTP routes. */
export function getActivePluginHttpRouteRegistry(): PluginRegistry | null {
  return asPluginRegistry(state.httpRoute.registry ?? state.activeRegistry);
}

/** Version token that changes when the HTTP route registry surface changes. */
export function getActivePluginHttpRouteRegistryVersion(): number {
  return state.httpRoute.registry ? state.httpRoute.version : state.activeVersion;
}

/** Returns the HTTP route registry, creating the active fallback if needed. */
export function requireActivePluginHttpRouteRegistry(): PluginRegistry {
  const existing = getActivePluginHttpRouteRegistry();
  if (existing) {
    return existing;
  }
  const created = requireActivePluginRegistry();
  installSurfaceRegistry(state.httpRoute, created, false);
  return created;
}

/** Chooses the route registry, falling back when the active snapshot has no routes. */
export function resolveActivePluginHttpRouteRegistry(fallback: PluginRegistry): PluginRegistry {
  const routeRegistry = getActivePluginHttpRouteRegistry();
  if (!routeRegistry) {
    return fallback;
  }
  if (state.httpRoute.pinned) {
    return routeRegistry;
  }
  const routeCount = routeRegistry.httpRoutes?.length ?? 0;
  const fallbackRouteCount = fallback.httpRoutes?.length ?? 0;
  if (routeCount === 0 && fallbackRouteCount > 0) {
    return fallback;
  }
  return routeRegistry;
}

/** Pins a registry for channel dispatch independently of active swaps. */
export function pinActivePluginChannelRegistry(registry: PluginRegistry) {
  const previousRegistry = asPluginRegistry(state.channel.registry);
  installSurfaceRegistry(state.channel, registry, true);
  markPluginRegistryActive(registry);
  syncPluginAgentEventBridge();
  if (retirePluginRegistryIfUnused(previousRegistry)) {
    cleanupRetiredPluginHostRegistry(previousRegistry!);
  }
}

/** Releases the pinned channel registry back to active-registry tracking. */
export function releasePinnedPluginChannelRegistry(registry?: PluginRegistry) {
  if (registry && state.channel.registry !== registry) {
    return;
  }
  const previousRegistry = asPluginRegistry(state.channel.registry);
  installSurfaceRegistry(state.channel, state.activeRegistry, false);
  syncPluginAgentEventBridge();
  if (retirePluginRegistryIfUnused(previousRegistry)) {
    cleanupRetiredPluginHostRegistry(previousRegistry!);
  }
}

/** Returns the registry snapshot used by channel dispatch. */
export function getActivePluginChannelRegistry(): PluginRegistry | null {
  return getActivePluginChannelRegistrySnapshotFromState().registry as PluginRegistry | null;
}

/** Version token that changes when the channel registry surface changes. */
export function getActivePluginChannelRegistryVersion(): number {
  return getActivePluginChannelRegistrySnapshotFromState().version;
}

/** Returns the channel registry, creating the active fallback if needed. */
export function requireActivePluginChannelRegistry(): PluginRegistry {
  const existing = getActivePluginChannelRegistry();
  if (existing) {
    return existing;
  }
  const created = requireActivePluginRegistry();
  installSurfaceRegistry(state.channel, created, false);
  return created;
}

/** Cache key associated with the currently active registry build. */
export function getActivePluginRegistryKey(): string | null {
  return state.key;
}

/** Runtime subagent mode selected when the active registry was installed. */
export function getActivePluginRuntimeSubagentMode(): "default" | "explicit" | "gateway-bindable" {
  return state.runtimeSubagentMode;
}

/** Monotonic version token for active-registry replacements. */
export function getActivePluginRegistryVersion(): number {
  return state.activeVersion;
}

function collectLoadedPluginIds(
  registry: PluginRegistry | null | undefined,
  ids: Set<string>,
): void {
  if (!registry) {
    return;
  }
  for (const plugin of registry.plugins) {
    if (plugin.status === "loaded" && plugin.format !== "bundle") {
      ids.add(plugin.id);
    }
  }
}

/**
 * Returns plugin ids that were imported by plugin runtime or registry loading in
 * the current process.
 *
 * This is a process-level view, not a fresh import trace: cached registry reuse
 * still counts because the plugin code was loaded earlier in this process.
 * Explicit loader import tracking covers plugins that were imported but later
 * ended in an error state during registration.
 * Bundle-format plugins are excluded because they can be "loaded" from metadata
 * without importing any JS entrypoint.
 */
export function listImportedRuntimePluginIds(): string[] {
  const imported = new Set(state.importedPluginIds);
  collectLoadedPluginIds(asPluginRegistry(state.activeRegistry), imported);
  collectLoadedPluginIds(asPluginRegistry(state.channel.registry), imported);
  collectLoadedPluginIds(asPluginRegistry(state.httpRoute.registry), imported);
  return [...imported].toSorted((left, right) => left.localeCompare(right));
}

/** Clears plugin runtime globals and lifecycle caches for isolated tests. */
export function resetPluginRuntimeStateForTest(): void {
  state.activeRegistry = null;
  state.activeVersion += 1;
  installSurfaceRegistry(state.httpRoute, null, false);
  installSurfaceRegistry(state.channel, null, false);
  state.key = null;
  state.workspaceDir = null;
  state.runtimeSubagentMode = "default";
  state.importedPluginIds.clear();
  syncPluginAgentEventBridge();
  // Also clear the plugin host-hook runtime singleton (run context map,
  // scheduler-job records, pending agent-event handlers, closedRunIds set).
  // Otherwise per-test bleed-over of those globals can cause flaky behavior
  // since this helper is widely used across plugin/agent tests.
  clearPluginHostRuntimeState();
  clearPluginMetadataLifecycleCaches();
}
