// packages/gateway-client/src readiness helpers and runtime behavior.
import type { GatewayClientOptions } from "./client.js";
import {
  waitForEventLoopReady,
  type EventLoopReadyOptions,
  type EventLoopReadyResult,
} from "./event-loop-ready.js";
import { resolveConnectChallengeTimeoutMs } from "./timeouts.js";

/** Public type describing Gateway Client Startable for packages/gateway-client. */
export type GatewayClientStartable = {
  start(): void;
};

/** Public type describing Event Loop Ready Waiter for packages/gateway-client. */
export type EventLoopReadyWaiter = (
  options?: EventLoopReadyOptions,
) => Promise<EventLoopReadyResult>;

/** Public type describing Gateway Client Start Readiness Options for packages/gateway-client. */
export type GatewayClientStartReadinessOptions = {
  timeoutMs?: number;
  clientOptions?: Pick<
    GatewayClientOptions,
    "connectChallengeTimeoutMs" | "connectDelayMs" | "preauthHandshakeTimeoutMs"
  >;
  signal?: AbortSignal;
};

function resolveGatewayClientStartReadinessTimeoutMs(
  options: GatewayClientStartReadinessOptions = {},
): number {
  if (typeof options.timeoutMs === "number" && Number.isFinite(options.timeoutMs)) {
    return options.timeoutMs;
  }
  const clientOptions = options.clientOptions ?? {};
  const timeoutOverride =
    typeof clientOptions.connectChallengeTimeoutMs === "number" &&
    Number.isFinite(clientOptions.connectChallengeTimeoutMs)
      ? clientOptions.connectChallengeTimeoutMs
      : typeof clientOptions.connectDelayMs === "number" &&
          Number.isFinite(clientOptions.connectDelayMs)
        ? clientOptions.connectDelayMs
        : undefined;
  return resolveConnectChallengeTimeoutMs(timeoutOverride, {
    configuredTimeoutMs: clientOptions.preauthHandshakeTimeoutMs,
  });
}

/** Public helper for start Gateway Client With Readiness Wait behavior in packages/gateway-client. */
export async function startGatewayClientWithReadinessWait(
  waitForReady: EventLoopReadyWaiter,
  client: GatewayClientStartable,
  options: GatewayClientStartReadinessOptions = {},
): Promise<EventLoopReadyResult> {
  const readiness = await waitForReady({
    maxWaitMs: resolveGatewayClientStartReadinessTimeoutMs(options),
    signal: options.signal,
  });
  if (readiness.ready && !readiness.aborted && options.signal?.aborted !== true) {
    client.start();
  }
  return readiness;
}

/** Public helper for start Gateway Client When Event Loop Ready behavior in packages/gateway-client. */
export async function startGatewayClientWhenEventLoopReady(
  client: GatewayClientStartable,
  options: GatewayClientStartReadinessOptions = {},
): Promise<EventLoopReadyResult> {
  return startGatewayClientWithReadinessWait(waitForEventLoopReady, client, options);
}
