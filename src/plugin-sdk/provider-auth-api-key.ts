// Public API-key onboarding helpers for provider plugins.

/** Re-exported API for src/plugin-sdk, starting with Open Claw Config. */
export type { OpenClawConfig } from "../config/config.js";
/** Re-exported API for src/plugin-sdk, starting with Secret Input. */
export type { SecretInput } from "../config/types.secrets.js";

/** Re-exported API for src/plugin-sdk, starting with upsert Auth Profile. */
export { upsertAuthProfile, upsertAuthProfileWithLock } from "../agents/auth-profiles/profiles.js";
/** Re-exported API for src/plugin-sdk. */
export {
  formatApiKeyPreview,
  normalizeApiKeyInput,
  validateApiKeyInput,
  ensureApiKeyFromOptionEnvOrPrompt,
  normalizeSecretInputModeInput,
  promptSecretRefForSetup,
  resolveSecretInputModeForEnvSelection,
} from "../plugins/provider-auth-input.js";
/** Re-exported API for src/plugin-sdk. */
export {
  applyAuthProfileConfig,
  buildApiKeyCredential,
  upsertApiKeyProfile,
  type ApiKeyStorageOptions,
} from "../plugins/provider-auth-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with create Provider Api Key Auth Method. */
export { createProviderApiKeyAuthMethod } from "../plugins/provider-api-key-auth.js";
/** Re-exported API for src/plugin-sdk. */
export {
  normalizeOptionalSecretInput,
  normalizeSecretInput,
} from "../utils/normalize-secret-input.js";
