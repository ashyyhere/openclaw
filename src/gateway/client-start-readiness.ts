// gateway client start readiness helpers and runtime behavior.
import type {
  GatewayClientStartable,
  GatewayClientStartReadinessOptions,
} from "../../packages/gateway-client/src/readiness.js";
import { startGatewayClientWithReadinessWait } from "../../packages/gateway-client/src/readiness.js";
import { waitForEventLoopReady, type EventLoopReadyResult } from "./event-loop-ready.js";

/** Re-exported API for src/gateway. */
export type {
  GatewayClientStartable,
  GatewayClientStartReadinessOptions,
} from "../../packages/gateway-client/src/readiness.js";

/** Reused helper for start Gateway Client When Event Loop Ready behavior in src/gateway. */
export function startGatewayClientWhenEventLoopReady(
  client: GatewayClientStartable,
  options: GatewayClientStartReadinessOptions = {},
): Promise<EventLoopReadyResult> {
  return startGatewayClientWithReadinessWait(waitForEventLoopReady, client, options);
}
