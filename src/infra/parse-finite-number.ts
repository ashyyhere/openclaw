// infra parse finite number helpers and runtime behavior.
/** Re-exported API for src/infra. */
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
