// extensions/cerebras api helpers and runtime behavior.
/** Re-exported cerebras plugin public API. */
export {
  buildCerebrasModelDefinition,
  CEREBRAS_BASE_URL,
  CEREBRAS_MODEL_CATALOG,
} from "./models.js";
/** Re-exported cerebras plugin public API, starting with build Cerebras Provider. */
export { buildCerebrasProvider } from "./provider-catalog.js";
/** Re-exported cerebras plugin public API, starting with apply Cerebras Config. */
export { applyCerebrasConfig, CEREBRAS_DEFAULT_MODEL_REF } from "./onboard.js";
