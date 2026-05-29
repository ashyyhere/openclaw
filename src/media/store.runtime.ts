// Runtime boundary for media store runtime behavior.
import "../infra/fs-safe-defaults.js";
import {
  FsSafeError,
  readLocalFileSafely as readLocalFileSafelyImpl,
  type FsSafeErrorCode,
} from "../infra/fs-safe.js";

/** Narrow fs-safe error shape used by media store callers without importing the concrete class. */
export type FsSafeLikeError = {
  code: FsSafeErrorCode;
  message: string;
};

/** Runtime-bound safe local file reader after fs-safe defaults have been installed. */
export const readLocalFileSafely = readLocalFileSafelyImpl;

/** Checks whether an unknown read failure is an fs-safe policy error. */
export function isFsSafeError(error: unknown): error is FsSafeLikeError {
  return error instanceof FsSafeError;
}
