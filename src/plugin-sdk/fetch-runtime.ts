// Public fetch/proxy helpers for plugins that need wrapped fetch behavior.

import type { GuardedFetchOptions } from "../infra/net/fetch-guard.js";

/** Resolve runtime fetch and compose fetch calls with caller abort signals. */
export { resolveFetch, wrapFetchWithAbortSignal } from "../infra/fetch.js";
/** Undici HTTP/1 proxy agents for providers that need env-compatible proxy transport. */
export {
  createHttp1EnvHttpProxyAgent,
  createHttp1ProxyAgent,
} from "../infra/net/undici-runtime.js";
/** Managed proxy TLS option helpers for active proxy connections. */
export {
  addActiveManagedProxyTlsOptions,
  resolveActiveManagedProxyTlsOptions,
} from "../infra/net/proxy/managed-proxy-undici.js";
/** Node proxy-agent factory and options exposed to plugin fetch integrations. */
export {
  createNodeProxyAgent,
  type CreateNodeProxyAgentOptions,
} from "../infra/net/node-proxy-agent.js";
/** Environment proxy detection and resolution helpers for guarded outbound fetches. */
export {
  hasEnvHttpProxyConfigured,
  hasEnvHttpProxyAgentConfigured,
  resolveEnvHttpProxyAgentOptions,
  resolveEnvHttpProxyUrl,
  shouldUseEnvHttpProxyForUrl,
} from "../infra/net/proxy-env.js";
/** Build fetch wrappers that route requests through explicit proxy URLs. */
export { getProxyUrlFromFetch, makeProxyFetch } from "../infra/net/proxy-fetch.js";
/** Create DNS-pinned lookup functions for SSRF-aware dispatchers. */
export { createPinnedLookup } from "../infra/net/ssrf.js";
/** Dispatcher policy type used by DNS pinning guards. */
export type { PinnedDispatcherPolicy } from "../infra/net/ssrf.js";

type GuardedFetchPresetOptions = Omit<
  GuardedFetchOptions,
  "mode" | "proxy" | "dangerouslyAllowEnvProxyWithoutPinnedDns"
>;

/** Apply the guarded-fetch preset that permits trusted environment proxy settings. */
export function withTrustedEnvProxyGuardedFetchMode(
  params: GuardedFetchPresetOptions,
): GuardedFetchOptions {
  return { ...params, mode: "trusted_env_proxy" };
}
