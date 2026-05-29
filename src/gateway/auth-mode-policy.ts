// gateway auth mode policy helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { hasConfiguredSecretInput } from "../config/types.secrets.js";

/** Reused constant for EXPLICIT GATEWAY AUTH MODE REQUIRED ERROR behavior in src/gateway. */
export const EXPLICIT_GATEWAY_AUTH_MODE_REQUIRED_ERROR =
  "Invalid config: gateway.auth.token and gateway.auth.password are both configured, but gateway.auth.mode is unset. Set gateway.auth.mode to token or password.";

/** Reused helper for has Ambiguous Gateway Auth Mode Config behavior in src/gateway. */
export function hasAmbiguousGatewayAuthModeConfig(cfg: OpenClawConfig): boolean {
  const auth = cfg.gateway?.auth;
  if (!auth) {
    return false;
  }
  if (typeof auth.mode === "string" && auth.mode.trim().length > 0) {
    return false;
  }
  const defaults = cfg.secrets?.defaults;
  const tokenConfigured = hasConfiguredSecretInput(auth.token, defaults);
  const passwordConfigured = hasConfiguredSecretInput(auth.password, defaults);
  return tokenConfigured && passwordConfigured;
}

/** Reused helper for assert Explicit Gateway Auth Mode When Both Configured behavior in src/gateway. */
export function assertExplicitGatewayAuthModeWhenBothConfigured(cfg: OpenClawConfig): void {
  if (!hasAmbiguousGatewayAuthModeConfig(cfg)) {
    return;
  }
  throw new Error(EXPLICIT_GATEWAY_AUTH_MODE_REQUIRED_ERROR);
}
