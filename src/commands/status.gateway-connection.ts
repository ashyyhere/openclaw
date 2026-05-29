/** Logs gateway connection details for status-all command runs. */
import type { RuntimeEnv } from "../runtime.js";
import type { NodeOnlyGatewayInfo } from "./status.node-mode.js";
import type { StatusScanOverviewResult } from "./status.scan-overview.ts";

/** Reused helper for log Gateway Connection Details behavior in src/commands. */
export function logGatewayConnectionDetails(params: {
  runtime: Pick<RuntimeEnv, "log">;
  info: (value: string) => string;
  message: string;
  trailingBlankLine?: boolean;
}) {
  params.runtime.log(params.info("Gateway connection:"));
  for (const line of params.message.split("\n")) {
    params.runtime.log(`  ${line}`);
  }
  if (params.trailingBlankLine) {
    params.runtime.log("");
  }
}

/** Reused helper for resolve Status All Connection Details behavior in src/commands. */
export function resolveStatusAllConnectionDetails(params: {
  nodeOnlyGateway: NodeOnlyGatewayInfo | null;
  remoteUrlMissing: boolean;
  gatewayConnection: StatusScanOverviewResult["gatewaySnapshot"]["gatewayConnection"];
  bindMode?: string | null;
  configPath: string;
}): string {
  if (params.nodeOnlyGateway) {
    return params.nodeOnlyGateway.connectionDetails;
  }
  if (!params.remoteUrlMissing) {
    return params.gatewayConnection.message;
  }
  return [
    "Gateway mode: remote",
    "Gateway target: (missing gateway.remote.url)",
    `Config: ${params.configPath}`,
    `Bind: ${params.bindMode ?? "loopback"}`,
    `Local fallback (used for probes): ${params.gatewayConnection.url}`,
    "Fix: set gateway.remote.url, or set gateway.mode=local.",
  ].join("\n");
}
