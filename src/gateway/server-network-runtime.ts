// gateway server network runtime helpers and runtime behavior.
import { ensureGlobalUndiciEnvProxyDispatcher } from "../infra/net/undici-global-dispatcher.js";

/** Reused helper for bootstrap Gateway Network Runtime behavior in src/gateway. */
export function bootstrapGatewayNetworkRuntime(): void {
  ensureGlobalUndiciEnvProxyDispatcher();
}
