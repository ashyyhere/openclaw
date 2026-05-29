// gateway server agent gateway server agent mocks helpers and runtime behavior.
import { vi } from "vitest";
import { createEmptyPluginRegistry, type PluginRegistry } from "../plugins/registry.js";
import { setActivePluginRegistry } from "../plugins/runtime.js";
import { setTestPluginRegistry } from "./test-helpers.plugin-registry.js";

/** Reused constant for registry State behavior in src/gateway. */
export const registryState: { registry: PluginRegistry } = {
  registry: createEmptyPluginRegistry(),
};

/** Reused helper for set Registry behavior in src/gateway. */
export function setRegistry(registry: PluginRegistry) {
  registryState.registry = registry;
  setTestPluginRegistry(registry);
  setActivePluginRegistry(registry);
}

vi.mock("./server-plugins.js", async () => {
  const actual = await vi.importActual<typeof import("./server-plugins.js")>("./server-plugins.js");
  const { setActivePluginRegistry } = await import("../plugins/runtime.js");
  return {
    ...actual,
    loadGatewayPlugins: (params: { baseMethods: string[] }) => {
      setActivePluginRegistry(registryState.registry);
      return {
        pluginRegistry: registryState.registry,
        gatewayMethods: params.baseMethods ?? [],
      };
    },
    setFallbackGatewayContextResolver: vi.fn(),
  };
});
