// gateway/server hook client ip config helpers and runtime behavior.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { HookClientIpConfig } from "./hooks-request-handler.js";

/** Reused helper for resolve Hook Client Ip Config behavior in src/gateway/server. */
export function resolveHookClientIpConfig(cfg: OpenClawConfig): HookClientIpConfig {
  return {
    trustedProxies: cfg.gateway?.trustedProxies,
    allowRealIpFallback: cfg.gateway?.allowRealIpFallback === true,
  };
}
