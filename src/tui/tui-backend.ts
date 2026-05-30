// TUI backend contract for gateway connection, chat, session, model, and command APIs.
import type {
  CommandEntry,
  CommandsListParams,
  SessionsListParams,
  SessionsPatchParams,
  SessionsPatchResult,
} from "../../packages/gateway-protocol/src/index.js";
import type { ResponseUsageMode, SessionInfo, SessionScope } from "./tui-types.js";

/** Chat send payload accepted by TUI backend implementations. */
export type ChatSendOptions = {
  sessionKey: string;
  agentId?: string;
  sessionId?: string | null;
  message: string;
  thinking?: string;
  deliver?: boolean;
  timeoutMs?: number;
  runId?: string;
};

export type TuiGoalCommandOptions = {
  sessionKey: string;
  agentId?: string;
  command: string;
};

export type TuiEvent = {
  event: string;
  payload?: unknown;
  seq?: number;
};

/** Session list payload consumed by the TUI session picker and sidebar. */
export type TuiSessionList = {
  ts: number;
  path: string;
  count: number;
  totalCount?: number;
  limitApplied?: number;
  hasMore?: boolean;
  defaults?: {
    model?: string | null;
    modelProvider?: string | null;
    contextTokens?: number | null;
    thinkingLevels?: Array<{ id: string; label: string }>;
  };
  sessions: Array<
    Pick<
      SessionInfo,
      | "thinkingLevel"
      | "thinkingLevels"
      | "fastMode"
      | "verboseLevel"
      | "reasoningLevel"
      | "model"
      | "contextTokens"
      | "inputTokens"
      | "outputTokens"
      | "totalTokens"
      | "goal"
      | "modelProvider"
      | "displayName"
    > & {
      key: string;
      sessionId?: string;
      updatedAt?: number | null;
      fastMode?: boolean;
      sendPolicy?: string;
      responseUsage?: ResponseUsageMode;
      label?: string;
      provider?: string;
      groupChannel?: string;
      space?: string;
      subject?: string;
      chatType?: string;
      origin?: {
        label?: string;
        provider?: string;
        surface?: string;
      };
      lastChannel?: string;
      lastProvider?: string;
      lastTo?: string;
      lastAccountId?: string;
      derivedTitle?: string;
      lastMessagePreview?: string;
    }
  >;
};

/** Agent list payload consumed by the TUI agent selector. */
export type TuiAgentsList = {
  defaultId: string;
  mainKey: string;
  scope: SessionScope;
  agents: Array<{
    id: string;
    name?: string;
  }>;
};

/** Model option displayed by the TUI model selector. */
export type TuiModelChoice = {
  id: string;
  name: string;
  provider: string;
  contextWindow?: number;
  reasoning?: boolean;
};

/** Backend interface implemented by local and remote TUI gateway clients. */
export type TuiBackend = {
  connection: {
    url: string;
    token?: string;
    password?: string;
  };
  onEvent?: (evt: TuiEvent) => void;
  onConnected?: () => void;
  onDisconnected?: (reason: string) => void;
  onGap?: (info: { expected: number; received: number }) => void;
  start: () => void;
  stop: () => void | Promise<void>;
  sendChat: (opts: ChatSendOptions) => Promise<{ runId: string }>;
  abortChat: (opts: {
    sessionKey: string;
    agentId?: string;
    runId: string;
  }) => Promise<{ ok: boolean; aborted: boolean }>;
  loadHistory: (opts: { sessionKey: string; agentId?: string; limit?: number }) => Promise<unknown>;
  listSessions: (opts?: SessionsListParams) => Promise<TuiSessionList>;
  listAgents: () => Promise<TuiAgentsList>;
  patchSession: (opts: SessionsPatchParams) => Promise<SessionsPatchResult>;
  resetSession: (
    key: string,
    reason?: "new" | "reset",
    opts?: { agentId?: string },
  ) => Promise<unknown>;
  getGatewayStatus: () => Promise<unknown>;
  listModels: () => Promise<TuiModelChoice[]>;
  listCommands?: (opts?: CommandsListParams) => Promise<CommandEntry[]>;
  runGoalCommand?: (opts: TuiGoalCommandOptions) => Promise<{ text: string }>;
};
