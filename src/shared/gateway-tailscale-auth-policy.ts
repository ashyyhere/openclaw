// shared gateway tailscale auth policy helpers and runtime behavior.
import type { GatewayAuthMode, GatewayTailscaleMode } from "../config/types.gateway.js";

/** Reused helper for is Unsafe Gateway Tailscale No Auth behavior in src/shared. */
export function isUnsafeGatewayTailscaleNoAuth(params: {
  authMode?: GatewayAuthMode;
  tailscaleMode?: GatewayTailscaleMode;
}): boolean {
  return (
    params.authMode === "none" &&
    (params.tailscaleMode === "serve" || params.tailscaleMode === "funnel")
  );
}

/** Reused helper for format Unsafe Gateway Tailscale No Auth Message behavior in src/shared. */
export function formatUnsafeGatewayTailscaleNoAuthMessage(
  tailscaleMode: GatewayTailscaleMode,
): string {
  if (tailscaleMode === "funnel") {
    return "gateway.tailscale.mode=funnel requires gateway.auth.mode=password; auth.mode=none cannot be used when exposing the gateway through Tailscale Funnel";
  }
  return `gateway.auth.mode=none cannot be used with gateway.tailscale.mode=${tailscaleMode}; configure token, password, or trusted-proxy auth before exposing the gateway through Tailscale`;
}
