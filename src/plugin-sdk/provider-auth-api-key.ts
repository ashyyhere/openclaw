// Public API-key onboarding helpers for provider plugins.

/** Root config type accepted by provider API-key setup helpers. */
export type { OpenClawConfig } from "../config/config.js";
/** Secret input type accepted as plaintext or a structured secret reference. */
export type { SecretInput } from "../config/types.secrets.js";

/** Auth-profile store writers used by provider setup flows. */
export { upsertAuthProfile, upsertAuthProfileWithLock } from "../agents/auth-profiles/profiles.js";
/** API-key input normalization and prompting helpers for setup flows. */
export {
  formatApiKeyPreview,
  normalizeApiKeyInput,
  validateApiKeyInput,
  ensureApiKeyFromOptionEnvOrPrompt,
  normalizeSecretInputModeInput,
  promptSecretRefForSetup,
  resolveSecretInputModeForEnvSelection,
} from "../plugins/provider-auth-input.js";
/** Provider API-key credential/profile helpers shared with bundled plugins. */
export {
  applyAuthProfileConfig,
  buildApiKeyCredential,
  upsertApiKeyProfile,
  type ApiKeyStorageOptions,
} from "../plugins/provider-auth-helpers.js";
/** Build a provider auth method backed by API-key setup helpers. */
export { createProviderApiKeyAuthMethod } from "../plugins/provider-api-key-auth.js";
/** Secret-input normalization helpers for config values and prompt results. */
export {
  normalizeOptionalSecretInput,
  normalizeSecretInput,
} from "../utils/normalize-secret-input.js";
