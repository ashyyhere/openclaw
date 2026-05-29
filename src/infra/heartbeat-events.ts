// infra heartbeat events helpers and runtime behavior.
import { resolveGlobalSingleton } from "../shared/global-singleton.js";
import { notifyListeners, registerListener } from "../shared/listeners.js";

/** Shared type for Heartbeat Indicator Type in src/infra. */
export type HeartbeatIndicatorType = "ok" | "alert" | "error";

/** Shared type for Heartbeat Event Payload in src/infra. */
export type HeartbeatEventPayload = {
  ts: number;
  status: "sent" | "ok-empty" | "ok-token" | "skipped" | "failed";
  to?: string;
  accountId?: string;
  preview?: string;
  durationMs?: number;
  hasMedia?: boolean;
  reason?: string;
  /** The channel this heartbeat was sent to. */
  channel?: string;
  /** Whether the message was silently suppressed (showOk: false). */
  silent?: boolean;
  /** Indicator type for UI status display. */
  indicatorType?: HeartbeatIndicatorType;
};

/** Reused helper for resolve Indicator Type behavior in src/infra. */
export function resolveIndicatorType(
  status: HeartbeatEventPayload["status"],
): HeartbeatIndicatorType | undefined {
  switch (status) {
    case "ok-empty":
    case "ok-token":
      return "ok";
    case "sent":
      return "alert";
    case "failed":
      return "error";
    case "skipped":
      return undefined;
  }
  throw new Error("Unsupported heartbeat status");
}

type HeartbeatEventState = {
  lastHeartbeat: HeartbeatEventPayload | null;
  listeners: Set<(evt: HeartbeatEventPayload) => void>;
};

const HEARTBEAT_EVENT_STATE_KEY = Symbol.for("openclaw.heartbeatEvents.state");

const state = resolveGlobalSingleton<HeartbeatEventState>(HEARTBEAT_EVENT_STATE_KEY, () => ({
  lastHeartbeat: null,
  listeners: new Set<(evt: HeartbeatEventPayload) => void>(),
}));

/** Reused helper for emit Heartbeat Event behavior in src/infra. */
export function emitHeartbeatEvent(evt: Omit<HeartbeatEventPayload, "ts">) {
  const enriched: HeartbeatEventPayload = { ts: Date.now(), ...evt };
  state.lastHeartbeat = enriched;
  notifyListeners(state.listeners, enriched);
}

/** Reused helper for on Heartbeat Event behavior in src/infra. */
export function onHeartbeatEvent(listener: (evt: HeartbeatEventPayload) => void): () => void {
  return registerListener(state.listeners, listener);
}

/** Reused helper for get Last Heartbeat Event behavior in src/infra. */
export function getLastHeartbeatEvent(): HeartbeatEventPayload | null {
  return state.lastHeartbeat;
}

/** Reused helper for reset Heartbeat Events For Test behavior in src/infra. */
export function resetHeartbeatEventsForTest(): void {
  state.lastHeartbeat = null;
  state.listeners.clear();
}
