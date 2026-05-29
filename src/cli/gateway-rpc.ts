/** Registers generic gateway RPC CLI commands. */
import type { Command } from "commander";
import type {
  GatewayClientMode,
  GatewayClientName,
} from "../../packages/gateway-protocol/src/client-info.js";
import type { OperatorScope } from "../gateway/operator-scopes.js";
import type { DeviceIdentity } from "../infra/device-identity.js";
import { createLazyImportLoader } from "../shared/lazy-promise.js";
import type { GatewayRpcOpts } from "./gateway-rpc.types.js";
/** Re-exported API for src/cli, starting with Gateway Rpc Opts. */
export type { GatewayRpcOpts } from "./gateway-rpc.types.js";

type GatewayRpcRuntimeModule = typeof import("./gateway-rpc.runtime.js");

const gatewayRpcRuntimeLoader = createLazyImportLoader<GatewayRpcRuntimeModule>(
  () => import("./gateway-rpc.runtime.js"),
);

async function loadGatewayRpcRuntime(): Promise<GatewayRpcRuntimeModule> {
  return gatewayRpcRuntimeLoader.load();
}

/** Reused helper for add Gateway Client Options behavior in src/cli. */
export function addGatewayClientOptions(cmd: Command) {
  return cmd
    .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
    .option("--token <token>", "Gateway token (if required)")
    .option("--timeout <ms>", "Timeout in ms", "30000")
    .option("--expect-final", "Wait for final response (agent)", false);
}

/** Reused helper for call Gateway From Cli behavior in src/cli. */
export async function callGatewayFromCli(
  method: string,
  opts: GatewayRpcOpts,
  params?: unknown,
  extra?: {
    clientName?: GatewayClientName;
    mode?: GatewayClientMode;
    deviceIdentity?: DeviceIdentity | null;
    expectFinal?: boolean;
    progress?: boolean;
    scopes?: OperatorScope[];
  },
) {
  const runtime = await loadGatewayRpcRuntime();
  return await runtime.callGatewayFromCliRuntime(method, opts, params, extra);
}
