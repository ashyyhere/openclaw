// extensions/kilocode api helpers and runtime behavior.
/** Re-exported kilocode plugin public API, starting with build Kilocode Provider. */
export { buildKilocodeProvider, buildKilocodeProviderWithDiscovery } from "./provider-catalog.js";
/** Re-exported kilocode plugin public API. */
export {
  buildKilocodeModelDefinition,
  KILOCODE_BASE_URL,
  KILOCODE_DEFAULT_CONTEXT_WINDOW,
  KILOCODE_DEFAULT_COST,
  KILOCODE_DEFAULT_MAX_TOKENS,
  KILOCODE_DEFAULT_MODEL_ID,
  KILOCODE_DEFAULT_MODEL_NAME,
  KILOCODE_DEFAULT_MODEL_REF,
  KILOCODE_MODELS_URL,
  KILOCODE_MODEL_CATALOG,
  discoverKilocodeModels,
} from "./provider-models.js";
