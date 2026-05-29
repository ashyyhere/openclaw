/** Default limits and zero-cost metadata for self-hosted model providers. */
/** Default context window for self-hosted providers without catalog metadata. */
export const SELF_HOSTED_DEFAULT_CONTEXT_WINDOW = 128000;
/** Default max output tokens for self-hosted providers without catalog metadata. */
export const SELF_HOSTED_DEFAULT_MAX_TOKENS = 8192;
/** Default zero-cost record for self-hosted providers. */
export const SELF_HOSTED_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
