// Best-effort network discovery helpers for user-facing gateway display.
import type { GatewayBindMode } from "../config/types.js";
import { pickPrimaryLanIPv4, resolveGatewayBindHost } from "../gateway/net.js";
import { pickPrimaryTailnetIPv4 } from "./tailnet.js";

function summarizeDisplayNetworkError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (message) {
      return message;
    }
  }
  return "network interface discovery failed";
}

function fallbackBindHostForDisplay(bindMode: GatewayBindMode, customBindHost?: string): string {
  if (bindMode === "lan") {
    return "0.0.0.0";
  }
  if (bindMode === "custom") {
    return customBindHost?.trim() || "0.0.0.0";
  }
  return "127.0.0.1";
}

/** Returns the primary LAN IPv4 when discovery succeeds. */
export function pickBestEffortPrimaryLanIPv4(): string | undefined {
  try {
    return pickPrimaryLanIPv4();
  } catch {
    return undefined;
  }
}

/** Returns Tailnet IPv4 or a display-safe warning when discovery fails. */
export function inspectBestEffortPrimaryTailnetIPv4(params?: { warningPrefix?: string }): {
  tailnetIPv4: string | undefined;
  warning?: string;
} {
  try {
    return { tailnetIPv4: pickPrimaryTailnetIPv4() };
  } catch (error) {
    const prefix = params?.warningPrefix?.trim();
    const warning = prefix ? `${prefix}: ${summarizeDisplayNetworkError(error)}.` : undefined;
    return { tailnetIPv4: undefined, ...(warning ? { warning } : {}) };
  }
}

/** Resolves a display bind host with fallback and optional warning text. */
export async function resolveBestEffortGatewayBindHostForDisplay(params: {
  bindMode: GatewayBindMode;
  customBindHost?: string;
  warningPrefix?: string;
}): Promise<{ bindHost: string; warning?: string }> {
  try {
    return {
      bindHost: await resolveGatewayBindHost(params.bindMode, params.customBindHost),
    };
  } catch (error) {
    const prefix = params.warningPrefix?.trim();
    const warning = prefix ? `${prefix}: ${summarizeDisplayNetworkError(error)}.` : undefined;
    return {
      bindHost: fallbackBindHostForDisplay(params.bindMode, params.customBindHost),
      ...(warning ? { warning } : {}),
    };
  }
}
