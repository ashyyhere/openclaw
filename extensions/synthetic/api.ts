// extensions/synthetic api helpers and runtime behavior.
/** Re-exported synthetic plugin public API, starting with apply Synthetic Config. */
export { applySyntheticConfig, applySyntheticProviderConfig } from "./onboard.js";
/** Re-exported synthetic plugin public API. */
export {
  buildSyntheticModelDefinition,
  SYNTHETIC_BASE_URL,
  SYNTHETIC_DEFAULT_MODEL_ID,
  SYNTHETIC_DEFAULT_MODEL_REF,
  SYNTHETIC_MODEL_CATALOG,
} from "./models.js";
/** Re-exported synthetic plugin public API, starting with build Synthetic Provider. */
export { buildSyntheticProvider } from "./provider-catalog.js";
