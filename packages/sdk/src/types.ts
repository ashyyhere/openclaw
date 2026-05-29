// Public data contracts for `@openclaw/sdk` requests, results, events, and transports.
/** JSON object payload accepted by SDK request helpers. */
export type JsonObject = Record<string, unknown>;

/** Per-request gateway behavior controls for final responses and timeouts. */
export type GatewayRequestOptions = {
  expectFinal?: boolean;
  timeoutMs?: number | null;
};

/** Raw event frame emitted by the gateway transport before SDK normalization. */
export type GatewayEvent = {
  event: string;
  payload?: unknown;
  seq?: number;
  stateVersion?: unknown;
};

/** Minimal transport contract required by the high-level SDK client. */
export type OpenClawTransport = {
  request<T = unknown>(
    method: string,
    params?: unknown,
    options?: GatewayRequestOptions,
  ): Promise<T>;
  events(filter?: (event: GatewayEvent) => boolean): AsyncIterable<GatewayEvent>;
  close?(): Promise<void> | void;
};

/** Transport variant that performs an explicit async connection handshake. */
export type ConnectableOpenClawTransport = OpenClawTransport & {
  connect(): Promise<void>;
};

/** Requested runtime target for future per-run execution selection. */
export type RuntimeSelection =
  | "auto"
  | { type: "embedded"; id: "openclaw" | "codex" | (string & {}) }
  | { type: "cli"; id: "claude-cli" | (string & {}) }
  | { type: "acp"; harness: "claude" | "cursor" | "gemini" | "opencode" | (string & {}) }
  | { type: "managed"; provider: "local" | "node" | "testbox" | "cloud" | (string & {}) };

/** Requested execution environment for future per-run placement. */
export type EnvironmentSelection =
  | { type: "local"; cwd?: string }
  | { type: "gateway"; url?: string; cwd?: string }
  | { type: "node"; nodeId: string; cwd?: string }
  | { type: "managed"; provider: string; repo?: string; ref?: string }
  | { type: "ephemeral"; provider: string; repo?: string; ref?: string };

/** Gateway-reported environment record returned from environment listing/status APIs. */
export type EnvironmentSummary = {
  id: string;
  type: "local" | "gateway" | "node" | "managed" | "ephemeral" | (string & {});
  label?: string;
  status: "available" | "unavailable" | "starting" | "stopping" | "error";
  capabilities?: string[];
};

/** Result envelope for environment listing. */
export type EnvironmentsListResult = {
  environments: EnvironmentSummary[];
};

/** Workspace selector for future per-run workspace placement. */
export type WorkspaceSelection = {
  cwd?: string;
  repo?: string;
  ref?: string;
};

/** Approval policy requested for future per-run execution. */
export type ApprovalMode = "ask" | "never" | "auto" | "trusted";

/** Terminal or accepted status returned by run wait/create APIs. */
export type RunStatus = "accepted" | "completed" | "failed" | "cancelled" | "timed_out";

/** Timestamp format preserved from gateway responses. */
export type RunTimestamp = string | number;

/** Message shape used in run output summaries. */
export type SDKMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  toolCallId?: string;
};

/** Artifact metadata returned by artifact list/get/download APIs. */
export type ArtifactSummary = {
  id: string;
  runId?: string;
  taskId?: string;
  sessionId?: string;
  sessionKey?: string;
  type:
    | "file"
    | "patch"
    | "diff"
    | "log"
    | "media"
    | "screenshot"
    | "trajectory"
    | "pull_request"
    | "workspace"
    | (string & {});
  title?: string;
  mimeType?: string;
  sizeBytes?: number;
  messageSeq?: number;
  source?: string;
  download?: {
    mode: "bytes" | "url" | "unsupported" | (string & {});
  };
  createdAt?: string;
  expiresAt?: string;
};

/** Required scope for artifact APIs: at least one session, run, or task id. */
export type ArtifactQuery =
  | { sessionKey: string; runId?: string; taskId?: string; agentId?: string }
  | { runId: string; sessionKey?: string; taskId?: string; agentId?: string }
  | { taskId: string; sessionKey?: string; runId?: string; agentId?: string };

/** Result envelope for artifact listing. */
export type ArtifactsListResult = {
  artifacts: ArtifactSummary[];
};

/** Result envelope for artifact metadata lookup. */
export type ArtifactsGetResult = {
  artifact: ArtifactSummary;
};

/** Result envelope for artifact download payloads or redirect URLs. */
export type ArtifactsDownloadResult = {
  artifact: ArtifactSummary;
  encoding?: "base64";
  data?: string;
  url?: string;
};

/** Task lifecycle status returned by task APIs. */
export type TaskStatus = "queued" | "running" | "completed" | "failed" | "cancelled" | "timed_out";

