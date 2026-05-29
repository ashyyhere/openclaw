// Diagnostic run activity tracker: correlates internal model/tool/run events
// into per-session active-work snapshots for stuck-session heuristics.
import {
  onInternalDiagnosticEvent,
  type DiagnosticEventPayload,
  type DiagnosticSessionActiveWorkKind,
} from "../infra/diagnostic-events.js";

type SessionActivity = {
  sessionId?: string;
  sessionKey?: string;
  activeEmbeddedRuns: Set<string>;
  activeTools: Map<string, ActiveTool>;
  activeModelCalls: Set<string>;
  lastProgressAt: number;
  lastProgressReason?: string;
};

type ActiveTool = {
  toolName: string;
  toolCallId?: string;
  startedAt: number;
  lastProgressAt: number;
};

type DiagnosticToolStartedActivityEvent = Pick<
  Extract<DiagnosticEventPayload, { type: "tool.execution.started" }>,
  "runId" | "sessionId" | "sessionKey" | "toolName" | "toolCallId"
>;

type DiagnosticModelStartedActivityEvent = Pick<
  Extract<DiagnosticEventPayload, { type: "model.call.started" }>,
  "runId" | "sessionId" | "sessionKey" | "provider" | "model"
>;

type DiagnosticRunProgressActivityEvent = Pick<
  Extract<DiagnosticEventPayload, { type: "run.progress" }>,
  "runId" | "sessionId" | "sessionKey" | "reason"
>;

/** Current active-work summary for a session, safe for diagnostic classification. */
export type DiagnosticSessionActivitySnapshot = {
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
  hasActiveEmbeddedRun?: boolean;
  activeToolName?: string;
  activeToolCallId?: string;
  activeToolAgeMs?: number;
  lastProgressAgeMs?: number;
  lastProgressReason?: string;
};

const activityByRef = new Map<string, SessionActivity>();
const activityByRunId = new Map<string, SessionActivity>();

function sessionRefs(params: { sessionId?: string; sessionKey?: string }): string[] {
  const refs: string[] = [];
  const sessionId = params.sessionId?.trim();
  const sessionKey = params.sessionKey?.trim();
  if (sessionId) {
    refs.push(`id:${sessionId}`);
  }
  if (sessionKey) {
    refs.push(`key:${sessionKey}`);
  }
  return refs;
}

function registerSessionActivityRefs(
  activity: SessionActivity,
  params: { sessionId?: string; sessionKey?: string; runId?: string },
): void {
  activity.sessionId ??= params.sessionId;
  activity.sessionKey ??= params.sessionKey;
  for (const ref of sessionRefs(params)) {
    activityByRef.set(ref, activity);
  }
  if (params.runId) {
    activityByRunId.set(params.runId, activity);
  }
}

function replaceSessionActivityReferences(source: SessionActivity, target: SessionActivity): void {
  for (const [ref, activity] of activityByRef) {
    if (activity === source) {
      activityByRef.set(ref, target);
    }
  }
  for (const [runId, activity] of activityByRunId) {
    if (activity === source) {
      activityByRunId.set(runId, target);
    }
  }
}

function mergeSessionActivity(target: SessionActivity, source: SessionActivity): void {
  target.sessionId ??= source.sessionId;
  target.sessionKey ??= source.sessionKey;
  for (const key of source.activeEmbeddedRuns) {
    target.activeEmbeddedRuns.add(key);
  }
  for (const [key, tool] of source.activeTools) {
    target.activeTools.set(key, tool);
  }
  for (const key of source.activeModelCalls) {
    target.activeModelCalls.add(key);
  }
  if (source.lastProgressAt > target.lastProgressAt) {
    target.lastProgressAt = source.lastProgressAt;
    target.lastProgressReason = source.lastProgressReason;
  }
  replaceSessionActivityReferences(source, target);
}

