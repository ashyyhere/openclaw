// extensions/mistral api helpers and runtime behavior.
/** Re-exported mistral plugin public API, starting with build Mistral Provider. */
export { buildMistralProvider } from "./provider-catalog.js";
/** Re-exported mistral plugin public API. */
export {
  buildMistralModelDefinition,
  MISTRAL_BASE_URL,
  MISTRAL_DEFAULT_MODEL_ID,
} from "./model-definitions.js";
/** Re-exported mistral plugin public API. */
export {
  applyMistralConfig,
  applyMistralProviderConfig,
  MISTRAL_DEFAULT_MODEL_REF,
} from "./onboard.js";

const MISTRAL_MAX_TOKENS_FIELD = "max_tokens";

/** Public mistral plugin constant for MISTRAL MODEL TRANSPORT PATCH behavior. */
export const MISTRAL_MODEL_TRANSPORT_PATCH = {
  supportsStore: false,
  maxTokensField: MISTRAL_MAX_TOKENS_FIELD,
} as const satisfies {
  supportsStore: boolean;
  maxTokensField: "max_tokens";
};

const MISTRAL_SMALL_LATEST_REASONING_EFFORT_MAP: Record<string, string> = {
  off: "none",
  minimal: "none",
  low: "high",
  medium: "high",
  high: "high",
  xhigh: "high",
  adaptive: "high",
  max: "high",
};

/** Public mistral plugin constant for MISTRAL SMALL LATEST ID behavior. */
export const MISTRAL_SMALL_LATEST_ID = "mistral-small-latest";
/** Public mistral plugin constant for MISTRAL MEDIUM 3 5 ID behavior. */
export const MISTRAL_MEDIUM_3_5_ID = "mistral-medium-3-5";

/** Public mistral plugin helper for resolve Mistral Compat Patch behavior. */
export function resolveMistralCompatPatch(model: { id?: string }): {
  supportsStore: boolean;
  supportsReasoningEffort: boolean;
  maxTokensField: "max_tokens";
  reasoningEffortMap?: Record<string, string>;
} {
  const reasoningEnabled =
    model.id === MISTRAL_SMALL_LATEST_ID || model.id === MISTRAL_MEDIUM_3_5_ID;
  return {
    ...MISTRAL_MODEL_TRANSPORT_PATCH,
    supportsReasoningEffort: reasoningEnabled,
    reasoningEffortMap: reasoningEnabled ? MISTRAL_SMALL_LATEST_REASONING_EFFORT_MAP : undefined,
  };
}

function compatMatchesResolved(
  compat: Record<string, unknown> | undefined,
  modelId: string | undefined,
): boolean {
  const expected = resolveMistralCompatPatch({ id: modelId });
  return (
    compat?.supportsStore === expected.supportsStore &&
    compat?.supportsReasoningEffort === expected.supportsReasoningEffort &&
    compat?.maxTokensField === expected.maxTokensField &&
    compat?.reasoningEffortMap === expected.reasoningEffortMap
  );
}

/** Public mistral plugin helper for apply Mistral Model Compat behavior. */
export function applyMistralModelCompat<T extends { compat?: unknown; id?: string }>(model: T): T {
  const compat =
    model.compat && typeof model.compat === "object"
      ? (model.compat as Record<string, unknown>)
      : undefined;
  if (compatMatchesResolved(compat, model.id)) {
    return model;
  }
  const patch = resolveMistralCompatPatch(model);
  return {
    ...model,
    compat: {
      ...compat,
      ...patch,
    } as T extends { compat?: infer TCompat } ? TCompat : never,
  } as T;
}
