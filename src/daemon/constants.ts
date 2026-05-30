/** Platform service identifiers and profile-aware daemon naming helpers. */
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

// Default service labels (canonical + legacy compatibility)
/** Canonical macOS launchd label for the default Gateway service. */
export const GATEWAY_LAUNCH_AGENT_LABEL = "ai.openclaw.gateway";
/** Canonical systemd service name for the default Gateway service. */
export const GATEWAY_SYSTEMD_SERVICE_NAME = "openclaw-gateway";
/** Canonical Windows scheduled task name for the default Gateway service. */
export const GATEWAY_WINDOWS_TASK_NAME = "OpenClaw Gateway";
/** Service marker used to identify OpenClaw Gateway-managed service files. */
export const GATEWAY_SERVICE_MARKER = "openclaw";
/** Service kind label for Gateway daemon metadata. */
export const GATEWAY_SERVICE_KIND = "gateway";
/** Env var used by managed Gateway processes to publish their runtime pid. */
export const GATEWAY_SERVICE_RUNTIME_PID_ENV = "OPENCLAW_GATEWAY_SERVICE_PID";
const NODE_LAUNCH_AGENT_LABEL = "ai.openclaw.node";
const NODE_SYSTEMD_SERVICE_NAME = "openclaw-node";
const NODE_WINDOWS_TASK_NAME = "OpenClaw Node";
/** Service marker used to identify OpenClaw Node Host-managed service files. */
export const NODE_SERVICE_MARKER = "openclaw";
/** Service kind label for Node Host daemon metadata. */
export const NODE_SERVICE_KIND = "node";
/** Windows task script filename used for the Node Host service. */
export const NODE_WINDOWS_TASK_SCRIPT_NAME = "node.cmd";
/** Legacy systemd service names recognized during Gateway migration/cleanup. */
export const LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES: string[] = ["clawdbot-gateway"];

/** Normalizes Gateway profile names, treating default/empty as the base profile. */
export function normalizeGatewayProfile(profile?: string): string | null {
  const trimmed = profile?.trim();
  if (!trimmed || normalizeLowercaseStringOrEmpty(trimmed) === "default") {
    return null;
  }
  return trimmed;
}

/** Builds the suffix appended to profile-specific Gateway service names. */
export function resolveGatewayProfileSuffix(profile?: string): string {
  const normalized = normalizeGatewayProfile(profile);
  return normalized ? `-${normalized}` : "";
}

/** Resolves the macOS launchd label for a Gateway profile. */
export function resolveGatewayLaunchAgentLabel(profile?: string): string {
  const normalized = normalizeGatewayProfile(profile);
  if (!normalized) {
    return GATEWAY_LAUNCH_AGENT_LABEL;
  }
  return `ai.openclaw.${normalized}`;
}

/** Returns legacy launchd labels for Gateway profile cleanup. */
export function resolveLegacyGatewayLaunchAgentLabels(profile?: string): string[] {
  void profile;
  return [];
}

/** Resolves the systemd service name for a Gateway profile. */
export function resolveGatewaySystemdServiceName(profile?: string): string {
  const suffix = resolveGatewayProfileSuffix(profile);
  if (!suffix) {
    return GATEWAY_SYSTEMD_SERVICE_NAME;
  }
  return `openclaw-gateway${suffix}`;
}

/** Resolves the Windows scheduled task name for a Gateway profile. */
export function resolveGatewayWindowsTaskName(profile?: string): string {
  const normalized = normalizeGatewayProfile(profile);
  if (!normalized) {
    return GATEWAY_WINDOWS_TASK_NAME;
  }
  return `OpenClaw Gateway (${normalized})`;
}

/** Formats a Gateway service description with optional profile and version. */
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

/** Resolves a Gateway service description from explicit text or environment. */
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

/** Returns the macOS launchd label for the Node Host service. */
export function resolveNodeLaunchAgentLabel(): string {
  return NODE_LAUNCH_AGENT_LABEL;
}

/** Returns the systemd service name for the Node Host service. */
export function resolveNodeSystemdServiceName(): string {
  return NODE_SYSTEMD_SERVICE_NAME;
}

/** Returns the Windows scheduled task name for the Node Host service. */
export function resolveNodeWindowsTaskName(): string {
  return NODE_WINDOWS_TASK_NAME;
}

/** Formats a Node Host service description with an optional version. */
export function formatNodeServiceDescription(params?: { version?: string }): string {
  const version = params?.version?.trim();
  if (!version) {
    return "OpenClaw Node Host";
  }
  return `OpenClaw Node Host (v${version})`;
}
