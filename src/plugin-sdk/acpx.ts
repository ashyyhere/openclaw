// Private ACPX runtime backend helpers for bundled extensions.
// Keep this surface narrow and limited to the ACP runtime/backend contract.

/** ACP runtime error codes exposed to bundled runtime backends. */
export type { AcpRuntimeErrorCode } from "../acp/runtime/errors.js";
/** ACP runtime error class exposed to bundled runtime backends. */
export { AcpRuntimeError } from "../acp/runtime/errors.js";
/** Registers or unregisters ACP runtime backends. */
export { registerAcpRuntimeBackend, unregisterAcpRuntimeBackend } from "../acp/runtime/registry.js";
/** ACP runtime backend capability, event, turn, and status types. */
export type {
  AcpRuntime,
  AcpRuntimeCapabilities,
  AcpRuntimeDoctorReport,
  AcpRuntimeEnsureInput,
  AcpRuntimeEvent,
  AcpRuntimeHandle,
  AcpRuntimeStatus,
  AcpRuntimeTurn,
  AcpRuntimeTurnInput,
  AcpRuntimeTurnResult,
  AcpRuntimeTurnResultError,
  AcpSessionUpdateTag,
} from "../acp/runtime/types.js";
/** Plugin service/API types needed by ACP runtime backends. */
export type {
  OpenClawPluginApi,
  OpenClawPluginConfigSchema,
  OpenClawPluginService,
  OpenClawPluginServiceContext,
  PluginLogger,
} from "../plugins/types.js";
/** Windows spawn resolution types shared by ACP runtime helpers. */
export type {
  WindowsSpawnProgram,
  WindowsSpawnProgramCandidate,
  WindowsSpawnResolution,
} from "./windows-spawn.js";
/** Windows spawn resolution helpers shared by ACP runtime helpers. */
export {
  applyWindowsSpawnProgramPolicy,
  materializeWindowsSpawnProgram,
  resolveWindowsSpawnProgramCandidate,
} from "./windows-spawn.js";
/** Provider auth env-var helpers shared with ACP runtime setup. */
export {
  listKnownProviderAuthEnvVarNames,
  omitEnvKeysCaseInsensitive,
} from "../secrets/provider-env-vars.js";
