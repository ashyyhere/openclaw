// Shared process/runtime utilities for plugins. This is the public boundary for
// logger wiring, runtime env shims, and global verbose console helpers.

/** Re-exported API for src/plugin-sdk, starting with Runtime Env. */
export type { RuntimeEnv } from "../runtime.js";
/** Re-exported API for src/plugin-sdk, starting with create Non Exiting Runtime. */
export { createNonExitingRuntime, defaultRuntime } from "../runtime.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with sleep. */
export { sleep } from "../utils.js";
/** Re-exported API for src/plugin-sdk, starting with with Timeout. */
export { withTimeout } from "../utils/with-timeout.js";
/** Re-exported API for src/plugin-sdk, starting with is Truthy Env Value. */
export { isTruthyEnvValue } from "../infra/env.js";
export * from "../logging.js";
/** Re-exported API for src/plugin-sdk, starting with wait For Abort Signal. */
export { waitForAbortSignal } from "../infra/abort-signal.js";
/** Re-exported API for src/plugin-sdk, starting with compute Backoff. */
export { computeBackoff, sleepWithAbort, type BackoffPolicy } from "../infra/backoff.js";
/** Re-exported API for src/plugin-sdk. */
export {
  formatDurationPrecise,
  formatDurationSeconds,
} from "../infra/format-time/format-duration.ts";
/** Re-exported API for src/plugin-sdk, starting with retry Async. */
export { retryAsync } from "../infra/retry.js";
/** Re-exported API for src/plugin-sdk, starting with ensure Global Undici Env Proxy Dispatcher. */
export { ensureGlobalUndiciEnvProxyDispatcher } from "../infra/net/undici-global-dispatcher.js";
/** Re-exported API for src/plugin-sdk. */
export {
  registerUncaughtExceptionHandler,
  registerUnhandledRejectionHandler,
} from "../infra/unhandled-rejections.js";
/** Re-exported API for src/plugin-sdk, starting with is WSL2 Sync. */
export { isWSL2Sync } from "../infra/wsl.js";
