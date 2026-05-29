// Shared types for gateway session utils types behavior.
import type { ChatType } from "../channels/chat-type.js";
import type {
  SessionCompactionCheckpoint,
  SessionEntry,
  SessionGoal,
} from "../config/sessions/types.js";
import type { PluginSessionExtensionProjection } from "../plugins/host-hooks.js";
import type {
  GatewayAgentRuntime,
  GatewayAgentRow as SharedGatewayAgentRow,
  SessionsListResultBase,
  SessionsPatchResultBase,
} from "../shared/session-types.js";
import type { DeliveryContext } from "../utils/delivery-context.types.js";

/** Shared type for Gateway Sessions Defaults in src/gateway. */
export type GatewaySessionsDefaults = {
  modelProvider: string | null;
  model: string | null;
  contextTokens: number | null;
  thinkingLevels?: GatewayThinkingLevelOption[];
  thinkingOptions?: string[];
  thinkingDefault?: string;
};

type GatewayThinkingLevelOption = {
  id: string;
  label: string;
};

/** Shared type for Session Run Status in src/gateway. */
export type SessionRunStatus = "running" | "done" | "failed" | "killed" | "timeout";

type SubagentRunState = "active" | "interrupted" | "historical";

/** Shared type for Session Compaction Checkpoint Preview in src/gateway. */
export type SessionCompactionCheckpointPreview = Pick<
  SessionCompactionCheckpoint,
  "checkpointId" | "createdAt" | "reason"
>;

/** Shared type for Gateway Session Row in src/gateway. */
export type GatewaySessionRow = {
  key: string;
  spawnedBy?: string;
  spawnedWorkspaceDir?: string;
  spawnedCwd?: string;
  forkedFromParent?: boolean;
  spawnDepth?: number;
  subagentRole?: SessionEntry["subagentRole"];
  subagentControlScope?: SessionEntry["subagentControlScope"];
  kind: "direct" | "group" | "global" | "unknown";
  label?: string;
  displayName?: string;
  derivedTitle?: string;
  lastMessagePreview?: string;
  channel?: string;
  subject?: string;
  groupChannel?: string;
  space?: string;
  chatType?: ChatType;
  origin?: SessionEntry["origin"];
  updatedAt: number | null;
  sessionId?: string;
  systemSent?: boolean;
  abortedLastRun?: boolean;
  thinkingLevel?: string;
  thinkingLevels?: GatewayThinkingLevelOption[];
  thinkingOptions?: string[];
  thinkingDefault?: string;
  fastMode?: boolean;
  verboseLevel?: string;
  traceLevel?: string;
  reasoningLevel?: string;
  elevatedLevel?: string;
  sendPolicy?: "allow" | "deny";
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  totalTokensFresh?: boolean;
  goal?: SessionGoal;
  estimatedCostUsd?: number;
  status?: SessionRunStatus;
  hasActiveRun?: boolean;
  subagentRunState?: SubagentRunState;
  hasActiveSubagentRun?: boolean;
  startedAt?: number;
  endedAt?: number;
  runtimeMs?: number;
  parentSessionKey?: string;
  childSessions?: string[];
  responseUsage?: "on" | "off" | "tokens" | "full";
  modelProvider?: string;
  model?: string;
  agentRuntime?: GatewayAgentRuntime;
  contextTokens?: number;
  contextBudgetStatus?: SessionEntry["contextBudgetStatus"];
  deliveryContext?: DeliveryContext;
  lastChannel?: SessionEntry["lastChannel"];
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: SessionEntry["lastThreadId"];
  compactionCheckpointCount?: number;
  latestCompactionCheckpoint?: SessionCompactionCheckpointPreview;
  pluginExtensions?: PluginSessionExtensionProjection[];
};

/** Shared type for Gateway Agent Row in src/gateway. */
export type GatewayAgentRow = SharedGatewayAgentRow;

/** Shared type for Session Preview Item in src/gateway. */
export type SessionPreviewItem = {
  role: "user" | "assistant" | "tool" | "system" | "other";
  text: string;
};

/** Shared type for Sessions Preview Entry in src/gateway. */
export type SessionsPreviewEntry = {
  key: string;
  status: "ok" | "empty" | "missing" | "error";
  items: SessionPreviewItem[];
};

/** Shared type for Sessions Preview Result in src/gateway. */
export type SessionsPreviewResult = {
  ts: number;
  previews: SessionsPreviewEntry[];
};

/** Shared type for Sessions List Result in src/gateway. */
export type SessionsListResult = SessionsListResultBase<GatewaySessionsDefaults, GatewaySessionRow>;

/** Shared type for Sessions Patch Result in src/gateway. */
export type SessionsPatchResult = SessionsPatchResultBase<SessionEntry> & {
  entry: SessionEntry;
  resolved?: {
    modelProvider?: string;
    model?: string;
    agentRuntime?: GatewayAgentRuntime;
  };
};
