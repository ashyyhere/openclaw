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

/** Reason the TUI loop returned control to its caller. */
export type TuiExitReason = "exit" | "return-to-crestodian";

/** Result returned after the TUI loop exits or hands a message back. */
export type TuiResult = {
  exitReason: TuiExitReason;
  crestodianMessage?: string;
};

/** Chat stream event forwarded from the backend to the terminal renderer. */
export type ChatEvent = {
  runId: string;
  sessionKey: string;
  agentId?: string;
  state: "delta" | "final" | "aborted" | "error";
  message?: unknown;
  errorMessage?: string;
};

/** Backend-to-widget question event that needs visible terminal handling. */
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

/** Raw agent stream event carried through the TUI event bus. */
export type AgentEvent = {
  runId: string;
  stream: string;
  data?: Record<string, unknown>;
};

/** User-selected detail level for response usage display. */
export type ResponseUsageMode = "on" | "off" | "tokens" | "full";

/** Current session model, token, reasoning, and display metadata. */
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

/** Session selection policy used when resolving sender-specific chat state. */
export type SessionScope = "per-sender" | "global";

/** Lightweight agent entry used in TUI selectors. */
export type AgentSummary = {
  id: string;
  name?: string;
};

/** How a queued user message should attach to the active or next run. */
export type QueuedMessageMode = "steer" | "followUp";

/** User message buffered while a chat run is already active. */
export type QueuedMessage = {
  runId: string;
  text: string;
  mode: QueuedMessageMode;
};

/** Compact gateway health snapshot rendered in TUI status panels. */
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

/** Mutable TUI state bag shared by input handlers, renderers, and backends. */
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
