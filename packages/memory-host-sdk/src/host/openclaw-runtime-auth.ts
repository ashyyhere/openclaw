// packages/memory-host-sdk/src/host openclaw runtime auth helpers and runtime behavior.
import { requireApiKey } from "../../../../src/agents/model-auth-runtime-shared.js";
import type { resolveApiKeyForProvider as ResolveApiKeyForProvider } from "../../../../src/agents/model-auth.js";

/** Re-exported public API for packages/memory-host-sdk, starting with require Api Key. */
export { requireApiKey };

/** Public constant for resolve Api Key For Provider behavior in packages/memory-host-sdk. */
export const resolveApiKeyForProvider: typeof ResolveApiKeyForProvider = async (...args) => {
  const auth = await import("../../../../src/agents/model-auth.js");
  return auth.resolveApiKeyForProvider(...args);
};
