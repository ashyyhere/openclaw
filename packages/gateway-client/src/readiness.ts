// Helpers for delaying gateway-client start until the event loop is responsive.
import type { GatewayClientOptions } from "./client.js";
import {
  waitForEventLoopReady,
  type EventLoopReadyOptions,
  type EventLoopReadyResult,
} from "./event-loop-ready.js";
import { resolveConnectChallengeTimeoutMs } from "./timeouts.js";

/** Minimal client shape needed by readiness start helpers. */
export type GatewayClientStartable = {
  start(): void;
};

/** Injectable event-loop readiness waiter used by tests and clients. */
export type EventLoopReadyWaiter = (
  options?: EventLoopReadyOptions,
) => Promise<EventLoopReadyResult>;

/** Options for deriving readiness wait timeout before starting a client. */
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

/** Start a client only after an injected readiness waiter reports success. */
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

/** Start a client after the default event-loop readiness probe succeeds. */
export async function startGatewayClientWhenEventLoopReady(
  client: GatewayClientStartable,
  options: GatewayClientStartReadinessOptions = {},
): Promise<EventLoopReadyResult> {
  return startGatewayClientWithReadinessWait(waitForEventLoopReady, client, options);
}
