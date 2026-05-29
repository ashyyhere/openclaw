/** Runtime auth refresh delay helpers. */
import { resolveSafeTimeoutDelayMs } from "../utils/timer-delay.js";

/** Clamp auth refresh delay to timer-safe bounds and a minimum delay. */
export function clampRuntimeAuthRefreshDelayMs(params: {
  refreshAt: number;
  now: number;
  minDelayMs: number;
}): number {
  return resolveSafeTimeoutDelayMs(params.refreshAt - params.now, { minMs: params.minDelayMs });
}
