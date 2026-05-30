/** Converts Bonjour gateway beacons into UI/CLI connection targets. */
import { normalizeOptionalString } from "../shared/string-coerce.js";
import {
  resolveGatewayDiscoveryEndpoint,
  type GatewayBonjourBeacon,
  type GatewayDiscoveryResolvedEndpoint,
} from "./bonjour-discovery.js";

type GatewayDiscoveryTarget = {
  title: string;
  domain: string;
  endpoint: GatewayDiscoveryResolvedEndpoint | null;
  wsUrl: string | null;
  sshPort: number | null;
  sshTarget: string | null;
};

function pickSshPort(beacon: GatewayBonjourBeacon): number | null {
  return typeof beacon.sshPort === "number" && Number.isFinite(beacon.sshPort) && beacon.sshPort > 0
    ? beacon.sshPort
    : null;
}

/** Resolve websocket and SSH target details from one gateway discovery beacon. */
export function buildGatewayDiscoveryTarget(
  beacon: GatewayBonjourBeacon,
  opts?: { sshUser?: string | null },
): GatewayDiscoveryTarget {
  const endpoint = resolveGatewayDiscoveryEndpoint(beacon);
  const sshPort = pickSshPort(beacon);
  const sshUser = normalizeOptionalString(opts?.sshUser) ?? "";
  const baseSshTarget = endpoint ? (sshUser ? `${sshUser}@${endpoint.host}` : endpoint.host) : null;
  const sshTarget =
    baseSshTarget && sshPort && sshPort !== 22 ? `${baseSshTarget}:${sshPort}` : baseSshTarget;
  return {
    title:
      normalizeOptionalString(beacon.displayName || beacon.instanceName || "Gateway") ?? "Gateway",
    domain: normalizeOptionalString(beacon.domain || "local.") ?? "local.",
    endpoint,
    wsUrl: endpoint?.wsUrl ?? null,
    sshPort,
    sshTarget,
  };
}

/** Build a concise human label for discovered gateway picker output. */
export function buildGatewayDiscoveryLabel(beacon: GatewayBonjourBeacon): string {
  const target = buildGatewayDiscoveryTarget(beacon);
  const hint = target.endpoint ? `${target.endpoint.host}:${target.endpoint.port}` : "host unknown";
  return `${target.title} (${hint})`;
}

/** Serialize beacon data with resolved websocket URL for diagnostics/API output. */
export function serializeGatewayDiscoveryBeacon(beacon: GatewayBonjourBeacon) {
  const target = buildGatewayDiscoveryTarget(beacon);
  return {
    instanceName: beacon.instanceName,
    displayName: beacon.displayName ?? null,
    domain: beacon.domain ?? null,
    host: beacon.host ?? null,
    lanHost: beacon.lanHost ?? null,
    tailnetDns: beacon.tailnetDns ?? null,
    gatewayPort: beacon.gatewayPort ?? null,
    sshPort: beacon.sshPort ?? null,
    wsUrl: target.wsUrl,
  };
}
