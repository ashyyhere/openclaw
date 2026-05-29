// extensions/zai api helpers and runtime behavior.
/** Re-exported zai plugin public API, starting with apply Zai Config. */
export { applyZaiConfig, applyZaiProviderConfig, ZAI_DEFAULT_MODEL_REF } from "./onboard.js";
/** Re-exported zai plugin public API, starting with detect Zai Endpoint. */
export { detectZaiEndpoint, type ZaiDetectedEndpoint, type ZaiEndpointId } from "./detect.js";
/** Re-exported zai plugin public API. */
export {
  buildZaiModelDefinition,
  resolveZaiBaseUrl,
  ZAI_CN_BASE_URL,
  ZAI_CODING_CN_BASE_URL,
  ZAI_CODING_GLOBAL_BASE_URL,
  ZAI_DEFAULT_COST,
  ZAI_DEFAULT_MODEL_ID,
  ZAI_GLOBAL_BASE_URL,
} from "./model-definitions.js";
