/** Node daemon runtime option constants and validators. */
import {
  DEFAULT_GATEWAY_DAEMON_RUNTIME,
  isGatewayDaemonRuntime,
  type GatewayDaemonRuntime,
} from "./daemon-runtime.js";

/** Shared type for Node Daemon Runtime in src/commands. */
export type NodeDaemonRuntime = GatewayDaemonRuntime;

/** Reused constant for DEFAULT NODE DAEMON RUNTIME behavior in src/commands. */
export const DEFAULT_NODE_DAEMON_RUNTIME = DEFAULT_GATEWAY_DAEMON_RUNTIME;

/** Reused helper for is Node Daemon Runtime behavior in src/commands. */
export function isNodeDaemonRuntime(value: string | undefined): value is NodeDaemonRuntime {
  return isGatewayDaemonRuntime(value);
}
