// Runtime boundary for plugins text transforms runtime behavior.
import { mergePluginTextTransforms } from "../agents/plugin-text-transforms.js";
import { getActiveRuntimePluginRegistry } from "./active-runtime-registry.js";
import type { PluginTextTransforms } from "./types.js";

/** Reused helper for resolve Runtime Text Transforms behavior in src/plugins. */
export function resolveRuntimeTextTransforms(): PluginTextTransforms | undefined {
  const registry = getActiveRuntimePluginRegistry();
  const pluginTextTransforms = Array.isArray(registry?.textTransforms)
    ? registry.textTransforms.map((entry) => entry.transforms)
    : [];
  return mergePluginTextTransforms(...pluginTextTransforms);
}
