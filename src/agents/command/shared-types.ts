export type AgentStreamParams = {
  /** Provider stream params override (best-effort). */
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  /** Stop sequences forwarded to the provider (best-effort). */
  stop?: string[];
  /** Provider fast-mode override (best-effort). */
  fastMode?: boolean;
  responseFormat?: Record<string, unknown>;
  frequencyPenalty?: number;
  presencePenalty?: number;
  seed?: number;
};

/** Client-provided function tool definition forwarded to OpenResponses. */
export type ClientToolDefinition = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
    /** Strict argument enforcement (Responses API). Propagated from the request. */
    strict?: boolean;
  };
};
