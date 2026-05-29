// infra file lock helpers and runtime behavior.
/** Re-exported API for src/infra. */
export type {
  FileLockHandle,
  FileLockOptions,
  FileLockTimeoutError,
} from "../plugin-sdk/file-lock.js";
/** Re-exported API for src/infra. */
export {
  acquireFileLock,
  drainFileLockStateForTest,
  FILE_LOCK_TIMEOUT_ERROR_CODE,
  resetFileLockStateForTest,
  withFileLock,
} from "../plugin-sdk/file-lock.js";
