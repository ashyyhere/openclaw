// Re-exports strict number coercion and timer-safe duration helpers.
/** Number parsing and duration conversion helpers shared by infra callers. */
export {
  parseFiniteNumber,
  parseStrictFiniteNumber,
  parseStrictInteger,
  parseStrictNonNegativeInteger,
  parseStrictPositiveInteger,
  clampTimerTimeoutMs,
  finiteSecondsToTimerSafeMilliseconds,
  MAX_TIMER_TIMEOUT_MS,
  MAX_TIMER_TIMEOUT_SECONDS,
  positiveSecondsToSafeMilliseconds,
  nonNegativeSecondsToSafeMilliseconds,
  resolveExpiresAtMsFromDurationSeconds,
  resolveExpiresAtMsFromDurationOrEpoch,
  resolveExpiresAtMsFromEpochSeconds,
} from "../shared/number-coercion.js";
