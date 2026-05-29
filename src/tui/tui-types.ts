import type { SessionGoal } from "../config/sessions/types.js";

export type TuiOptions = {
  local?: boolean;
  url?: string;
  token?: string;
  password?: string;
  session?: string;
  deliver?: boolean;
  thinking?: string;
  timeoutMs?: number;
  historyLimit?: number;
  message?: string;
  /**
   * Internal CLI guard: after the standalone TUI returns, force the child
   * process out if imported runtime handles keep the event loop alive.
   */
  forceProcessExitOnReturn?: boolean;
};

/** Shared type for Tui Exit Reason in src/tui. */
export type TuiExitReason = "exit" | "return-to-crestodian";

/** Shared type for Tui Result in src/tui. */
export type TuiResult = {
  exitReason: TuiExitReason;
  crestodianMessage?: string;
};

/** Shared type for Chat Event in src/tui. */
export type ChatEvent = {
  runId: string;
  sessionKey: string;
  agentId?: string;
  state: "delta" | "final" | "aborted" | "error";
  message?: unknown;
  errorMessage?: string;
};

/** Shared type for Btw Event in src/tui. */
export type BtwEvent = {
  kind: "btw";
  runId?: string;
  sessionKey?: string;
  agentId?: string;
  question: string;
  text: string;
  isError?: boolean;
  seq?: number;
  ts?: number;
};

/** Shared type for Agent Event in src/tui. */
export type AgentEvent = {
  runId: string;
  stream: string;
  data?: Record<string, unknown>;
};

/** Shared type for Response Usage Mode in src/tui. */
export type ResponseUsageMode = "on" | "off" | "tokens" | "full";

/** Shared type for Session Info in src/tui. */
export type SessionInfo = {
  thinkingLevel?: string;
  thinkingLevels?: Array<{ id: string; label: string }>;
  fastMode?: boolean;
  verboseLevel?: string;
  traceLevel?: string;
  reasoningLevel?: string;
  model?: string;
  modelProvider?: string;
  contextTokens?: number | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  totalTokens?: number | null;
  goal?: SessionGoal;
  responseUsage?: ResponseUsageMode;
  updatedAt?: number | null;
  displayName?: string;
};

/** Shared type for Session Scope in src/tui. */
export type SessionScope = "per-sender" | "global";

/** Shared type for Agent Summary in src/tui. */
export type AgentSummary = {
  id: string;
  name?: string;
};

/** Shared type for Queued Message Mode in src/tui. */
export type QueuedMessageMode = "steer" | "followUp";

/** Shared type for Queued Message in src/tui. */
export type QueuedMessage = {
  runId: string;
  text: string;
  mode: QueuedMessageMode;
};

/** Shared type for Gateway Status Summary in src/tui. */
export type GatewayStatusSummary = {
  runtimeVersion?: string | null;
  linkChannel?: {
    id?: string;
    label?: string;
    linked?: boolean;
    authAgeMs?: number | null;
  };
  heartbeat?: {
    defaultAgentId?: string;
    agents?: Array<{
      agentId?: string;
      enabled?: boolean;
      every?: string;
      everyMs?: number | null;
    }>;
  };
  providerSummary?: string[];
  queuedSystemEvents?: string[];
  sessions?: {
    paths?: string[];
    count?: number;
    defaults?: { model?: string | null; contextTokens?: number | null };
    recent?: Array<{
      agentId?: string;
      key: string;
      kind?: string;
      updatedAt?: number | null;
      age?: number | null;
      model?: string | null;
      totalTokens?: number | null;
      contextTokens?: number | null;
      remainingTokens?: number | null;
      percentUsed?: number | null;
      flags?: string[];
    }>;
  };
};

/** Shared type for Tui State Access in src/tui. */
export type TuiStateAccess = {
  agentDefaultId: string;
  sessionMainKey: string;
  sessionScope: SessionScope;
  agents: AgentSummary[];
  currentAgentId: string;
  currentSessionKey: string;
  currentSessionId: string | null;
  activeChatRunId: string | null;
  pendingOptimisticUserMessage?: boolean;
  pendingChatRunId?: string | null;
  queuedMessages?: QueuedMessage[];
  historyLoaded: boolean;
  sessionInfo: SessionInfo;
  initialSessionApplied: boolean;
  isConnected: boolean;
  autoMessageSent: boolean;
  toolsExpanded: boolean;
  showThinking: boolean;
  connectionStatus: string;
  activityStatus: string;
  statusTimeout: ReturnType<typeof setTimeout> | null;
  lastCtrlCAt: number;
};
