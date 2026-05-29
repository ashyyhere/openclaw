// extensions/minimax api helpers and runtime behavior.
/** Re-exported minimax plugin public API, starting with build Minimax Portal Provider. */
export { buildMinimaxPortalProvider, buildMinimaxProvider } from "./provider-catalog.js";
/** Re-exported minimax plugin public API. */
export {
  buildMinimaxApiModelDefinition,
  buildMinimaxModelDefinition,
  DEFAULT_MINIMAX_BASE_URL,
  MINIMAX_API_BASE_URL,
  MINIMAX_API_COST,
  MINIMAX_CN_API_BASE_URL,
  MINIMAX_HOSTED_COST,
  MINIMAX_HOSTED_MODEL_ID,
  MINIMAX_HOSTED_MODEL_REF,
  MINIMAX_LM_STUDIO_COST,
} from "./model-definitions.js";
/** Re-exported minimax plugin public API. */
export {
  isMiniMaxModernModelId,
  MINIMAX_DEFAULT_MODEL_ID,
  MINIMAX_DEFAULT_MODEL_REF,
  MINIMAX_TEXT_MODEL_CATALOG,
  MINIMAX_TEXT_MODEL_ORDER,
  MINIMAX_TEXT_MODEL_REFS,
} from "./provider-models.js";
/** Re-exported minimax plugin public API. */
export {
  applyMinimaxApiConfig,
  applyMinimaxApiConfigCn,
  applyMinimaxApiProviderConfig,
  applyMinimaxApiProviderConfigCn,
} from "./onboard.js";
