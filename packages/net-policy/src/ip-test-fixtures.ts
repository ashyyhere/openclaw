// Shared IP literals used by net-policy tests.
/** IPv6 multicast literals expected to be blocked by policy tests. */
export const blockedIpv6MulticastLiterals = ["ff02::1", "ff05::1:3", "[ff02::1]"] as const;
