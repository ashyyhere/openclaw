// Public fetch/proxy helpers for plugins that need wrapped fetch behavior.

import type { GuardedFetchOptions } from "../infra/net/fetch-guard.js";

/** Re-exported API for src/plugin-sdk, starting with resolve Fetch. */
export { resolveFetch, wrapFetchWithAbortSignal } from "../infra/fetch.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createHttp1EnvHttpProxyAgent,
  createHttp1ProxyAgent,
} from "../infra/net/undici-runtime.js";
/** Re-exported API for src/plugin-sdk. */
export {
  addActiveManagedProxyTlsOptions,
  resolveActiveManagedProxyTlsOptions,
} from "../infra/net/proxy/managed-proxy-undici.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createNodeProxyAgent,
  type CreateNodeProxyAgentOptions,
} from "../infra/net/node-proxy-agent.js";
/** Re-exported API for src/plugin-sdk. */
export {
  hasEnvHttpProxyConfigured,
  hasEnvHttpProxyAgentConfigured,
  resolveEnvHttpProxyAgentOptions,
  resolveEnvHttpProxyUrl,
  shouldUseEnvHttpProxyForUrl,
} from "../infra/net/proxy-env.js";
/** Re-exported API for src/plugin-sdk, starting with get Proxy Url From Fetch. */
export { getProxyUrlFromFetch, makeProxyFetch } from "../infra/net/proxy-fetch.js";
/** Re-exported API for src/plugin-sdk, starting with create Pinned Lookup. */
export { createPinnedLookup } from "../infra/net/ssrf.js";
/** Re-exported API for src/plugin-sdk, starting with Pinned Dispatcher Policy. */
export type { PinnedDispatcherPolicy } from "../infra/net/ssrf.js";

type GuardedFetchPresetOptions = Omit<
  GuardedFetchOptions,
  "mode" | "proxy" | "dangerouslyAllowEnvProxyWithoutPinnedDns"
>;

/** Reused helper for with Trusted Env Proxy Guarded Fetch Mode behavior in src/plugin-sdk. */
export function withTrustedEnvProxyGuardedFetchMode(
  params: GuardedFetchPresetOptions,
): GuardedFetchOptions {
  return { ...params, mode: "trusted_env_proxy" };
}
