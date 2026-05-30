/** Reusable short descriptions for built-in tool display summaries. */
export const EXEC_TOOL_DISPLAY_SUMMARY = "Run shell now.";
/** Short display summary for process/session control tools. */
export const PROCESS_TOOL_DISPLAY_SUMMARY = "Inspect/control exec sessions.";
/** Short display summary for scheduled reminder and wake-event tools. */
export const CRON_TOOL_DISPLAY_SUMMARY = "Schedule reminders, cron, wake events.";
/** Short display summary for listing visible sessions. */
export const SESSIONS_LIST_TOOL_DISPLAY_SUMMARY = "List visible sessions; filters/previews.";
/** Short display summary for reading sanitized session history. */
export const SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY = "Read sanitized session history.";
/** Short display summary for messaging a session or configured agent. */
export const SESSIONS_SEND_TOOL_DISPLAY_SUMMARY = "Message session or configured agent.";
/** Short display summary for spawning subagent or ACP sessions. */
export const SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY = "Spawn subagent or ACP session.";
/** Short display summary for spawning native subagent sessions. */
export const SESSIONS_SPAWN_SUBAGENT_TOOL_DISPLAY_SUMMARY = "Spawn subagent session.";
/** Short display summary for status/model/usage inspection. */
export const SESSION_STATUS_TOOL_DISPLAY_SUMMARY = "Show session status/model/usage.";
/** Short display summary for the plan update tool. */
export const UPDATE_PLAN_TOOL_DISPLAY_SUMMARY = "Track short work plan.";

/** Builds the full model-facing description for the sessions_list tool. */
export function describeSessionsListTool(): string {
  return [
    "List visible sessions; filter by kind, label, agentId, search, activity.",
    "Use before sessions_history or sessions_send target selection.",
  ].join(" ");
}

/** Builds the full model-facing description for the sessions_history tool. */
export function describeSessionsHistoryTool(): string {
  return [
    "Fetch sanitized history for visible session.",
    "Use before replying, debugging, resuming; supports limits/tool messages.",
  ].join(" ");
}

/** Builds the full model-facing description for the sessions_send tool. */
export function describeSessionsSendTool(): string {
  return [
    "Send message to visible session by sessionKey/label, or configured agent by agentId.",
    "Thread-scoped chats rejected; target parent channel session.",
    "Creates missing configured-agent main session; waits for reply when available.",
  ].join(" ");
}

/** Builds the full model-facing description for session spawning with runtime availability hints. */
export function describeSessionsSpawnTool(options?: {
  acpAvailable?: boolean;
  threadAvailable?: boolean;
}): string {
  const runtimeDescription =
    options?.acpAvailable === false
      ? 'Spawn clean child session; default `runtime="subagent"`.'
      : 'Spawn clean child session; default `runtime="subagent"`; set `runtime="acp"` explicitly for ACP.';
  const baseDescription = [
    runtimeDescription,
    options?.threadAvailable
      ? '`mode="run"` one-shot; `mode="session"` persistent/thread-bound, only when requester channel supports thread bindings.'
      : '`mode="run"` one-shot background work.',
    "Subagents inherit parent workspace.",
    "Native subagents get task in first visible `[Subagent Task]` message.",
    'Native only: `context="fork"` only when child needs current transcript; else omit or `isolated`.',
    "Use for fresh child-session work.",
  ];
  if (options?.acpAvailable === false) {
    return baseDescription.join(" ");
  }
  return [
    ...baseDescription.slice(0, 3),
    '`runtime="acp"` for ACP harness ids: codex, claude, gemini, opencode, or agent ACP runtime config.',
    ...baseDescription.slice(3),
  ].join(" ");
}

/** Builds the full model-facing description for the session_status tool. */
export function describeSessionStatusTool(): string {
  return [
    "Show /status-like card for current/visible session: model, usage, time, cost, tasks.",
    'Use `sessionKey="current"` for current session; UI labels like `openclaw-tui` are not keys.',
    "`model` sets session override; `model=default` resets.",
    "Use for active model/session config questions.",
  ].join(" ");
}

/** Builds the full model-facing description for the update_plan tool. */
export function describeUpdatePlanTool(): string {
  return [
    "Update current run plan.",
    "Use for non-trivial multi-step work; keep plan current while executing.",
    "Short steps; max one `in_progress`; skip for simple one-step work.",
  ].join(" ");
}
