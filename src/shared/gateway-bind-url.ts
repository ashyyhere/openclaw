// shared gateway bind url helpers and runtime behavior.
import { normalizeOptionalString } from "./string-coerce.js";

/** Shared type for Gateway Bind Url Result in src/shared. */
export type GatewayBindUrlResult =
  | {
      url: string;
      source: "gateway.bind=custom" | "gateway.bind=tailnet" | "gateway.bind=lan";
    }
  | {
      error: string;
    }
  | null;

/** Reused helper for resolve Gateway Bind Url behavior in src/shared. */
export function resolveGatewayBindUrl(params: {
  bind?: string;
  customBindHost?: string;
  scheme: "ws" | "wss";
  port: number;
  pickTailnetHost: () => string | null;
  pickLanHost: () => string | null;
}): GatewayBindUrlResult {
  const bind = params.bind ?? "loopback";
  if (bind === "custom") {
    const host = normalizeOptionalString(params.customBindHost);
    if (host) {
      return { url: `${params.scheme}://${host}:${params.port}`, source: "gateway.bind=custom" };
    }
    return { error: "gateway.bind=custom requires gateway.customBindHost." };
  }

  if (bind === "tailnet") {
    const host = params.pickTailnetHost();
    if (host) {
      return { url: `${params.scheme}://${host}:${params.port}`, source: "gateway.bind=tailnet" };
    }
    return { error: "gateway.bind=tailnet set, but no tailnet IP was found." };
  }

  if (bind === "lan") {
    const host = params.pickLanHost();
    if (host) {
      return { url: `${params.scheme}://${host}:${params.port}`, source: "gateway.bind=lan" };
    }
    return { error: "gateway.bind=lan set, but no private LAN IP was found." };
  }

  return null;
}
