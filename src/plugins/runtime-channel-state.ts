// plugins runtime channel state helpers and runtime behavior.
import type { ActivePluginChannelRegistry } from "./channel-registry-state.types.js";

/** Reused constant for PLUGIN REGISTRY STATE behavior in src/plugins. */
export const PLUGIN_REGISTRY_STATE = Symbol.for("openclaw.pluginRegistryState");

type GlobalChannelRegistryState = typeof globalThis & {
  [PLUGIN_REGISTRY_STATE]?: {
    activeVersion?: number;
    activeRegistry?: ActivePluginChannelRegistry | null;
    channel?: {
      registry: ActivePluginChannelRegistry | null;
      version?: number;
    };
  };
};

type GlobalChannelRegistryRuntimeState = GlobalChannelRegistryState[typeof PLUGIN_REGISTRY_STATE];

/** Shared type for Active Plugin Channel Registry Snapshot in src/plugins. */
export type ActivePluginChannelRegistrySnapshot = {
  registry: ActivePluginChannelRegistry | null;
  version: number;
};

let activePluginChannelRegistrySnapshot:
  | {
      state: GlobalChannelRegistryRuntimeState;
      pinnedRegistry: ActivePluginChannelRegistry | null;
      activeRegistry: ActivePluginChannelRegistry | null;
      pinnedChannelCount: number;
      activeChannelCount: number;
      snapshot: ActivePluginChannelRegistrySnapshot;
    }
  | undefined;

function countChannels(registry: ActivePluginChannelRegistry | null | undefined): number {
  return registry?.channels?.length ?? 0;
}

/** Reused helper for get Active Plugin Channel Registry Snapshot From State behavior in src/plugins. */
export function getActivePluginChannelRegistrySnapshotFromState(): ActivePluginChannelRegistrySnapshot {
  const state = (globalThis as GlobalChannelRegistryState)[PLUGIN_REGISTRY_STATE];
  const pinnedRegistry = state?.channel?.registry ?? null;
  const activeRegistry = state?.activeRegistry ?? null;
  const pinnedChannelCount = countChannels(pinnedRegistry);
  const activeChannelCount = countChannels(activeRegistry);
  const selectedPinnedRegistry =
    pinnedChannelCount > 0 || (pinnedRegistry !== null && activeChannelCount === 0);
  const version = selectedPinnedRegistry
    ? (state?.channel?.version ?? 0)
    : (state?.activeVersion ?? 0);
  const cached = activePluginChannelRegistrySnapshot;
  if (
    cached &&
    cached.state === state &&
    cached.pinnedRegistry === pinnedRegistry &&
    cached.activeRegistry === activeRegistry &&
    cached.pinnedChannelCount === pinnedChannelCount &&
    cached.activeChannelCount === activeChannelCount &&
    cached.snapshot.version === version
  ) {
    return cached.snapshot;
  }
  const registry = selectedPinnedRegistry ? pinnedRegistry : activeRegistry;
  const snapshot = { registry, version };
  activePluginChannelRegistrySnapshot = {
    state,
    pinnedRegistry,
    activeRegistry,
    pinnedChannelCount,
    activeChannelCount,
    snapshot,
  };
  return snapshot;
}

/** Reused helper for get Active Plugin Channel Registry From State behavior in src/plugins. */
export function getActivePluginChannelRegistryFromState(): ActivePluginChannelRegistry | null {
  return getActivePluginChannelRegistrySnapshotFromState().registry;
}

/** Reused helper for get Active Plugin Channel Registry Version From State behavior in src/plugins. */
export function getActivePluginChannelRegistryVersionFromState(): number {
  return getActivePluginChannelRegistrySnapshotFromState().version;
}
