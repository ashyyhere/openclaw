/** Re-exports file-lock primitives from the plugin SDK for infra callers. */
/** File-lock handle/options/error types used by infra and plugin-facing code. */
export type {
  FileLockHandle,
  FileLockOptions,
  FileLockTimeoutError,
} from "../plugin-sdk/file-lock.js";
/** File-lock acquisition helpers plus test-only state cleanup utilities. */
export {
  acquireFileLock,
  drainFileLockStateForTest,
  FILE_LOCK_TIMEOUT_ERROR_CODE,
  resetFileLockStateForTest,
  withFileLock,
} from "../plugin-sdk/file-lock.js";
