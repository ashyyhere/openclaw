/** Normalizes resolved provider/model metadata after model lookup. */
import type { Model } from "../../llm/types.js";
import { normalizeModelCompat } from "../../plugins/provider-model-compat.js";

/** Reused helper for normalize Resolved Provider Model behavior in src/agents/embedded-agent-runner. */
export function normalizeResolvedProviderModel(params: { provider: string; model: Model }): Model {
  return normalizeModelCompat(params.model);
}
