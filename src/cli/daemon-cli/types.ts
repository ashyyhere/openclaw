/** Shared option and result types for daemon CLI commands. */
import type { FindExtraGatewayServicesOptions } from "../../daemon/inspect.js";

/** Shared type for Gateway Rpc Opts in src/cli/daemon-cli. */
export type GatewayRpcOpts = {
  url?: string;
  token?: string;
  password?: string;
  timeout?: string;
  json?: boolean;
};

/** Shared type for Daemon Status Options in src/cli/daemon-cli. */
export type DaemonStatusOptions = {
  rpc: GatewayRpcOpts;
  probe: boolean;
  requireRpc: boolean;
  json: boolean;
} & FindExtraGatewayServicesOptions;

/** Shared type for Daemon Install Options in src/cli/daemon-cli. */
export type DaemonInstallOptions = {
  port?: string | number;
  runtime?: string;
  token?: string;
  wrapper?: string;
  force?: boolean;
  json?: boolean;
};

/** Shared type for Daemon Lifecycle Options in src/cli/daemon-cli. */
export type DaemonLifecycleOptions = {
  json?: boolean;
  force?: boolean;
  safe?: boolean;
  skipDeferral?: boolean;
  wait?: string;
  disable?: boolean;
};
