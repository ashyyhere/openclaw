// Runtime boundary for plugins provider api key auth runtime behavior.
import { applyAuthProfileConfig, buildApiKeyCredential } from "./provider-auth-helpers.js";
import {
  ensureApiKeyFromOptionEnvOrPrompt,
  normalizeApiKeyInput,
  validateApiKeyInput,
} from "./provider-auth-input.js";
import { applyPrimaryModel } from "./provider-model-primary.js";

/** Reused constant for provider Api Key Auth Runtime behavior in src/plugins. */
export const providerApiKeyAuthRuntime = {
  applyAuthProfileConfig,
  applyPrimaryModel,
  buildApiKeyCredential,
  ensureApiKeyFromOptionEnvOrPrompt,
  normalizeApiKeyInput,
  validateApiKeyInput,
};
