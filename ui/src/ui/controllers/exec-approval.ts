// ui/src/ui/controllers exec approval helpers and runtime behavior.
import { normalizeOptionalString } from "../string-coerce.ts";

/** Shared type for Exec Approval Request Payload in ui/src/ui/controllers. */
export type ExecApprovalRequestPayload = {
  command: string;
  cwd?: string | null;
  host?: string | null;
  security?: string | null;
  ask?: string | null;
  agentId?: string | null;
  resolvedPath?: string | null;
  sessionKey?: string | null;
  commandSpans?: readonly {
    startIndex: number;
    endIndex: number;
  }[];
  allowedDecisions?: readonly ExecApprovalDecision[];
};

/** Shared type for Exec Approval Decision in ui/src/ui/controllers. */
export type ExecApprovalDecision = "allow-once" | "allow-always" | "deny";

/** Shared type for Exec Approval Request in ui/src/ui/controllers. */
export type ExecApprovalRequest = {
  id: string;
  kind: "exec" | "plugin";
  request: ExecApprovalRequestPayload;
  pluginTitle?: string;
  pluginDescription?: string | null;
  pluginSeverity?: string | null;
  pluginId?: string | null;
  createdAtMs: number;
  expiresAtMs: number;
};

/** Shared type for Exec Approval Resolved in ui/src/ui/controllers. */
export type ExecApprovalResolved = {
  id: string;
  decision?: string | null;
  resolvedBy?: string | null;
  ts?: number | null;
};

/** Shared type for Exec Approval Prompt State in ui/src/ui/controllers. */
export type ExecApprovalPromptState = {
  client: {
    request(method: string, params?: unknown): Promise<unknown>;
  } | null;
  execApprovalQueue: ExecApprovalRequest[];
  execApprovalBusy: boolean;
  execApprovalError: string | null;
  execApprovalRefreshRemovedIds?: Set<string> | null;
};

const APPROVAL_ALREADY_RESOLVED = "APPROVAL_ALREADY_RESOLVED";
const APPROVAL_NOT_FOUND = "APPROVAL_NOT_FOUND";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseCommandSpans(
  value: unknown,
  commandLength: number,
):
  | {
      startIndex: number;
      endIndex: number;
    }[]
  | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const spans = value.filter(
    (
      item,
    ): item is {
      startIndex: number;
      endIndex: number;
    } => {
      if (!isRecord(item)) {
        return false;
      }
      const { startIndex, endIndex } = item;
      return (
        Number.isSafeInteger(startIndex) &&
        Number.isSafeInteger(endIndex) &&
        typeof startIndex === "number" &&
        typeof endIndex === "number" &&
        startIndex >= 0 &&
        endIndex > startIndex &&
        endIndex <= commandLength
      );
    },
  );
  return spans.length > 0 ? spans : undefined;
}

function parseAllowedDecisions(value: unknown): ExecApprovalDecision[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const decisions = value.filter(
    (decision): decision is ExecApprovalDecision =>
      decision === "allow-once" || decision === "allow-always" || decision === "deny",
  );
  return decisions.length > 0 ? decisions : undefined;
}

/** Reused helper for parse Exec Approval Requested behavior in ui/src/ui/controllers. */
export function parseExecApprovalRequested(payload: unknown): ExecApprovalRequest | null {
  if (!isRecord(payload)) {
    return null;
  }
  const id = normalizeOptionalString(payload.id) ?? "";
  const request = payload.request;
  if (!id || !isRecord(request)) {
    return null;
  }
  const command = typeof request.command === "string" ? request.command : "";
  if (command.trim().length === 0) {
    return null;
  }
  const createdAtMs = typeof payload.createdAtMs === "number" ? payload.createdAtMs : 0;
  const expiresAtMs = typeof payload.expiresAtMs === "number" ? payload.expiresAtMs : 0;
  if (!createdAtMs || !expiresAtMs) {
    return null;
  }
  return {
    id,
    kind: "exec",
    request: {
      command,
      cwd: typeof request.cwd === "string" ? request.cwd : null,
      host: typeof request.host === "string" ? request.host : null,
      security: typeof request.security === "string" ? request.security : null,
      ask: typeof request.ask === "string" ? request.ask : null,
      agentId: typeof request.agentId === "string" ? request.agentId : null,
      resolvedPath: typeof request.resolvedPath === "string" ? request.resolvedPath : null,
      sessionKey: typeof request.sessionKey === "string" ? request.sessionKey : null,
      commandSpans: parseCommandSpans(request.commandSpans, command.length),
      allowedDecisions: parseAllowedDecisions(request.allowedDecisions),
    },
    createdAtMs,
    expiresAtMs,
  };
}

