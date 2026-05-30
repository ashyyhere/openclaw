// Shared process/runtime utilities for plugins. This is the public boundary for
// logger wiring, runtime env shims, and global verbose console helpers.

/** Runtime environment abstraction exposed to plugin SDK callers. */
export type { RuntimeEnv } from "../runtime.js";
/** Runtime factories that avoid process exits inside plugin code. */
export { createNonExitingRuntime, defaultRuntime } from "../runtime.js";
/** Global CLI logging and confirmation helpers available to plugins. */
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
/** Promise sleep helper used by plugin async flows. */
export { sleep } from "../utils.js";
/** Runs a promise with a timeout guard. */
export { withTimeout } from "../utils/with-timeout.js";
/** Parses common truthy environment variable values. */
export { isTruthyEnvValue } from "../infra/env.js";
export * from "../logging.js";
/** Resolves when an abort signal fires. */
export { waitForAbortSignal } from "../infra/abort-signal.js";
/** Backoff helpers for retry loops and abort-aware sleeping. */
export { computeBackoff, sleepWithAbort, type BackoffPolicy } from "../infra/backoff.js";
/** Duration formatting helpers for plugin-facing status text. */
export {
  formatDurationPrecise,
  formatDurationSeconds,
} from "../infra/format-time/format-duration.ts";
/** Generic async retry helper for transient plugin operations. */
export { retryAsync } from "../infra/retry.js";
/** Installs the process-global Undici dispatcher from proxy env vars. */
export { ensureGlobalUndiciEnvProxyDispatcher } from "../infra/net/undici-global-dispatcher.js";
/** Process-level unhandled error registration helpers for plugin runtimes. */
export {
  registerUncaughtExceptionHandler,
  registerUnhandledRejectionHandler,
} from "../infra/unhandled-rejections.js";
/** Synchronous WSL2 detection helper for platform-specific plugin behavior. */
export { isWSL2Sync } from "../infra/wsl.js";
