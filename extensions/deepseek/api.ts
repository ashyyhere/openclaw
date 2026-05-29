// extensions/deepseek api helpers and runtime behavior.
/** Re-exported deepseek plugin public API. */
export {
  buildDeepSeekModelDefinition,
  DEEPSEEK_BASE_URL,
  DEEPSEEK_MODEL_CATALOG,
} from "./models.js";
/** Re-exported deepseek plugin public API, starting with build Deep Seek Provider. */
export { buildDeepSeekProvider } from "./provider-catalog.js";
/** Re-exported deepseek plugin public API, starting with create Deep Seek V4 Thinking Wrapper. */
export { createDeepSeekV4ThinkingWrapper } from "./stream.js";
