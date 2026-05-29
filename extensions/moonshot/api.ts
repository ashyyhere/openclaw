// extensions/moonshot api helpers and runtime behavior.
/** Re-exported moonshot plugin public API. */
export {
  applyMoonshotNativeStreamingUsageCompat,
  buildMoonshotProvider,
  isNativeMoonshotBaseUrl,
  MOONSHOT_BASE_URL,
  MOONSHOT_CN_BASE_URL,
  MOONSHOT_DEFAULT_MODEL_ID,
} from "./provider-catalog.js";
/** Re-exported moonshot plugin public API, starting with MOONSHOT DEFAULT MODEL REF. */
export { MOONSHOT_DEFAULT_MODEL_REF } from "./onboard.js";
