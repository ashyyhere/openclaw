// extensions/arcee api helpers and runtime behavior.
/** Re-exported arcee plugin public API, starting with build Arcee Model Definition. */
export { buildArceeModelDefinition, ARCEE_BASE_URL, ARCEE_MODEL_CATALOG } from "./models.js";
/** Re-exported arcee plugin public API, starting with build Arcee Provider. */
export { buildArceeProvider, buildArceeOpenRouterProvider } from "./provider-catalog.js";
/** Re-exported arcee plugin public API. */
export {
  applyArceeConfig,
  applyArceeOpenRouterConfig,
  ARCEE_DEFAULT_MODEL_REF,
  ARCEE_OPENROUTER_DEFAULT_MODEL_REF,
} from "./onboard.js";
