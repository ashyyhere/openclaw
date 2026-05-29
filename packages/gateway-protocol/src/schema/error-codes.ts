// packages/gateway-protocol/src/schema error codes helpers and runtime behavior.
import type { ErrorShape } from "./types.js";

/** Public constant for Error Codes behavior in packages/gateway-protocol. */
export const ErrorCodes = {
  NOT_LINKED: "NOT_LINKED",
  NOT_PAIRED: "NOT_PAIRED",
  AGENT_TIMEOUT: "AGENT_TIMEOUT",
  INVALID_REQUEST: "INVALID_REQUEST",
  APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

/** Public type describing Error Code for packages/gateway-protocol. */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/** Public helper for error Shape behavior in packages/gateway-protocol. */
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