function resolveSessionActivity(params: {
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
  create?: boolean;
}): SessionActivity | undefined {
  let activity: SessionActivity | undefined;
  if (params.runId) {
    const byRun = activityByRunId.get(params.runId);
    if (byRun) {
      activity = byRun;
    }
  }

  for (const ref of sessionRefs(params)) {
    const byRef = activityByRef.get(ref);
    if (!byRef) {
      continue;
    }
    if (!activity) {
      activity = byRef;
    } else if (activity !== byRef) {
      mergeSessionActivity(activity, byRef);
    }
  }

  if (activity) {
    registerSessionActivityRefs(activity, params);
    return activity;
  }

  if (!params.create) {
    return undefined;
  }

  const created: SessionActivity = {
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    activeEmbeddedRuns: new Set(),
    activeTools: new Map(),
    activeModelCalls: new Set(),
    lastProgressAt: Date.now(),
  };
  registerSessionActivityRefs(created, params);
  return created;
}

function touchSessionActivity(activity: SessionActivity, reason: string, now = Date.now()): void {
  activity.lastProgressAt = now;
  activity.lastProgressReason = reason;
}

function toolKey(event: {
  runId?: string;
  sessionId?: string;
  sessionKey?: string;
  toolCallId?: string;
  toolName: string;
}): string {
  return `${event.runId ?? event.sessionId ?? event.sessionKey ?? "unknown"}:${
    event.toolCallId ?? event.toolName
  }`;
}

function modelCallKey(event: { runId?: string; provider?: string; model?: string }): string {
  return `${event.runId ?? "unknown"}:${event.provider ?? "provider"}:${event.model ?? "model"}`;
}

function recordToolStarted(event: DiagnosticToolStartedActivityEvent): void {
  const activity = resolveSessionActivity({ ...event, create: true });
  if (!activity) {
    return;
  }
  const now = Date.now();
  activity.activeTools.set(toolKey(event), {
    toolName: event.toolName,
    toolCallId: event.toolCallId,
    startedAt: now,
    lastProgressAt: now,
  });
  touchSessionActivity(activity, `tool:${event.toolName}:started`, now);
}

function recordToolEnded(
  event: Extract<
    DiagnosticEventPayload,
    { type: "tool.execution.completed" | "tool.execution.error" | "tool.execution.blocked" }
  >,
): void {
  const activity = resolveSessionActivity(event);
  if (!activity) {
    return;
  }
  activity.activeTools.delete(toolKey(event));
  touchSessionActivity(activity, `tool:${event.toolName}:ended`);
}

function recordModelStarted(event: DiagnosticModelStartedActivityEvent): void {
  const activity = resolveSessionActivity({ ...event, create: true });
  if (!activity) {
    return;
  }
  activity.activeModelCalls.add(modelCallKey(event));
  touchSessionActivity(activity, "model_call:started");
}

function recordModelEnded(
  event: Extract<DiagnosticEventPayload, { type: "model.call.completed" | "model.call.error" }>,
): void {
  const activity = resolveSessionActivity(event);
  if (!activity) {
    return;
  }
  activity.activeModelCalls.delete(modelCallKey(event));
  touchSessionActivity(activity, "model_call:ended");
}

function recordRunProgress(event: DiagnosticRunProgressActivityEvent): void {
  markDiagnosticRunProgress(event);
}

/** Records explicit run progress for the session/run correlation maps. */
export function markDiagnosticRunProgress(params: DiagnosticRunProgressActivityEvent): void {
  const activity = resolveSessionActivity({ ...params, create: true });
  if (!activity) {
    return;
  }
  touchSessionActivity(activity, params.reason);
}

function recordRunCompleted(
  event: Extract<DiagnosticEventPayload, { type: "run.completed" }>,
): void {
  const activity = resolveSessionActivity(event);
  if (!activity) {
    return;
  }
  activityByRunId.delete(event.runId);
  activity.activeTools.clear();
  activity.activeModelCalls.clear();
  activity.activeEmbeddedRuns.clear();
  touchSessionActivity(activity, "run:completed");
}

/** Marks an embedded run as active for a session. */
export function markDiagnosticEmbeddedRunStarted(params: {
  sessionId: string;
  sessionKey?: string;
  workKey?: string;
}): void {
  const activity = resolveSessionActivity({ ...params, create: true });
  if (!activity) {
    return;
  }
  activity.activeEmbeddedRuns.add(resolveEmbeddedRunWorkKey(params));
  touchSessionActivity(activity, "embedded_run:started");
}

