import type { FindExtraGatewayServicesOptions } from "../../daemon/inspect.js";

/** Gateway RPC connection options shared by daemon status/probe commands. */
export type GatewayRpcOpts = {
  url?: string;
  token?: string;
  password?: string;
  timeout?: string;
  json?: boolean;
};

/** Options controlling daemon status gathering, probing, and extra-service discovery. */
export type DaemonStatusOptions = {
  rpc: GatewayRpcOpts;
  probe: boolean;
  requireRpc: boolean;
  json: boolean;
} & FindExtraGatewayServicesOptions;

/** Options accepted when installing the managed gateway service. */
export type DaemonInstallOptions = {
  port?: string | number;
  runtime?: string;
  token?: string;
  wrapper?: string;
  force?: boolean;
  json?: boolean;
};

/** Options shared by daemon start/stop/restart/uninstall lifecycle commands. */
export type DaemonLifecycleOptions = {
  json?: boolean;
  force?: boolean;
  safe?: boolean;
  skipDeferral?: boolean;
  wait?: string;
  disable?: boolean;
};
