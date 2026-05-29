// Private Lobster plugin helpers for bundled extensions.
// Keep this surface narrow and limited to the Lobster workflow/tool contract.

/** Re-exported API for src/plugin-sdk, starting with define Plugin Entry. */
export { definePluginEntry } from "./plugin-entry.js";
/** Re-exported API for src/plugin-sdk. */
export {
  applyWindowsSpawnProgramPolicy,
  materializeWindowsSpawnProgram,
  resolveWindowsSpawnProgramCandidate,
} from "./windows-spawn.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  AnyAgentTool,
  OpenClawPluginApi,
  OpenClawPluginToolContext,
  OpenClawPluginToolFactory,
} from "../plugins/types.js";
