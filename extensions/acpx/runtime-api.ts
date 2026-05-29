// extensions/acpx runtime api helpers and runtime behavior.
/** Re-exported acpx plugin public API, starting with Acp Runtime Error Code. */
export type { AcpRuntimeErrorCode } from "openclaw/plugin-sdk/acp-runtime-backend";
/** Re-exported acpx plugin public API. */
export {
  AcpRuntimeError,
  getAcpRuntimeBackend,
  tryDispatchAcpReplyHook,
  registerAcpRuntimeBackend,
  unregisterAcpRuntimeBackend,
} from "openclaw/plugin-sdk/acp-runtime-backend";
/** Re-exported acpx plugin public API. */
export type {
  AcpRuntime,
  AcpRuntimeCapabilities,
  AcpRuntimeDoctorReport,
  AcpRuntimeEnsureInput,
  AcpRuntimeEvent,
  AcpRuntimeHandle,
  AcpRuntimeStatus,
  AcpRuntimeTurn,
  AcpRuntimeTurnAttachment,
  AcpRuntimeTurnInput,
  AcpRuntimeTurnResult,
  AcpRuntimeTurnResultError,
  AcpSessionUpdateTag,
} from "openclaw/plugin-sdk/acp-runtime-backend";
/** Re-exported acpx plugin public API. */
export type {
  OpenClawPluginApi,
  OpenClawPluginConfigSchema,
  OpenClawPluginService,
  OpenClawPluginServiceContext,
  PluginLogger,
} from "openclaw/plugin-sdk/core";
/** Re-exported acpx plugin public API. */
export type {
  PluginHookReplyDispatchContext,
  PluginHookReplyDispatchEvent,
  PluginHookReplyDispatchResult,
} from "openclaw/plugin-sdk/core";
/** Re-exported acpx plugin public API. */
export type {
  WindowsSpawnProgram,
  WindowsSpawnProgramCandidate,
  WindowsSpawnResolution,
} from "openclaw/plugin-sdk/windows-spawn";
/** Re-exported acpx plugin public API. */
export {
  applyWindowsSpawnProgramPolicy,
  materializeWindowsSpawnProgram,
  resolveWindowsSpawnProgramCandidate,
} from "openclaw/plugin-sdk/windows-spawn";
/** Re-exported acpx plugin public API. */
export {
  listKnownProviderAuthEnvVarNames,
  omitEnvKeysCaseInsensitive,
} from "openclaw/plugin-sdk/provider-env-vars";
