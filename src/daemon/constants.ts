// daemon constants helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

// Default service labels (canonical + legacy compatibility)
/** Reused constant for GATEWAY LAUNCH AGENT LABEL behavior in src/daemon. */
export const GATEWAY_LAUNCH_AGENT_LABEL = "ai.openclaw.gateway";
/** Reused constant for GATEWAY SYSTEMD SERVICE NAME behavior in src/daemon. */
export const GATEWAY_SYSTEMD_SERVICE_NAME = "openclaw-gateway";
/** Reused constant for GATEWAY WINDOWS TASK NAME behavior in src/daemon. */
export const GATEWAY_WINDOWS_TASK_NAME = "OpenClaw Gateway";
/** Reused constant for GATEWAY SERVICE MARKER behavior in src/daemon. */
export const GATEWAY_SERVICE_MARKER = "openclaw";
/** Reused constant for GATEWAY SERVICE KIND behavior in src/daemon. */
export const GATEWAY_SERVICE_KIND = "gateway";
/** Reused constant for GATEWAY SERVICE RUNTIME PID ENV behavior in src/daemon. */
export const GATEWAY_SERVICE_RUNTIME_PID_ENV = "OPENCLAW_GATEWAY_SERVICE_PID";
const NODE_LAUNCH_AGENT_LABEL = "ai.openclaw.node";
const NODE_SYSTEMD_SERVICE_NAME = "openclaw-node";
const NODE_WINDOWS_TASK_NAME = "OpenClaw Node";
/** Reused constant for NODE SERVICE MARKER behavior in src/daemon. */
export const NODE_SERVICE_MARKER = "openclaw";
/** Reused constant for NODE SERVICE KIND behavior in src/daemon. */
export const NODE_SERVICE_KIND = "node";
/** Reused constant for NODE WINDOWS TASK SCRIPT NAME behavior in src/daemon. */
export const NODE_WINDOWS_TASK_SCRIPT_NAME = "node.cmd";
/** Reused constant for LEGACY GATEWAY SYSTEMD SERVICE NAMES behavior in src/daemon. */
export const LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES: string[] = ["clawdbot-gateway"];

/** Reused helper for normalize Gateway Profile behavior in src/daemon. */
export function normalizeGatewayProfile(profile?: string): string | null {
  const trimmed = profile?.trim();
  if (!trimmed || normalizeLowercaseStringOrEmpty(trimmed) === "default") {
    return null;
  }
  return trimmed;
}

/** Reused helper for resolve Gateway Profile Suffix behavior in src/daemon. */
export function resolveGatewayProfileSuffix(profile?: string): string {
  const normalized = normalizeGatewayProfile(profile);
  return normalized ? `-${normalized}` : "";
}

/** Reused helper for resolve Gateway Launch Agent Label behavior in src/daemon. */
export function resolveGatewayLaunchAgentLabel(profile?: string): string {
  const normalized = normalizeGatewayProfile(profile);
  if (!normalized) {
    return GATEWAY_LAUNCH_AGENT_LABEL;
  }
  return `ai.openclaw.${normalized}`;
}

/** Reused helper for resolve Legacy Gateway Launch Agent Labels behavior in src/daemon. */
export function resolveLegacyGatewayLaunchAgentLabels(profile?: string): string[] {
  void profile;
  return [];
}

/** Reused helper for resolve Gateway Systemd Service Name behavior in src/daemon. */
export function resolveGatewaySystemdServiceName(profile?: string): string {
  const suffix = resolveGatewayProfileSuffix(profile);
  if (!suffix) {
    return GATEWAY_SYSTEMD_SERVICE_NAME;
  }
  return `openclaw-gateway${suffix}`;
}

/** Reused helper for resolve Gateway Windows Task Name behavior in src/daemon. */
export function resolveGatewayWindowsTaskName(profile?: string): string {
  const normalized = normalizeGatewayProfile(profile);
  if (!normalized) {
    return GATEWAY_WINDOWS_TASK_NAME;
  }
  return `OpenClaw Gateway (${normalized})`;
}

/** Reused helper for format Gateway Service Description behavior in src/daemon. */
export function formatGatewayServiceDescription(params?: {
  profile?: string;
  version?: string;
}): string {
  const profile = normalizeGatewayProfile(params?.profile);
  const version = params?.version?.trim();
  const parts: string[] = [];
  if (profile) {
    parts.push(`profile: ${profile}`);
  }
  if (version) {
    parts.push(`v${version}`);
  }
  if (parts.length === 0) {
    return "OpenClaw Gateway";
  }
  return `OpenClaw Gateway (${parts.join(", ")})`;
}

/** Reused helper for resolve Gateway Service Description behavior in src/daemon. */
export function resolveGatewayServiceDescription(params: {
  env: Record<string, string | undefined>;
  environment?: Record<string, string | undefined>;
  description?: string;
}): string {
  return (
    params.description ??
    formatGatewayServiceDescription({
      profile: params.env.OPENCLAW_PROFILE,
      version: params.environment?.OPENCLAW_SERVICE_VERSION ?? params.env.OPENCLAW_SERVICE_VERSION,
    })
  );
}

/** Reused helper for resolve Node Launch Agent Label behavior in src/daemon. */
export function resolveNodeLaunchAgentLabel(): string {
  return NODE_LAUNCH_AGENT_LABEL;
}

/** Reused helper for resolve Node Systemd Service Name behavior in src/daemon. */
export function resolveNodeSystemdServiceName(): string {
  return NODE_SYSTEMD_SERVICE_NAME;
}

/** Reused helper for resolve Node Windows Task Name behavior in src/daemon. */
export function resolveNodeWindowsTaskName(): string {
  return NODE_WINDOWS_TASK_NAME;
}

/** Reused helper for format Node Service Description behavior in src/daemon. */
export function formatNodeServiceDescription(params?: { version?: string }): string {
  const version = params?.version?.trim();
  if (!version) {
    return "OpenClaw Node Host";
  }
  return `OpenClaw Node Host (v${version})`;
}
