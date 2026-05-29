// extensions/lobster runtime api helpers and runtime behavior.
/** Re-exported lobster plugin public API, starting with define Plugin Entry. */
export { definePluginEntry } from "openclaw/plugin-sdk/core";
/** Re-exported lobster plugin public API. */
export type {
  AnyAgentTool,
  OpenClawPluginApi,
  OpenClawPluginToolContext,
  OpenClawPluginToolFactory,
} from "openclaw/plugin-sdk/core";
/** Re-exported lobster plugin public API. */
export {
  applyWindowsSpawnProgramPolicy,
  materializeWindowsSpawnProgram,
  resolveWindowsSpawnProgramCandidate,
} from "openclaw/plugin-sdk/windows-spawn";
