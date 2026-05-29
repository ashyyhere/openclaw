// Shared types for packages/sdk/src types behavior.
/** Public type describing Json Object for packages/sdk. */
export type JsonObject = Record<string, unknown>;

/** Public type describing Gateway Request Options for packages/sdk. */
export type GatewayRequestOptions = {
  expectFinal?: boolean;
  timeoutMs?: number | null;
};

/** Public type describing Gateway Event for packages/sdk. */
export type GatewayEvent = {
  event: string;
  payload?: unknown;
  seq?: number;
  stateVersion?: unknown;
};

/** Public type describing Open Claw Transport for packages/sdk. */
export type OpenClawTransport = {
  request<T = unknown>(
    method: string,
    params?: unknown,
    options?: GatewayRequestOptions,
  ): Promise<T>;
  events(filter?: (event: GatewayEvent) => boolean): AsyncIterable<GatewayEvent>;
  close?(): Promise<void> | void;
};

/** Public type describing Connectable Open Claw Transport for packages/sdk. */
export type ConnectableOpenClawTransport = OpenClawTransport & {
  connect(): Promise<void>;
};

/** Public type describing Runtime Selection for packages/sdk. */
export type RuntimeSelection =
  | "auto"
  | { type: "embedded"; id: "openclaw" | "codex" | (string & {}) }
  | { type: "cli"; id: "claude-cli" | (string & {}) }
  | { type: "acp"; harness: "claude" | "cursor" | "gemini" | "opencode" | (string & {}) }
  | { type: "managed"; provider: "local" | "node" | "testbox" | "cloud" | (string & {}) };

/** Public type describing Environment Selection for packages/sdk. */
export type EnvironmentSelection =
  | { type: "local"; cwd?: string }
  | { type: "gateway"; url?: string; cwd?: string }
  | { type: "node"; nodeId: string; cwd?: string }
  | { type: "managed"; provider: string; repo?: string; ref?: string }
  | { type: "ephemeral"; provider: string; repo?: string; ref?: string };

/** Public type describing Environment Summary for packages/sdk. */
export type EnvironmentSummary = {
  id: string;
  type: "local" | "gateway" | "node" | "managed" | "ephemeral" | (string & {});
  label?: string;
  status: "available" | "unavailable" | "starting" | "stopping" | "error";
  capabilities?: string[];
};

/** Public type describing Environments List Result for packages/sdk. */
export type EnvironmentsListResult = {
  environments: EnvironmentSummary[];
};

/** Public type describing Workspace Selection for packages/sdk. */
export type WorkspaceSelection = {
  cwd?: string;
  repo?: string;
  ref?: string;
};

/** Public type describing Approval Mode for packages/sdk. */
export type ApprovalMode = "ask" | "never" | "auto" | "trusted";

/** Public type describing Run Status for packages/sdk. */
export type RunStatus = "accepted" | "completed" | "failed" | "cancelled" | "timed_out";

/** Public type describing Run Timestamp for packages/sdk. */
export type RunTimestamp = string | number;

/** Public type describing SDKMessage for packages/sdk. */
export type SDKMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  toolCallId?: string;
};

/** Public type describing Artifact Summary for packages/sdk. */
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

/** Public type describing Artifact Query for packages/sdk. */
export type ArtifactQuery =
  | { sessionKey: string; runId?: string; taskId?: string; agentId?: string }
  | { runId: string; sessionKey?: string; taskId?: string; agentId?: string }
  | { taskId: string; sessionKey?: string; runId?: string; agentId?: string };

/** Public type describing Artifacts List Result for packages/sdk. */
export type ArtifactsListResult = {
  artifacts: ArtifactSummary[];
};

/** Public type describing Artifacts Get Result for packages/sdk. */
export type ArtifactsGetResult = {
  artifact: ArtifactSummary;
};

/** Public type describing Artifacts Download Result for packages/sdk. */
export type ArtifactsDownloadResult = {
  artifact: ArtifactSummary;
  encoding?: "base64";
  data?: string;
  url?: string;
};

/** Public type describing Task Status for packages/sdk. */
export type TaskStatus = "queued" | "running" | "completed" | "failed" | "cancelled" | "timed_out";

/** Public type describing Task Summary for packages/sdk. */
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

/** Public type describing Tasks List Params for packages/sdk. */
export type TasksListParams = {
  status?: TaskStatus | TaskStatus[];
  agentId?: string;
  sessionKey?: string;
  limit?: number;
  cursor?: string;
};

/** Public type describing Tasks List Result for packages/sdk. */
export type TasksListResult = {
  tasks: TaskSummary[];
  nextCursor?: string;
};

/** Public type describing Tasks Get Result for packages/sdk. */
export type TasksGetResult = {
  task: TaskSummary;
};

/** Public type describing Tasks Cancel Result for packages/sdk. */
export type TasksCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  task?: TaskSummary;
};

/** Public type describing SDKError for packages/sdk. */
export type SDKError = {
  code?: string;
  message: string;
  details?: unknown;
};

/** Public type describing Tool Invoke Params for packages/sdk. */
export type ToolInvokeParams = {
  args?: JsonObject;
  sessionKey?: string;
  agentId?: string;
  confirm?: boolean;
  idempotencyKey?: string;
};

/** Public type describing Tool Invoke Result for packages/sdk. */
export type ToolInvokeResult = {
  ok: boolean;
  toolName: string;
  output?: unknown;
  requiresApproval?: boolean;
  approvalId?: string;
  source?: string;
  error?: SDKError;
};

/** Public type describing Run Result for packages/sdk. */
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

/** Public type describing Open Claw Event Type for packages/sdk. */
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

/** Public type describing Open Claw Event for packages/sdk. */
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

/** Public type describing Agent Run Params for packages/sdk. */
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

/** Public type describing Session Create Params for packages/sdk. */
export type SessionCreateParams = {
  key?: string;
  agentId?: string;
  label?: string;
  model?: string;
  parentSessionKey?: string;
  task?: string;
  message?: string;
};

/** Public type describing Session Send Params for packages/sdk. */
export type SessionSendParams = {
  key: string;
  message: string;
  thinking?: string;
  attachments?: unknown[];
  timeoutMs?: number;
  idempotencyKey?: string;
};

/** Public type describing Session Target for packages/sdk. */
export type SessionTarget = {
  key: string;
  sessionId?: string;
  agentId?: string;
  label?: string;
};

/** Public type describing Run Create Params for packages/sdk. */
export type RunCreateParams = AgentRunParams;
