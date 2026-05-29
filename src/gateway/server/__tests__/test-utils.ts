// gateway/server/__tests__ test utils helpers and runtime behavior.
import { createEmptyPluginRegistry, type PluginRegistry } from "../../../plugins/registry.js";

/** Reused constant for create Test Registry behavior in src/gateway/server. */
export const createTestRegistry = (overrides: Partial<PluginRegistry> = {}): PluginRegistry => {
  const merged = { ...createEmptyPluginRegistry(), ...overrides };
  return {
    ...merged,
    gatewayHandlers: merged.gatewayHandlers ?? {},
    httpRoutes: merged.httpRoutes ?? [],
  };
};
