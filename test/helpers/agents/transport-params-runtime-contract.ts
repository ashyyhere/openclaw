// Transport contract fixtures define expected GPT-5 request defaults across provider APIs.
/** Expected transport defaults for OpenAI-family GPT-5 models. */
export const OPENAI_GPT5_TRANSPORT_DEFAULTS = {
  parallel_tool_calls: true,
  text_verbosity: "low",
} as const;

/** Provider/model cases that should receive GPT-5 OpenAI transport defaults. */
export const OPENAI_GPT5_TRANSPORT_DEFAULT_CASES = [
  {
    provider: "openai",
    modelId: "gpt-5.4",
  },
  {
    provider: "openai-codex",
    modelId: "gpt-5.4",
  },
] as const;

/** Control provider/model case that must not receive OpenAI GPT-5 defaults. */
export const NON_OPENAI_GPT5_TRANSPORT_CASE = {
  provider: "openrouter",
  modelId: "gpt-5.4",
} as const;

/** Payload APIs that support GPT parallel tool call defaults. */
export const GPT_PARALLEL_TOOL_CALLS_PAYLOAD_APIS = [
  "openai-completions",
  "openai-responses",
  "openai-codex-responses",
  "azure-openai-responses",
] as const;

/** Payload APIs unrelated to OpenAI GPT parallel tool call defaults. */
export const UNRELATED_TOOL_CALLS_PAYLOAD_APIS = [
  "anthropic-messages",
  "google-generative-ai",
] as const;