/** Reused helper for parse Exec Approval Resolved behavior in ui/src/ui/controllers. */
export function parseExecApprovalResolved(payload: unknown): ExecApprovalResolved | null {
  if (!isRecord(payload)) {
    return null;
  }
  const id = normalizeOptionalString(payload.id) ?? "";
  if (!id) {
    return null;
  }
  return {
    id,
    decision: typeof payload.decision === "string" ? payload.decision : null,
    resolvedBy: typeof payload.resolvedBy === "string" ? payload.resolvedBy : null,
    ts: typeof payload.ts === "number" ? payload.ts : null,
  };
}

/** Reused helper for parse Plugin Approval Requested behavior in ui/src/ui/controllers. */
export function parsePluginApprovalRequested(payload: unknown): ExecApprovalRequest | null {
  if (!isRecord(payload)) {
    return null;
  }
  const id = normalizeOptionalString(payload.id) ?? "";
  if (!id) {
    return null;
  }
  const createdAtMs = typeof payload.createdAtMs === "number" ? payload.createdAtMs : 0;
  const expiresAtMs = typeof payload.expiresAtMs === "number" ? payload.expiresAtMs : 0;
  if (!createdAtMs || !expiresAtMs) {
    return null;
  }
  // title, description, severity, pluginId, agentId, sessionKey live inside payload.request
  const request = isRecord(payload.request) ? payload.request : {};
  const title = normalizeOptionalString(request.title) ?? "";
  if (!title) {
    return null;
  }
  const description = typeof request.description === "string" ? request.description : null;
  const severity = typeof request.severity === "string" ? request.severity : null;
  const pluginId = typeof request.pluginId === "string" ? request.pluginId : null;

  return {
    id,
    kind: "plugin",
    request: {
      command: title,
      agentId: typeof request.agentId === "string" ? request.agentId : null,
      sessionKey: typeof request.sessionKey === "string" ? request.sessionKey : null,
      allowedDecisions: parseAllowedDecisions(request.allowedDecisions),
    },
    pluginTitle: title,
    pluginDescription: description,
    pluginSeverity: severity,
    pluginId,
    createdAtMs,
    expiresAtMs,
  };
}

/** Reused helper for prune Exec Approval Queue behavior in ui/src/ui/controllers. */
export function pruneExecApprovalQueue(queue: ExecApprovalRequest[]): ExecApprovalRequest[] {
  const now = Date.now();
  return queue.filter((entry) => entry.expiresAtMs > now);
}

/** Reused helper for add Exec Approval behavior in ui/src/ui/controllers. */
export function addExecApproval(
  queue: ExecApprovalRequest[],
  entry: ExecApprovalRequest,
): ExecApprovalRequest[] {
  const next = pruneExecApprovalQueue(queue).filter((item) => item.id !== entry.id);
  next.unshift(entry);
  return next;
}

/** Reused helper for remove Exec Approval behavior in ui/src/ui/controllers. */
export function removeExecApproval(
  queue: ExecApprovalRequest[],
  id: string,
): ExecApprovalRequest[] {
  return pruneExecApprovalQueue(queue).filter((entry) => entry.id !== id);
}

function readGatewayErrorCode(err: unknown): string | null {
  if (!isRecord(err)) {
    return null;
  }
  return normalizeOptionalString(err.gatewayCode) ?? null;
}

function readGatewayErrorReason(err: unknown): string | null {
  if (!isRecord(err)) {
    return null;
  }
  const { details } = err;
  if (!isRecord(details)) {
    return null;
  }
  return normalizeOptionalString(details.reason) ?? null;
}

/** Reused helper for is Stale Approval Resolution Error behavior in ui/src/ui/controllers. */
export function isStaleApprovalResolutionError(err: unknown): boolean {
  if (!(err instanceof Error)) {
    return false;
  }
  const gatewayCode = readGatewayErrorCode(err);
  const reason = readGatewayErrorReason(err);
  if (reason === APPROVAL_ALREADY_RESOLVED || reason === APPROVAL_NOT_FOUND) {
    return true;
  }
  if (gatewayCode === APPROVAL_NOT_FOUND) {
    return true;
  }
  return /unknown or expired approval id/i.test(err.message);
}

function parseApprovalList(
  payload: unknown,
  parseEntry: (entry: unknown) => ExecApprovalRequest | null,
): ExecApprovalRequest[] | null {
  if (!Array.isArray(payload)) {
    return null;
  }
  return payload.flatMap((entry) => {
    const parsed = parseEntry(entry);
    return parsed ? [parsed] : [];
  });
}

function sortApprovalsNewestFirst(queue: ExecApprovalRequest[]): ExecApprovalRequest[] {
  return queue.toSorted((a, b) => b.createdAtMs - a.createdAtMs);
}

function currentApprovalsForKind(
  queue: ExecApprovalRequest[],
  kind: ExecApprovalRequest["kind"],
): ExecApprovalRequest[] {
  return pruneExecApprovalQueue(queue).filter((entry) => entry.kind === kind);
}

