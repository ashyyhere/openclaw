/** Runtime SDK helper for dispatching gateway server methods in-process. */
import { dispatchGatewayMethodInProcessRaw } from "../gateway/server-plugins.js";
import { getPluginRuntimeGatewayRequestScope } from "../plugins/runtime/gateway-request-scope.js";

/** Shared type for Gateway Method Dispatch Error in src/plugin-sdk. */
export type GatewayMethodDispatchError = {
  code: string;
  message: string;
  details?: unknown;
  retryable?: boolean;
  retryAfterMs?: number;
};

/** Shared type for Gateway Method Dispatch Response in src/plugin-sdk. */
export type GatewayMethodDispatchResponse = {
  ok: boolean;
  payload?: unknown;
  error?: GatewayMethodDispatchError;
  meta?: Record<string, unknown>;
};

/** Shared type for Gateway Method Dispatch Options in src/plugin-sdk. */
export type GatewayMethodDispatchOptions = {
  expectFinal?: boolean;
  timeoutMs?: number;
};

/**
 * Dispatch a Gateway control-plane method from an authenticated plugin request scope.
 */
export async function dispatchGatewayMethod(
  method: string,
  params?: unknown,
  options?: GatewayMethodDispatchOptions,
): Promise<GatewayMethodDispatchResponse> {
  const scope = getPluginRuntimeGatewayRequestScope();
  if (scope?.gatewayMethodDispatchAllowed !== true) {
    const pluginLabel = scope?.pluginId ? ` for plugin "${scope.pluginId}"` : "";
    throw new Error(
      `Gateway method dispatch is reserved for plugin HTTP routes that declare contracts.gatewayMethodDispatch: ["authenticated-request"]${pluginLabel}.`,
    );
  }
  return await dispatchGatewayMethodInProcessRaw(method, params, {
    disableSyntheticClient: true,
    requireScopedClient: true,
    ...(options?.expectFinal !== undefined ? { expectFinal: options.expectFinal } : {}),
    ...(options?.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),
  });
}
