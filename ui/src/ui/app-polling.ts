// Tab-scoped polling helpers for Control UI panes that need quiet background
// refresh while their tab is active.
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

/** Refresh cadence for the nodes tab while it is active. */
export const NODES_ACTIVE_POLL_INTERVAL_MS = 30_000;

/** Start nodes polling if it is not already running. */
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

/** Stop nodes polling and clear its interval handle. */
export function stopNodesPolling(host: PollingHost) {
  if (host.nodesPollInterval == null) {
    return;
  }
  clearInterval(host.nodesPollInterval);
  host.nodesPollInterval = null;
}

/** Start logs polling if it is not already running. */
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

/** Stop logs polling and clear its interval handle. */
export function stopLogsPolling(host: PollingHost) {
  if (host.logsPollInterval == null) {
    return;
  }
  clearInterval(host.logsPollInterval);
  host.logsPollInterval = null;
}

/** Start debug polling if it is not already running. */
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

/** Stop debug polling and clear its interval handle. */
export function stopDebugPolling(host: PollingHost) {
  if (host.debugPollInterval == null) {
    return;
  }
  clearInterval(host.debugPollInterval);
  host.debugPollInterval = null;
}
