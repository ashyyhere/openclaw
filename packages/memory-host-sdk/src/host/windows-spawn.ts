// Windows spawn policy facade used by memory host subprocess launchers.
/** Windows executable resolution and materialization helpers. */
export {
  materializeWindowsSpawnProgram,
  resolveWindowsSpawnProgram,
} from "./openclaw-runtime-io.js";
/** Windows spawn request and resolution contracts. */
export type {
  ResolveWindowsSpawnProgramParams,
  WindowsSpawnInvocation,
  WindowsSpawnProgram,
} from "./openclaw-runtime-io.js";
