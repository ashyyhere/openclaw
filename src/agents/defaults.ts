// Defaults for agent metadata when upstream does not supply them.
// Keep this aligned with the product-level latest-model baseline.
/** Reused constant for DEFAULT PROVIDER behavior in src/agents. */
export const DEFAULT_PROVIDER = "openai";
/** Reused constant for DEFAULT MODEL behavior in src/agents. */
export const DEFAULT_MODEL = "gpt-5.5";
// Conservative fallback used when model metadata is unavailable.
/** Reused constant for DEFAULT CONTEXT TOKENS behavior in src/agents. */
export const DEFAULT_CONTEXT_TOKENS = 200_000;
