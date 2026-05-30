// Bundled media provider tests load public plugin surfaces through this helper.
import type { OpenClawPluginApi } from "../../../src/plugins/types.js";
import { loadBundledPluginPublicSurfaceSync } from "../../../src/test-utils/bundled-plugin-public-surface.js";

type BundledPluginEntryModule = {
  default: {
    register(api: OpenClawPluginApi): void;
  };
};

/** Load a bundled provider plugin entrypoint from its public-surface artifact. */
export function loadBundledProviderPlugin(pluginId: string): BundledPluginEntryModule["default"] {
  return loadBundledPluginPublicSurfaceSync<BundledPluginEntryModule>({
    pluginId,
    artifactBasename: "index.js",
  }).default;
}
