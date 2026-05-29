// Narrow SSRF helpers for extensions that need pinned-dispatcher and policy
// utilities without loading the full infra-runtime surface.

/** Re-exported API for src/plugin-sdk. */
export {
  closeDispatcher,
  createPinnedDispatcher,
  SsrFBlockedError,
  isBlockedHostnameOrIp,
  isPrivateIpAddress,
  resolvePinnedHostname,
  resolvePinnedHostnameWithPolicy,
  resolveSsrFPolicyForUrl,
  ssrfPolicyFromHttpBaseUrlAllowedHostname,
  ssrfPolicyFromHttpBaseUrlAllowedOrigin,
  type LookupFn,
  type SsrFPolicy,
} from "../infra/net/ssrf.js";
/** Re-exported API for src/plugin-sdk, starting with format Error Message. */
export { formatErrorMessage } from "../infra/errors.js";
/** Re-exported API for src/plugin-sdk, starting with fetch With Ssr FGuard. */
export { fetchWithSsrFGuard } from "../infra/net/fetch-guard.js";
/** Re-exported API for src/plugin-sdk. */
export {
  assertHttpUrlTargetsPrivateNetwork,
  buildHostnameAllowlistPolicyFromSuffixAllowlist,
  createLegacyPrivateNetworkDoctorContract,
  hasLegacyFlatAllowPrivateNetworkAlias,
  isPrivateNetworkOptInEnabled,
  mergeSsrFPolicies,
  migrateLegacyFlatAllowPrivateNetworkAlias,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  ssrfPolicyFromPrivateNetworkOptIn,
  ssrfPolicyFromAllowPrivateNetwork,
} from "./ssrf-policy.js";
/** Re-exported API for src/plugin-sdk, starting with is Private Or Loopback Host. */
export { isPrivateOrLoopbackHost } from "../gateway/net.js";
