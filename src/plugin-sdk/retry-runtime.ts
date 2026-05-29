// Public retry helpers for plugins that need retry config or policy runners.

/** Re-exported API for src/plugin-sdk. */
export {
  resolveRetryConfig,
  retryAsync,
  type RetryConfig,
  type RetryInfo,
  type RetryOptions,
} from "../infra/retry.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createRateLimitRetryRunner,
  createChannelApiRetryRunner as createTelegramRetryRunner,
  CHANNEL_API_RETRY_DEFAULTS as TELEGRAM_RETRY_DEFAULTS,
  type RetryRunner,
} from "../infra/retry-policy.js";
