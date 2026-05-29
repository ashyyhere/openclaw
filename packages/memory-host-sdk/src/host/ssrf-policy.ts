// packages/memory-host-sdk/src/host ssrf policy helpers and runtime behavior.
/** Public type describing Ssr FPolicy for packages/memory-host-sdk. */
export type SsrFPolicy = {
  allowPrivateNetwork?: boolean;
  dangerouslyAllowPrivateNetwork?: boolean;
  allowRfc2544BenchmarkRange?: boolean;
  allowIpv6UniqueLocalRange?: boolean;
  allowedHostnames?: string[];
  hostnameAllowlist?: string[];
};