/** Marks an embedded run complete and optionally clears related run activity. */
export function markDiagnosticEmbeddedRunEnded(params: {
  sessionId: string;
  sessionKey?: string;
  workKey?: string;
  clearRunActivity?: boolean;
}): void {
  const activity = resolveSessionActivity(params);
  if (!activity) {
    return;
  }
  activity.activeEmbeddedRuns.delete(resolveEmbeddedRunWorkKey(params));
  if (params.clearRunActivity !== false) {
    activity.activeTools.clear();
    activity.activeModelCalls.clear();
  }
  touchSessionActivity(activity, "embedded_run:ended");
}

function resolveEmbeddedRunWorkKey(params: { sessionId: string; workKey?: string }): string {
  return params.workKey ?? params.sessionId;
}

/** Returns active model/tool/embedded-run state for stuck-session diagnostics. */
export function getDiagnosticSessionActivitySnapshot(
  params: { sessionId?: string; sessionKey?: string },
  now = Date.now(),
): DiagnosticSessionActivitySnapshot {
  const activity = resolveSessionActivity(params);
  if (!activity) {
    return {};
  }

  let activeWorkKind: DiagnosticSessionActiveWorkKind | undefined;
  if (activity.activeTools.size > 0) {
    activeWorkKind = "tool_call";
  } else if (activity.activeModelCalls.size > 0) {
    activeWorkKind = "model_call";
  } else if (activity.activeEmbeddedRuns.size > 0) {
    activeWorkKind = "embedded_run";
  }

  let activeTool: ActiveTool | undefined;
  for (const tool of activity.activeTools.values()) {
    if (!activeTool || tool.startedAt < activeTool.startedAt) {
      activeTool = tool;
    }
  }
  return {
    activeWorkKind,
    ...(activity.activeEmbeddedRuns.size > 0 ? { hasActiveEmbeddedRun: true } : {}),
    activeToolName: activeTool?.toolName,
    activeToolCallId: activeTool?.toolCallId,
    activeToolAgeMs: activeTool ? Math.max(0, now - activeTool.startedAt) : undefined,
    lastProgressAgeMs: Math.max(0, now - activity.lastProgressAt),
    lastProgressReason: activity.lastProgressReason,
  };
}

/** Test hook for recording run progress without emitting a diagnostic event. */
export function markDiagnosticRunProgressForTest(params: DiagnosticRunProgressActivityEvent): void {
  markDiagnosticRunProgress(params);
}

/** Test hook for registering an active tool call in the activity tracker. */
export function markDiagnosticToolStartedForTest(params: {
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
  toolName: string;
  toolCallId?: string;
}): void {
  recordToolStarted(params);
}

/** Test hook for registering an active model call in the activity tracker. */
export function markDiagnosticModelStartedForTest(
  params: DiagnosticModelStartedActivityEvent,
): void {
  recordModelStarted(params);
}

/** Clears diagnostic activity maps and reinstalls the internal event listener for tests. */
export function resetDiagnosticRunActivityForTest(): void {
  activityByRef.clear();
  activityByRunId.clear();
  unregisterDiagnosticRunActivityListener?.();
  unregisterDiagnosticRunActivityListener = undefined;
  registerDiagnosticRunActivityListener();
}

let unregisterDiagnosticRunActivityListener: (() => void) | undefined;

function registerDiagnosticRunActivityListener(): void {
  if (unregisterDiagnosticRunActivityListener) {
    return;
  }
  unregisterDiagnosticRunActivityListener = onInternalDiagnosticEvent((event) => {
    switch (event.type) {
      case "tool.execution.started":
        recordToolStarted(event);
        return;
      case "tool.execution.completed":
      case "tool.execution.error":
      case "tool.execution.blocked":
        recordToolEnded(event);
        return;
      case "model.call.started":
        recordModelStarted(event);
        return;
      case "model.call.completed":
      case "model.call.error":
        recordModelEnded(event);
        return;
      case "run.progress":
        recordRunProgress(event);
        return;
      case "run.completed":
        recordRunCompleted(event);
        return;
      default:
        return;
    }
  });
}

registerDiagnosticRunActivityListener();
