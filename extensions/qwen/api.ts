// extensions/qwen api helpers and runtime behavior.
/** Re-exported qwen plugin public API. */
export {
  applyQwenNativeStreamingUsageCompat,
  buildQwenDefaultModelDefinition,
  buildQwenModelDefinition,
  buildQwenModelCatalogForBaseUrl,
  isNativeQwenBaseUrl,
  isQwen36PlusSupportedBaseUrl,
  isQwenCodingPlanBaseUrl,
  QWEN_36_PLUS_MODEL_ID,
  QWEN_BASE_URL,
  QWEN_CN_BASE_URL,
  QWEN_DEFAULT_COST,
  QWEN_DEFAULT_MODEL_ID,
  QWEN_DEFAULT_MODEL_REF,
  QWEN_GLOBAL_BASE_URL,
  QWEN_STANDARD_CN_BASE_URL,
  QWEN_STANDARD_GLOBAL_BASE_URL,
  QWEN_MODEL_CATALOG,
  applyModelStudioNativeStreamingUsageCompat,
  buildModelStudioDefaultModelDefinition,
  buildModelStudioModelDefinition,
  isNativeModelStudioBaseUrl,
  MODELSTUDIO_BASE_URL,
  MODELSTUDIO_CN_BASE_URL,
  MODELSTUDIO_DEFAULT_COST,
  MODELSTUDIO_DEFAULT_MODEL_ID,
  MODELSTUDIO_DEFAULT_MODEL_REF,
  MODELSTUDIO_GLOBAL_BASE_URL,
  MODELSTUDIO_STANDARD_CN_BASE_URL,
  MODELSTUDIO_STANDARD_GLOBAL_BASE_URL,
  MODELSTUDIO_MODEL_CATALOG,
} from "./models.js";
/** Re-exported qwen plugin public API, starting with build Model Studio Provider. */
export { buildModelStudioProvider, buildQwenProvider } from "./provider-catalog.js";
/** Re-exported qwen plugin public API, starting with create Qwen Thinking Wrapper. */
export { createQwenThinkingWrapper, wrapQwenProviderStream } from "./stream.js";
