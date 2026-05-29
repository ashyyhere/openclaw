// Network facade for SSRF-guarded remote memory and embedding requests.
/** Fetch wrapper that enforces SSRF policy before remote calls leave the process. */
export { fetchWithSsrFGuard } from "../../../../src/infra/net/fetch-guard.js";
/** Proxy environment helper shared by remote provider clients. */
export { shouldUseEnvHttpProxyForUrl } from "../../../../src/infra/net/proxy-env.js";
/** Builds a narrow SSRF policy from an allowed HTTP base URL hostname. */
export { ssrfPolicyFromHttpBaseUrlAllowedHostname } from "../../../../src/infra/net/ssrf.js";
