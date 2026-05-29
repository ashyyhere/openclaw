// Narrow plugin-sdk surface for the bundled phone-control plugin.
// Keep this list additive and scoped to the bundled phone-control surface.

/** Re-exported API for src/plugin-sdk, starting with define Plugin Entry. */
export { definePluginEntry } from "./plugin-entry.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  OpenClawPluginApi,
  OpenClawPluginCommandDefinition,
  OpenClawPluginService,
  PluginCommandContext,
} from "../plugins/types.js";
