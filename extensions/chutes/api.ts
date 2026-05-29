// extensions/chutes api helpers and runtime behavior.
/** Re-exported chutes plugin public API. */
export {
  buildChutesModelDefinition,
  CHUTES_BASE_URL,
  CHUTES_DEFAULT_MODEL_ID,
  CHUTES_DEFAULT_MODEL_REF,
  CHUTES_MODEL_CATALOG,
  discoverChutesModels,
} from "./models.js";
/** Re-exported chutes plugin public API, starting with build Chutes Provider. */
export { buildChutesProvider } from "./provider-catalog.js";
/** Re-exported chutes plugin public API. */
export {
  applyChutesApiKeyConfig,
  applyChutesConfig,
  applyChutesProviderConfig,
} from "./onboard.js";
