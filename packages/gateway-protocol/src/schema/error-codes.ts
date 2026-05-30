// Shared gateway error-code constants and response envelope helper.
import type { ErrorShape } from "./types.js";

/** Stable gateway error codes used by clients for recovery decisions. */
export const ErrorCodes = {
  NOT_LINKED: "NOT_LINKED",
  NOT_PAIRED: "NOT_PAIRED",
  AGENT_TIMEOUT: "AGENT_TIMEOUT",
  INVALID_REQUEST: "INVALID_REQUEST",
  APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

/** Union of the stable gateway error-code string values. */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/** Build a typed gateway error payload with optional retry metadata. */
export function errorShape(
  code: ErrorCode,
  message: string,
  opts?: { details?: unknown; retryable?: boolean; retryAfterMs?: number },
): ErrorShape {
  return {
    code,
    message,
    ...opts,
  };
}
