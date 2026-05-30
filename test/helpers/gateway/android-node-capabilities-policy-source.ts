// Android gateway tests use this to decide when remote node capability policy should be fetched.
import type { GatewayConnectionDetails } from "../../../src/gateway/call.js";

/** Remote gateway URLs need policy config; local loopback connections already trust local policy. */
export function shouldFetchRemotePolicyConfig(details: GatewayConnectionDetails): boolean {
  return details.urlSource !== "local loopback";
}
