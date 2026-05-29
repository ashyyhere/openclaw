// plugins runtime state helpers and runtime behavior.
import type { PluginRegistry } from "./registry-types.js";

/** Reused constant for PLUGIN REGISTRY STATE behavior in src/plugins. */
export const PLUGIN_REGISTRY_STATE = Symbol.for("openclaw.pluginRegistryState");

/** Shared type for Runtime Tracked Plugin Registry in src/plugins. */
export type RuntimeTrackedPluginRegistry = PluginRegistry;

/** Shared type for Registry Surface State in src/plugins. */
export type RegistrySurfaceState = {
  registry: RuntimeTrackedPluginRegistry | null;
  pinned: boolean;
  version: number;
};

/** Shared type for Registry State in src/plugins. */
export type RegistryState = {
  activeRegistry: RuntimeTrackedPluginRegistry | null;
  activeVersion: number;
  httpRoute: RegistrySurfaceState;
  channel: RegistrySurfaceState;
  agentEventBridgeUnsubscribe?: (() => void) | undefined;
  key: string | null;
  workspaceDir: string | null;
  runtimeSubagentMode: "default" | "explicit" | "gateway-bindable";
  importedPluginIds: Set<string>;
};

type GlobalRegistryState = typeof globalThis & {
  [PLUGIN_REGISTRY_STATE]?: RegistryState;
};

/** Reused helper for get Plugin Registry State behavior in src/plugins. */
export function getPluginRegistryState(): RegistryState | undefined {
  return (globalThis as GlobalRegistryState)[PLUGIN_REGISTRY_STATE];
}

/** Reused helper for get Active Plugin Channel Registry From State behavior in src/plugins. */
export function getActivePluginChannelRegistryFromState(): RuntimeTrackedPluginRegistry | null {
  const state = getPluginRegistryState();
  return state?.channel.registry ?? state?.activeRegistry ?? null;
}

/** Reused helper for get Active Plugin Registry Workspace Dir From State behavior in src/plugins. */
export function getActivePluginRegistryWorkspaceDirFromState(): string | undefined {
  const state = getPluginRegistryState();
  return state?.workspaceDir ?? undefined;
}
