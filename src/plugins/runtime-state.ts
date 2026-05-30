/** Global runtime plugin registry state shared across plugin surfaces. */
import type { PluginRegistry } from "./registry-types.js";

/** Global symbol used to store process-local plugin registry state. */
export const PLUGIN_REGISTRY_STATE = Symbol.for("openclaw.pluginRegistryState");

/** Registry shape tracked by process-local plugin runtime state. */
export type RuntimeTrackedPluginRegistry = PluginRegistry;

/** Registry instance currently pinned for one runtime surface. */
export type RegistrySurfaceState = {
  registry: RuntimeTrackedPluginRegistry | null;
  pinned: boolean;
  version: number;
};

/** Process-global plugin registry state for HTTP, channel, and active surfaces. */
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

/** Reads process-global plugin registry state when initialized. */
export function getPluginRegistryState(): RegistryState | undefined {
  return (globalThis as GlobalRegistryState)[PLUGIN_REGISTRY_STATE];
}

/** Returns the channel registry, falling back to the active registry. */
export function getActivePluginChannelRegistryFromState(): RuntimeTrackedPluginRegistry | null {
  const state = getPluginRegistryState();
  return state?.channel.registry ?? state?.activeRegistry ?? null;
}

/** Returns the workspace dir associated with the active plugin registry state. */
export function getActivePluginRegistryWorkspaceDirFromState(): string | undefined {
  const state = getPluginRegistryState();
  return state?.workspaceDir ?? undefined;
}
