// Lazy auth bridge from memory host SDK into core model credential resolution.
import { requireApiKey } from "../../../../src/agents/model-auth-runtime-shared.js";
import type { resolveApiKeyForProvider as ResolveApiKeyForProvider } from "../../../../src/agents/model-auth.js";

/** Shared API-key requirement helper used by embedding provider adapters. */
export { requireApiKey };

/** Resolves provider API keys lazily to keep the memory SDK import graph light. */
export const resolveApiKeyForProvider: typeof ResolveApiKeyForProvider = async (...args) => {
  const auth = await import("../../../../src/agents/model-auth.js");
  return auth.resolveApiKeyForProvider(...args);
};
