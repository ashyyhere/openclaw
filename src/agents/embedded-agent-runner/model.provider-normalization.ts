/** Normalizes resolved provider/model metadata after model lookup. */
import type { Model } from "../../llm/types.js";
import { normalizeModelCompat } from "../../plugins/provider-model-compat.js";

/** Applies provider compatibility normalization after resolving a model entry. */
export function normalizeResolvedProviderModel(params: { provider: string; model: Model }): Model {
  return normalizeModelCompat(params.model);
}
