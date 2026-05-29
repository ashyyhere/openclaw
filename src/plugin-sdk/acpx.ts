// Private ACPX runtime backend helpers for bundled extensions.
// Keep this surface narrow and limited to the ACP runtime/backend contract.

/** Re-exported API for src/plugin-sdk, starting with Acp Runtime Error Code. */
export type { AcpRuntimeErrorCode } from "../acp/runtime/errors.js";
/** Re-exported API for src/plugin-sdk, starting with Acp Runtime Error. */
export { AcpRuntimeError } from "../acp/runtime/errors.js";
/** Re-exported API for src/plugin-sdk, starting with register Acp Runtime Backend. */
export { registerAcpRuntimeBackend, unregisterAcpRuntimeBackend } from "../acp/runtime/registry.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
export type {
  OpenClawPluginApi,
  OpenClawPluginConfigSchema,
  OpenClawPluginService,
  OpenClawPluginServiceContext,
  PluginLogger,
} from "../plugins/types.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  WindowsSpawnProgram,
  WindowsSpawnProgramCandidate,
  WindowsSpawnResolution,
} from "./windows-spawn.js";
/** Re-exported API for src/plugin-sdk. */
export {
  applyWindowsSpawnProgramPolicy,
  materializeWindowsSpawnProgram,
  resolveWindowsSpawnProgramCandidate,
} from "./windows-spawn.js";
/** Re-exported API for src/plugin-sdk. */
export {
  listKnownProviderAuthEnvVarNames,
  omitEnvKeysCaseInsensitive,
} from "../secrets/provider-env-vars.js";
