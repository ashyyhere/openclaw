// extensions/browser/src/infra/net ssrf helpers and runtime behavior.
export {
  SsrFBlockedError,
  isPrivateNetworkAllowedByPolicy,
  resolvePinnedHostnameWithPolicy,
  type LookupFn,
  type SsrFPolicy,
} from "../../sdk-security-runtime.js";
