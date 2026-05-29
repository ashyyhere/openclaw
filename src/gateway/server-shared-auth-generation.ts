// gateway server shared auth generation helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { resolveGatewayReloadSettings } from "./config-reload-settings.js";

/** Shared type for Shared Gateway Auth Client in src/gateway. */
export type SharedGatewayAuthClient = {
  usesSharedGatewayAuth?: boolean;
  sharedGatewaySessionGeneration?: string;
  socket: { close: (code: number, reason: string) => void };
};

/** Shared type for Shared Gateway Session Generation State in src/gateway. */
export type SharedGatewaySessionGenerationState = {
  current: string | undefined;
  required: string | undefined | null;
};

/** Reused helper for disconnect Stale Shared Gateway Auth Clients behavior in src/gateway. */
export function disconnectStaleSharedGatewayAuthClients(params: {
  clients: Iterable<SharedGatewayAuthClient>;
  expectedGeneration: string | undefined;
}): void {
  for (const gatewayClient of params.clients) {
    if (!gatewayClient.usesSharedGatewayAuth) {
      continue;
    }
    if (gatewayClient.sharedGatewaySessionGeneration === params.expectedGeneration) {
      continue;
    }
    try {
      gatewayClient.socket.close(4001, "gateway auth changed");
    } catch {
      /* ignore */
    }
  }
}

/** Reused helper for disconnect All Shared Gateway Auth Clients behavior in src/gateway. */
export function disconnectAllSharedGatewayAuthClients(
  clients: Iterable<SharedGatewayAuthClient>,
): void {
  for (const gatewayClient of clients) {
    if (!gatewayClient.usesSharedGatewayAuth) {
      continue;
    }
    try {
      gatewayClient.socket.close(4001, "gateway auth changed");
    } catch {
      /* ignore */
    }
  }
}

/** Reused helper for get Required Shared Gateway Session Generation behavior in src/gateway. */
export function getRequiredSharedGatewaySessionGeneration(
  state: SharedGatewaySessionGenerationState,
): string | undefined {
  return state.required === null ? state.current : state.required;
}

/** Reused helper for set Current Shared Gateway Session Generation behavior in src/gateway. */
export function setCurrentSharedGatewaySessionGeneration(
  state: SharedGatewaySessionGenerationState,
  nextGeneration: string | undefined,
): void {
  const previousGeneration = state.current;
  state.current = nextGeneration;
  if (state.required === nextGeneration) {
    state.required = null;
    return;
  }
  if (state.required !== null && previousGeneration !== nextGeneration) {
    state.required = null;
  }
}

/** Reused helper for enforce Shared Gateway Session Generation For Config Write behavior in src/gateway. */
export function enforceSharedGatewaySessionGenerationForConfigWrite(params: {
  state: SharedGatewaySessionGenerationState;
  nextConfig: OpenClawConfig;
  resolveRuntimeSnapshotGeneration: () => string | undefined;
  clients: Iterable<SharedGatewayAuthClient>;
}): void {
  const reloadMode = resolveGatewayReloadSettings(params.nextConfig).mode;
  const nextSharedGatewaySessionGeneration = params.resolveRuntimeSnapshotGeneration();
  if (reloadMode === "off") {
    params.state.current = nextSharedGatewaySessionGeneration;
    params.state.required = nextSharedGatewaySessionGeneration;
    disconnectStaleSharedGatewayAuthClients({
      clients: params.clients,
      expectedGeneration: nextSharedGatewaySessionGeneration,
    });
    return;
  }
  params.state.required = null;
  setCurrentSharedGatewaySessionGeneration(params.state, nextSharedGatewaySessionGeneration);
  disconnectStaleSharedGatewayAuthClients({
    clients: params.clients,
    expectedGeneration: nextSharedGatewaySessionGeneration,
  });
}
