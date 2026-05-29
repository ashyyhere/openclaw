// utils timer delay helpers and runtime behavior.
import { resolveSafeTimeoutDelayMs } from "../../packages/gateway-client/src/timeouts.js";

/** Re-exported API for src/utils. */
export {
  addSafeTimeoutDelayGraceMs,
  MAX_SAFE_TIMEOUT_DELAY_MS,
  resolveFiniteTimeoutDelayMs,
  resolveSafeTimeoutDelayMs,
} from "../../packages/gateway-client/src/timeouts.js";

/** Reused helper for set Safe Timeout behavior in src/utils. */
export function setSafeTimeout(
  callback: () => void,
  delayMs: number,
  opts?: { minMs?: number },
): NodeJS.Timeout {
  return setTimeout(callback, resolveSafeTimeoutDelayMs(delayMs, opts));
}
