// extensions/kimi-coding api helpers and runtime behavior.
/** Re-exported kimi-coding plugin public API. */
export {
  buildKimiCodingProvider,
  KIMI_CODING_BASE_URL,
  KIMI_CODING_DEFAULT_MODEL_ID,
  KIMI_CODING_LEGACY_MODEL_IDS,
  normalizeKimiCodingModelId,
} from "./provider-catalog.js";
/** Re-exported kimi-coding plugin public API, starting with KIMI CODING MODEL REF. */
export { KIMI_CODING_MODEL_REF, KIMI_MODEL_REF } from "./onboard.js";
