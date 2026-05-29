// Public Moonshot plugin API barrel for contract tests and core fast paths.
/** Re-exported moonshot plugin public API. */
export {
  applyMoonshotNativeStreamingUsageCompat,
  buildMoonshotProvider,
  isNativeMoonshotBaseUrl,
  MOONSHOT_BASE_URL,
  MOONSHOT_CN_BASE_URL,
  MOONSHOT_DEFAULT_MODEL_ID,
} from "./provider-catalog.js";
/** Default Moonshot model ref used by onboarding presets. */
export { MOONSHOT_DEFAULT_MODEL_REF } from "./onboard.js";
