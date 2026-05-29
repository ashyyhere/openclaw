// Narrow plugin-sdk surface for the bundled copilot-proxy plugin.
// Keep this list additive and scoped to the bundled Copilot proxy surface.

/** Re-exported API for src/plugin-sdk, starting with define Plugin Entry. */
export { definePluginEntry } from "./plugin-entry.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  OpenClawPluginApi,
  ProviderAuthContext,
  ProviderAuthResult,
} from "../plugins/types.js";