function mergeRefreshedApprovalQueue(
  refreshed: ExecApprovalRequest[],
  refreshStartedWith: ExecApprovalRequest[],
  currentQueue: ExecApprovalRequest[],
  removedDuringRefresh: ReadonlySet<string>,
): ExecApprovalRequest[] {
  const refreshStartIds = new Set(refreshStartedWith.map((entry) => entry.id));
  const prunedCurrentQueue = pruneExecApprovalQueue(currentQueue);
  const currentQueueIds = new Set(prunedCurrentQueue.map((entry) => entry.id));
  const currentRefreshed = pruneExecApprovalQueue(refreshed).filter(
    (entry) =>
      !removedDuringRefresh.has(entry.id) &&
      (!refreshStartIds.has(entry.id) || currentQueueIds.has(entry.id)),
  );
  const refreshedIds = new Set(currentRefreshed.map((entry) => entry.id));
  const arrivedDuringRefresh = prunedCurrentQueue.filter(
    (entry) => !refreshStartIds.has(entry.id) && !refreshedIds.has(entry.id),
  );
  return sortApprovalsNewestFirst([...currentRefreshed, ...arrivedDuringRefresh]);
}

function scheduleApprovalExpiryPrune(
  state: ExecApprovalPromptState,
  entry: ExecApprovalRequest,
): void {
  const delay = Math.max(0, entry.expiresAtMs - Date.now() + 500);
  globalThis.setTimeout(() => {
    removeExecApprovalFromState(state, entry.id);
  }, delay);
}

function removeExecApprovalFromState(state: ExecApprovalPromptState, id: string): void {
  const activeId = state.execApprovalQueue[0]?.id ?? null;
  state.execApprovalQueue = removeExecApproval(state.execApprovalQueue, id);
  if (activeId !== (state.execApprovalQueue[0]?.id ?? null)) {
    state.execApprovalError = null;
  }
}

/** Reused helper for enqueue Exec Approval Prompt behavior in ui/src/ui/controllers. */
export function enqueueExecApprovalPrompt(
  state: ExecApprovalPromptState,
  entry: ExecApprovalRequest,
): void {
  state.execApprovalQueue = addExecApproval(state.execApprovalQueue, entry);
  state.execApprovalError = null;
  scheduleApprovalExpiryPrune(state, entry);
}

/** Reused helper for refresh Pending Approval Queue behavior in ui/src/ui/controllers. */
export async function refreshPendingApprovalQueue(state: ExecApprovalPromptState): Promise<void> {
  const client = state.client;
  if (!client) {
    return;
  }
  const removedDuringRefresh = state.execApprovalRefreshRemovedIds ?? new Set<string>();
  const ownsRemovedSet = !state.execApprovalRefreshRemovedIds;
  if (ownsRemovedSet) {
    state.execApprovalRefreshRemovedIds = removedDuringRefresh;
  }
  const refreshStartedWith = pruneExecApprovalQueue(state.execApprovalQueue);
  try {
    const [execResult, pluginResult] = await Promise.allSettled([
      client.request("exec.approval.list", {}),
      client.request("plugin.approval.list", {}),
    ]);
    const execApprovals =
      execResult.status === "fulfilled"
        ? (parseApprovalList(execResult.value, parseExecApprovalRequested) ?? [])
        : currentApprovalsForKind(state.execApprovalQueue, "exec");
    const pluginApprovals =
      pluginResult.status === "fulfilled"
        ? (parseApprovalList(pluginResult.value, parsePluginApprovalRequested) ?? [])
        : currentApprovalsForKind(state.execApprovalQueue, "plugin");
    const refreshed = mergeRefreshedApprovalQueue(
      sortApprovalsNewestFirst([...execApprovals, ...pluginApprovals]),
      refreshStartedWith,
      state.execApprovalQueue,
      removedDuringRefresh,
    );
    state.execApprovalQueue = refreshed;
    for (const entry of refreshed) {
      scheduleApprovalExpiryPrune(state, entry);
    }
  } finally {
    if (ownsRemovedSet) {
      state.execApprovalRefreshRemovedIds = null;
    }
  }
}

/** Reused helper for dismiss Exec Approval Prompt behavior in ui/src/ui/controllers. */
export function dismissExecApprovalPrompt(state: ExecApprovalPromptState, id: string): void {
  removeExecApprovalFromState(state, id);
  state.execApprovalRefreshRemovedIds?.add(id);
  state.execApprovalError = null;
}

/** Reused helper for clear Resolved Exec Approval Prompt behavior in ui/src/ui/controllers. */
export function clearResolvedExecApprovalPrompt(state: ExecApprovalPromptState, id: string): void {
  removeExecApprovalFromState(state, id);
  state.execApprovalRefreshRemovedIds?.add(id);
}
