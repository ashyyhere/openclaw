// Runtime boundary for media store runtime behavior.
import "../infra/fs-safe-defaults.js";
import {
  FsSafeError,
  readLocalFileSafely as readLocalFileSafelyImpl,
  type FsSafeErrorCode,
} from "../infra/fs-safe.js";

/** Shared type for Fs Safe Like Error in src/media. */
export type FsSafeLikeError = {
  code: FsSafeErrorCode;
  message: string;
};

/** Reused constant for read Local File Safely behavior in src/media. */
export const readLocalFileSafely = readLocalFileSafelyImpl;

/** Reused helper for is Fs Safe Error behavior in src/media. */
export function isFsSafeError(error: unknown): error is FsSafeLikeError {
  return error instanceof FsSafeError;
}
