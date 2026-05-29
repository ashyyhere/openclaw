// ui/src/ui app polling helpers and runtime behavior.
import type { DebugState } from "./controllers/debug.ts";
import { loadDebug } from "./controllers/debug.ts";
import type { LogsState } from "./controllers/logs.ts";
import { loadLogs } from "./controllers/logs.ts";
import type { NodesState } from "./controllers/nodes.ts";
import { loadNodes } from "./controllers/nodes.ts";

type PollingHost = {
  nodesPollInterval: number | null;
  logsPollInterval: number | null;
  debugPollInterval: number | null;
  tab: string;
};

/** Reused constant for NODES ACTIVE POLL INTERVAL MS behavior in ui/src/ui. */
export const NODES_ACTIVE_POLL_INTERVAL_MS = 30_000;

/** Reused helper for start Nodes Polling behavior in ui/src/ui. */
export function startNodesPolling(host: PollingHost) {
  if (host.nodesPollInterval != null) {
    return;
  }
  host.nodesPollInterval = window.setInterval(() => {
    if (host.tab !== "nodes") {
      return;
    }
    void loadNodes(host as unknown as NodesState, { quiet: true });
  }, NODES_ACTIVE_POLL_INTERVAL_MS);
}

/** Reused helper for stop Nodes Polling behavior in ui/src/ui. */
export function stopNodesPolling(host: PollingHost) {
  if (host.nodesPollInterval == null) {
    return;
  }
  clearInterval(host.nodesPollInterval);
  host.nodesPollInterval = null;
}

/** Reused helper for start Logs Polling behavior in ui/src/ui. */
export function startLogsPolling(host: PollingHost) {
  if (host.logsPollInterval != null) {
    return;
  }
  host.logsPollInterval = window.setInterval(() => {
    if (host.tab !== "logs") {
      return;
    }
    void loadLogs(host as unknown as LogsState, { quiet: true });
  }, 2000);
}

/** Reused helper for stop Logs Polling behavior in ui/src/ui. */
export function stopLogsPolling(host: PollingHost) {
  if (host.logsPollInterval == null) {
    return;
  }
  clearInterval(host.logsPollInterval);
  host.logsPollInterval = null;
}

/** Reused helper for start Debug Polling behavior in ui/src/ui. */
export function startDebugPolling(host: PollingHost) {
  if (host.debugPollInterval != null) {
    return;
  }
  host.debugPollInterval = window.setInterval(() => {
    if (host.tab !== "debug") {
      return;
    }
    void loadDebug(host as unknown as DebugState);
  }, 3000);
}

/** Reused helper for stop Debug Polling behavior in ui/src/ui. */
export function stopDebugPolling(host: PollingHost) {
  if (host.debugPollInterval == null) {
    return;
  }
  clearInterval(host.debugPollInterval);
  host.debugPollInterval = null;
}
