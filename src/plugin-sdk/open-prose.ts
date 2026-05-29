// Narrow plugin-sdk surface for the bundled open-prose plugin.
// Keep this list additive and scoped to the bundled open-prose surface.

/** Re-exported API for src/plugin-sdk, starting with define Plugin Entry. */
export { definePluginEntry } from "./plugin-entry.js";
/** Re-exported API for src/plugin-sdk, starting with Open Claw Plugin Api. */
export type { OpenClawPluginApi } from "../plugins/types.js";