/** Task metadata returned by task list/get APIs. */
export type TaskSummary = {
  id: string;
  taskId?: string;
  kind?: string;
  runtime?: string;
  status: TaskStatus;
  title?: string;
  agentId?: string;
  sessionKey?: string;
  childSessionKey?: string;
  ownerKey?: string;
  runId?: string;
  flowId?: string;
  parentTaskId?: string;
  sourceId?: string;
  createdAt?: RunTimestamp;
  updatedAt?: RunTimestamp;
  startedAt?: RunTimestamp;
  endedAt?: RunTimestamp;
  progressSummary?: string;
  terminalSummary?: string;
  error?: string;
};

/** Filters and pagination controls for task listing. */
export type TasksListParams = {
  status?: TaskStatus | TaskStatus[];
  agentId?: string;
  sessionKey?: string;
  limit?: number;
  cursor?: string;
};

/** Result envelope for task listing. */
export type TasksListResult = {
  tasks: TaskSummary[];
  nextCursor?: string;
};

/** Result envelope for task metadata lookup. */
export type TasksGetResult = {
  task: TaskSummary;
};

/** Result envelope for task cancellation attempts. */
export type TasksCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  task?: TaskSummary;
};

/** Error payload shape used by SDK result envelopes. */
export type SDKError = {
  code?: string;
  message: string;
  details?: unknown;
};

/** Tool invocation payload accepted by `client.tools.invoke`. */
export type ToolInvokeParams = {
  args?: JsonObject;
  sessionKey?: string;
  agentId?: string;
  confirm?: boolean;
  idempotencyKey?: string;
};

/** Result envelope returned by tool invocation. */
export type ToolInvokeResult = {
  ok: boolean;
  toolName: string;
  output?: unknown;
  requiresApproval?: boolean;
  approvalId?: string;
  source?: string;
  error?: SDKError;
};

/** Run wait result with normalized status plus raw gateway payload. */
export type RunResult = {
  runId: string;
  status: RunStatus;
  sessionId?: string;
  sessionKey?: string;
  taskId?: string;
  startedAt?: RunTimestamp;
  endedAt?: RunTimestamp;
  output?: {
    text?: string;
    messages?: SDKMessage[];
  };
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    costUsd?: number;
  };
  artifacts?: ArtifactSummary[];
  error?: SDKError;
  raw?: unknown;
};

/** Stable SDK event names produced from gateway event frames. */
export type OpenClawEventType =
  | "run.created"
  | "run.queued"
  | "run.started"
  | "run.completed"
  | "run.failed"
  | "run.cancelled"
  | "run.timed_out"
  | "assistant.delta"
  | "assistant.message"
  | "thinking.delta"
  | "tool.call.started"
  | "tool.call.delta"
  | "tool.call.completed"
  | "tool.call.failed"
  | "approval.requested"
  | "approval.resolved"
  | "question.requested"
  | "question.answered"
  | "artifact.created"
  | "artifact.updated"
  | "session.created"
  | "session.updated"
  | "session.compacted"
  | "task.updated"
  | "git.branch"
  | "git.diff"
  | "git.pr"
  | "raw";

/** Versioned SDK event envelope used by `client.events()` and run streams. */
export type OpenClawEvent<TData = unknown> = {
  version: 1;
  id: string;
  ts: number;
  type: OpenClawEventType;
  runId?: string;
  sessionId?: string;
  sessionKey?: string;
  taskId?: string;
  agentId?: string;
  data: TData;
  raw?: GatewayEvent;
};

/** Run creation parameters accepted by agents and runs namespaces. */
export type AgentRunParams = {
  input: string;
  agentId?: string;
  model?: string;
  thinking?: string;
  sessionId?: string;
  sessionKey?: string;
  deliver?: boolean;
  attachments?: unknown[];
  timeoutMs?: number;
  label?: string;
  runtime?: RuntimeSelection;
  environment?: EnvironmentSelection;
  workspace?: WorkspaceSelection;
  approvals?: ApprovalMode;
  idempotencyKey?: string;
};

/** Session creation parameters accepted by `client.sessions.create`. */
export type SessionCreateParams = {
  key?: string;
  agentId?: string;
  label?: string;
  model?: string;
  parentSessionKey?: string;
  task?: string;
  message?: string;
};

/** Session send parameters accepted by `client.sessions.send` and session handles. */
export type SessionSendParams = {
  key: string;
  message: string;
  thinking?: string;
  attachments?: unknown[];
  timeoutMs?: number;
  idempotencyKey?: string;
};

/** Session lookup target accepted by session helper APIs. */
export type SessionTarget = {
  key: string;
  sessionId?: string;
  agentId?: string;
  label?: string;
};

/** Alias for run creation parameters; runs currently share the agent-run request shape. */
export type RunCreateParams = AgentRunParams;
