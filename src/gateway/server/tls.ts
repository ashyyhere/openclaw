// gateway/server tls helpers and runtime behavior.
import type { GatewayTlsConfig } from "../../config/types.gateway.js";
import {
  type GatewayTlsRuntime,
  loadGatewayTlsRuntime as loadGatewayTlsRuntimeConfig,
} from "../../infra/tls/gateway.js";

/** Re-exported API for src/gateway/server, starting with Gateway Tls Runtime. */
export type { GatewayTlsRuntime } from "../../infra/tls/gateway.js";

/** Reused helper for load Gateway Tls Runtime behavior in src/gateway/server. */
export async function loadGatewayTlsRuntime(
  cfg: GatewayTlsConfig | undefined,
  log?: { info?: (msg: string) => void; warn?: (msg: string) => void },
): Promise<GatewayTlsRuntime> {
  return await loadGatewayTlsRuntimeConfig(cfg, log);
}
