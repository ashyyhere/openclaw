// Defaults for agent metadata when upstream does not supply them.
// Keep this aligned with the product-level latest-model baseline.
/** Default provider id used when config and model metadata omit one. */
export const DEFAULT_PROVIDER = "openai";
/** Default model id used when config and model metadata omit one. */
export const DEFAULT_MODEL = "gpt-5.5";
// Conservative fallback used when model metadata is unavailable.
/** Default context window estimate used when provider metadata is unavailable. */
export const DEFAULT_CONTEXT_TOKENS = 200_000;
