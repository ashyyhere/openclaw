// Shared startup-unavailable constants and readers for retryable gateway connections.
/** Details reason used when startup sidecars are not ready to accept work. */
export const GATEWAY_STARTUP_UNAVAILABLE_REASON = "startup-sidecars";
/** Close cause emitted while the gateway is still waiting on startup sidecars. */
export const GATEWAY_STARTUP_PENDING_CLOSE_CAUSE = "startup-sidecars-pending";
/** WebSocket close code for temporary service restart/startup unavailability. */
export const GATEWAY_STARTUP_CLOSE_CODE = 1013;
/** Human-readable close reason paired with the temporary startup close code. */
export const GATEWAY_STARTUP_CLOSE_REASON = "gateway starting";
/** Default retry delay when a startup-unavailable error omits a bounded retry hint. */
export const GATEWAY_STARTUP_RETRY_AFTER_MS = 500;
const GATEWAY_STARTUP_RETRY_MIN_MS = 100;
const GATEWAY_STARTUP_RETRY_MAX_MS = 2_000;

/** Structured error details that identify retryable startup unavailability. */
export type GatewayStartupUnavailableDetails = {
  reason: typeof GATEWAY_STARTUP_UNAVAILABLE_REASON;
};

/** Build the details object embedded in retryable startup-unavailable errors. */
export function gatewayStartupUnavailableDetails(): GatewayStartupUnavailableDetails {
  return { reason: GATEWAY_STARTUP_UNAVAILABLE_REASON };
}

function isGatewayStartupUnavailableDetails(
  details: unknown,
): details is GatewayStartupUnavailableDetails {
  return (
    typeof details === "object" &&
    details !== null &&
    (details as { reason?: unknown }).reason === GATEWAY_STARTUP_UNAVAILABLE_REASON
  );
}

/** Identify gateway errors that are safe for clients to retry during startup. */
export function isRetryableGatewayStartupUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const shaped = error as {
    code?: unknown;
    gatewayCode?: unknown;
    retryable?: unknown;
    details?: unknown;
  };
  const code = shaped.gatewayCode ?? shaped.code;
  return (
    code === "UNAVAILABLE" &&
    shaped.retryable === true &&
    isGatewayStartupUnavailableDetails(shaped.details)
  );
}

/** Read and clamp the retry-after delay for retryable startup-unavailable errors. */
export function resolveGatewayStartupRetryAfterMs(error: unknown): number | null {
  if (!isRetryableGatewayStartupUnavailableError(error)) {
    return null;
  }
  const retryAfterMs = (error as { retryAfterMs?: unknown }).retryAfterMs;
  const raw =
    typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs)
      ? retryAfterMs
      : GATEWAY_STARTUP_RETRY_AFTER_MS;
  return Math.min(
    Math.max(Math.floor(raw), GATEWAY_STARTUP_RETRY_MIN_MS),
    GATEWAY_STARTUP_RETRY_MAX_MS,
  );
}
