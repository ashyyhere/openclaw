// packages/gateway-protocol/src client info helpers and runtime behavior.
function normalizeOptionalLowercaseString(raw?: string | null): string | undefined {
  if (typeof raw !== "string") {
    return undefined;
  }
  const normalized = raw.trim().toLowerCase();
  return normalized || undefined;
}

/** Public constant for GATEWAY CLIENT IDS behavior in packages/gateway-protocol. */
export const GATEWAY_CLIENT_IDS = {
  WEBCHAT_UI: "webchat-ui",
  CONTROL_UI: "openclaw-control-ui",
  TUI: "openclaw-tui",
  WEBCHAT: "webchat",
  CLI: "cli",
  GATEWAY_CLIENT: "gateway-client",
  MACOS_APP: "openclaw-macos",
  IOS_APP: "openclaw-ios",
  ANDROID_APP: "openclaw-android",
  NODE_HOST: "node-host",
  TEST: "test",
  FINGERPRINT: "fingerprint",
  PROBE: "openclaw-probe",
} as const;

/** Public type describing Gateway Client Id for packages/gateway-protocol. */
export type GatewayClientId = (typeof GATEWAY_CLIENT_IDS)[keyof typeof GATEWAY_CLIENT_IDS];

// Back-compat naming (internal): these values are IDs, not display names.
/** Public constant for GATEWAY CLIENT NAMES behavior in packages/gateway-protocol. */
export const GATEWAY_CLIENT_NAMES = GATEWAY_CLIENT_IDS;
/** Public type describing Gateway Client Name for packages/gateway-protocol. */
export type GatewayClientName = GatewayClientId;

/** Public constant for GATEWAY CLIENT MODES behavior in packages/gateway-protocol. */
export const GATEWAY_CLIENT_MODES = {
  WEBCHAT: "webchat",
  CLI: "cli",
  UI: "ui",
  BACKEND: "backend",
  NODE: "node",
  PROBE: "probe",
  TEST: "test",
} as const;

/** Public type describing Gateway Client Mode for packages/gateway-protocol. */
export type GatewayClientMode = (typeof GATEWAY_CLIENT_MODES)[keyof typeof GATEWAY_CLIENT_MODES];

/** Public type describing Gateway Client Info for packages/gateway-protocol. */
export type GatewayClientInfo = {
  id: GatewayClientId;
  displayName?: string;
  version: string;
  platform: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  mode: GatewayClientMode;
  instanceId?: string;
};

/** Public constant for GATEWAY CLIENT CAPS behavior in packages/gateway-protocol. */
export const GATEWAY_CLIENT_CAPS = {
  TOOL_EVENTS: "tool-events",
} as const;

/** Public type describing Gateway Client Cap for packages/gateway-protocol. */
export type GatewayClientCap = (typeof GATEWAY_CLIENT_CAPS)[keyof typeof GATEWAY_CLIENT_CAPS];

const GATEWAY_CLIENT_ID_SET = new Set<GatewayClientId>(Object.values(GATEWAY_CLIENT_IDS));
const GATEWAY_CLIENT_MODE_SET = new Set<GatewayClientMode>(Object.values(GATEWAY_CLIENT_MODES));

/** Public helper for normalize Gateway Client Id behavior in packages/gateway-protocol. */
export function normalizeGatewayClientId(raw?: string | null): GatewayClientId | undefined {
  const normalized = normalizeOptionalLowercaseString(raw);
  if (!normalized) {
    return undefined;
  }
  return GATEWAY_CLIENT_ID_SET.has(normalized as GatewayClientId)
    ? (normalized as GatewayClientId)
    : undefined;
}

/** Public helper for normalize Gateway Client Name behavior in packages/gateway-protocol. */
export function normalizeGatewayClientName(raw?: string | null): GatewayClientName | undefined {
  return normalizeGatewayClientId(raw);
}

/** Public helper for normalize Gateway Client Mode behavior in packages/gateway-protocol. */
export function normalizeGatewayClientMode(raw?: string | null): GatewayClientMode | undefined {
  const normalized = normalizeOptionalLowercaseString(raw);
  if (!normalized) {
    return undefined;
  }
  return GATEWAY_CLIENT_MODE_SET.has(normalized as GatewayClientMode)
    ? (normalized as GatewayClientMode)
    : undefined;
}

/** Public helper for has Gateway Client Cap behavior in packages/gateway-protocol. */
export function hasGatewayClientCap(
  caps: string[] | null | undefined,
  cap: GatewayClientCap,
): boolean {
  if (!Array.isArray(caps)) {
    return false;
  }
  return caps.includes(cap);
}
