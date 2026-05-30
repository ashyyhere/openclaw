/** Public SDK barrel for runtime environment contracts. */
export type { OutputRuntimeEnv, RuntimeEnv } from "../runtime.js";
/** Runtime factories that let plugins report exits without terminating the host process. */
export { createNonExitingRuntime, defaultRuntime } from "../runtime.js";
/** Resolves command SecretRefs through the gateway secret bridge. */
export { resolveCommandSecretRefsViaGateway } from "../cli/command-secret-gateway.js";
/** Lists channel command secret targets that plugins may resolve through the gateway. */
export { getChannelsCommandSecretTargetIds } from "../cli/command-secret-targets.js";
/** Runtime environment helpers that route messages through logger-backed exits. */
export {
  createLoggerBackedRuntime,
  resolveRuntimeEnv,
  resolveRuntimeEnvWithUnavailableExit,
} from "./runtime-logger.js";
/** Global CLI logging and yes/verbose flag helpers used by plugin setup flows. */
export {
  danger,
  info,
  isVerbose,
  isYes,
  logVerbose,
  logVerboseConsole,
  setVerbose,
  setYes,
  shouldLogVerbose,
  success,
  warn,
} from "../globals.js";
export * from "../logging.js";
/** Promise helper that settles when an AbortSignal fires. */
export { waitForAbortSignal } from "../infra/abort-signal.js";
/** Backup archive helper exposed for plugin-managed config/data migrations. */
export { createBackupArchive } from "../infra/backup-create.js";
/** Plugin install path diagnostics for setup and doctor flows. */
export {
  detectPluginInstallPathIssue,
  formatPluginInstallPathIssue,
} from "../infra/plugin-install-path-warnings.js";
/** Collects dangerous provider-name matching scopes for provider auth diagnostics. */
export { collectProviderDangerousNameMatchingScopes } from "../config/dangerous-name-matching.js";
/** Process-level rejection/exception handler registration helpers. */
export {
  registerUncaughtExceptionHandler,
  registerUnhandledRejectionHandler,
} from "../infra/unhandled-rejections.js";
/** Removes a plugin entry from config during uninstall or migration flows. */
export { removePluginFromConfig } from "../plugins/uninstall.js";
