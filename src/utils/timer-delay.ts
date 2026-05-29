// Re-exports gateway timeout clamping helpers and wraps Node timers with the same safety bounds.
import { resolveSafeTimeoutDelayMs } from "../../packages/gateway-client/src/timeouts.js";

/** Re-export shared timeout clamping helpers from the gateway client package. */
export {
  addSafeTimeoutDelayGraceMs,
  MAX_SAFE_TIMEOUT_DELAY_MS,
  resolveFiniteTimeoutDelayMs,
  resolveSafeTimeoutDelayMs,
} from "../../packages/gateway-client/src/timeouts.js";

/** Schedules a timeout after clamping the delay into Node's safe timer range. */
export function setSafeTimeout(
  callback: () => void,
  delayMs: number,
  opts?: { minMs?: number },
): NodeJS.Timeout {
  return setTimeout(callback, resolveSafeTimeoutDelayMs(delayMs, opts));
}
