// gateway ws logging helpers and runtime behavior.
/** Shared type for Gateway Ws Log Style in src/gateway. */
export type GatewayWsLogStyle = "auto" | "full" | "compact";

let gatewayWsLogStyle: GatewayWsLogStyle = "auto";

/** Reused helper for set Gateway Ws Log Style behavior in src/gateway. */
export function setGatewayWsLogStyle(style: GatewayWsLogStyle): void {
  gatewayWsLogStyle = style;
}

/** Reused helper for get Gateway Ws Log Style behavior in src/gateway. */
export function getGatewayWsLogStyle(): GatewayWsLogStyle {
  return gatewayWsLogStyle;
}

/** Reused constant for DEFAULT WS SLOW MS behavior in src/gateway. */
export const DEFAULT_WS_SLOW_MS = 50;
