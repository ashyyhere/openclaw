// Shared types for plugins hook registry types behavior.
import type { HookEntry } from "../hooks/types.js";
import type { PluginHookRegistration as TypedPluginHookRegistration } from "./hook-types.js";

/** Shared type for Plugin Legacy Hook Registration in src/plugins. */
export type PluginLegacyHookRegistration = {
  pluginId: string;
  entry: HookEntry;
  events: string[];
  source: string;
  rootDir?: string;
};

/** Shared type for Hook Runner Registry in src/plugins. */
export type HookRunnerRegistry = {
  hooks: PluginLegacyHookRegistration[];
  typedHooks: TypedPluginHookRegistration[];
};

/** Shared type for Global Hook Runner Registry in src/plugins. */
export type GlobalHookRunnerRegistry = HookRunnerRegistry & {
  plugins: Array<{
    id: string;
    status: "loaded" | "disabled" | "error";
  }>;
};
