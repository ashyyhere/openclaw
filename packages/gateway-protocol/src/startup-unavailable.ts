// packages/gateway-protocol/src startup unavailable helpers and runtime behavior.
/** Public constant for GATEWAY STARTUP UNAVAILABLE REASON behavior in packages/gateway-protocol. */
export const GATEWAY_STARTUP_UNAVAILABLE_REASON = "startup-sidecars";
/** Public constant for GATEWAY STARTUP PENDING CLOSE CAUSE behavior in packages/gateway-protocol. */
export const GATEWAY_STARTUP_PENDING_CLOSE_CAUSE = "startup-sidecars-pending";
/** Public constant for GATEWAY STARTUP CLOSE CODE behavior in packages/gateway-protocol. */
export const GATEWAY_STARTUP_CLOSE_CODE = 1013;
/** Public constant for GATEWAY STARTUP CLOSE REASON behavior in packages/gateway-protocol. */
export const GATEWAY_STARTUP_CLOSE_REASON = "gateway starting";
/** Public constant for GATEWAY STARTUP RETRY AFTER MS behavior in packages/gateway-protocol. */
export const GATEWAY_STARTUP_RETRY_AFTER_MS = 500;
const GATEWAY_STARTUP_RETRY_MIN_MS = 100;
const GATEWAY_STARTUP_RETRY_MAX_MS = 2_000;

/** Public type describing Gateway Startup Unavailable Details for packages/gateway-protocol. */
export type GatewayStartupUnavailableDetails = {
  reason: typeof GATEWAY_STARTUP_UNAVAILABLE_REASON;
};

/** Public helper for gateway Startup Unavailable Details behavior in packages/gateway-protocol. */
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

/** Public helper for is Retryable Gateway Startup Unavailable Error behavior in packages/gateway-protocol. */
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

/** Public helper for resolve Gateway Startup Retry After Ms behavior in packages/gateway-protocol. */
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
