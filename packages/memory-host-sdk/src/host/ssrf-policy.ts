// SSRF policy shape shared with guarded remote memory HTTP calls.
/** Network ranges and hostnames allowed by guarded remote memory fetches. */
export type SsrFPolicy = {
  allowPrivateNetwork?: boolean;
  dangerouslyAllowPrivateNetwork?: boolean;
  allowRfc2544BenchmarkRange?: boolean;
  allowIpv6UniqueLocalRange?: boolean;
  allowedHostnames?: string[];
  hostnameAllowlist?: string[];
};
