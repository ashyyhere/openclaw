// Control UI DTOs for gateway status, sessions, cron, skills, tools, logs, and health.
// Mirrors backend response shapes so UI controllers can stay typed without importing runtime code.
/** Update availability payload returned by startup/update checks. */
export type UpdateAvailable = import("../../../src/infra/update-startup.js").UpdateAvailable;
import type { SessionGoal } from "../../../src/config/sessions/types.js";
import type { CronJobBase } from "../../../src/cron/types-shared.js";
import type { ConfigUiHints } from "../../../src/shared/config-ui-hints-types.js";
import type {
  GatewayAgentRuntime,
  GatewayAgentRow as SharedGatewayAgentRow,
  SessionsListResultBase,
  SessionsPatchResultBase,
} from "../../../src/shared/session-types.js";
/** Config UI hint metadata shared by schema and settings views. */
export type { ConfigUiHint, ConfigUiHints } from "../../../src/shared/config-ui-hints-types.js";
export type { SessionGoal } from "../../../src/config/sessions/types.js";

/** Gateway channel/account status snapshot consumed by status dashboards. */
export type ChannelsStatusSnapshot = {
  ts: number;
  channelOrder: string[];
  channelLabels: Record<string, string>;
  channelDetailLabels?: Record<string, string>;
  channelSystemImages?: Record<string, string>;
  channelMeta?: ChannelUiMetaEntry[];
  channels: Record<string, unknown>;
  channelAccounts: Record<string, ChannelAccountSnapshot[]>;
  channelDefaultAccountId: Record<string, string>;
  partial?: boolean;
  warnings?: string[];
};

/** Display metadata for one channel integration. */
export type ChannelUiMetaEntry = {
  id: string;
  label: string;
  detailLabel: string;
  systemImage?: string;
};

/** Cron delivery sentinel meaning reuse the last active channel. */
export const CRON_CHANNEL_LAST = "last";

/** Per-account runtime/configuration status for a channel. */
export type ChannelAccountSnapshot = {
  accountId: string;
  name?: string | null;
  enabled?: boolean | null;
  configured?: boolean | null;
  linked?: boolean | null;
  running?: boolean | null;
  connected?: boolean | null;
  reconnectAttempts?: number | null;
  lastConnectedAt?: number | null;
  lastError?: string | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastInboundAt?: number | null;
  lastOutboundAt?: number | null;
  lastProbeAt?: number | null;
  mode?: string | null;
  dmPolicy?: string | null;
  allowFrom?: string[] | null;
  tokenSource?: string | null;
  botTokenSource?: string | null;
  appTokenSource?: string | null;
  credentialSource?: string | null;
  audienceType?: string | null;
  audience?: string | null;
  webhookPath?: string | null;
  webhookUrl?: string | null;
  baseUrl?: string | null;
  allowUnmentionedGroups?: boolean | null;
  cliPath?: string | null;
  dbPath?: string | null;
  port?: number | null;
  probe?: unknown;
  audit?: unknown;
  application?: unknown;
};

/** WhatsApp identity reported by the linked account. */
export type WhatsAppSelf = {
  e164?: string | null;
  jid?: string | null;
};

/** Last WhatsApp disconnect details. */
export type WhatsAppDisconnect = {
  at: number;
  status?: number | null;
  error?: string | null;
  loggedOut?: boolean | null;
};

/** WhatsApp channel status shown by Control UI. */
export type WhatsAppStatus = {
  configured: boolean;
  linked: boolean;
  authAgeMs?: number | null;
  self?: WhatsAppSelf | null;
  running: boolean;
  connected: boolean;
  lastConnectedAt?: number | null;
  lastDisconnect?: WhatsAppDisconnect | null;
  reconnectAttempts: number;
  lastMessageAt?: number | null;
  lastEventAt?: number | null;
  lastError?: string | null;
};

/** Telegram bot identity returned by probe calls. */
export type TelegramBot = {
  id?: number | null;
  username?: string | null;
};

/** Telegram webhook configuration returned by probe calls. */
export type TelegramWebhook = {
  url?: string | null;
  hasCustomCert?: boolean | null;
};

/** Telegram probe result with bot and webhook details. */
export type TelegramProbe = {
  ok: boolean;
  status?: number | null;
  error?: string | null;
  elapsedMs?: number | null;
  bot?: TelegramBot | null;
  webhook?: TelegramWebhook | null;
};

/** Telegram channel status shown by Control UI. */
export type TelegramStatus = {
  configured: boolean;
  tokenSource?: string | null;
  running: boolean;
  mode?: string | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: TelegramProbe | null;
  lastProbeAt?: number | null;
};

/** Discord bot identity returned by probe calls. */
export type DiscordBot = {
  id?: string | null;
  username?: string | null;
};

/** Discord probe result with bot identity. */
export type DiscordProbe = {
  ok: boolean;
  status?: number | null;
  error?: string | null;
  elapsedMs?: number | null;
  bot?: DiscordBot | null;
};

/** Discord channel status shown by Control UI. */
export type DiscordStatus = {
  configured: boolean;
  tokenSource?: string | null;
  running: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: DiscordProbe | null;
  lastProbeAt?: number | null;
};

/** Google Chat webhook probe result. */
export type GoogleChatProbe = {
  ok: boolean;
  status?: number | null;
  error?: string | null;
  elapsedMs?: number | null;
};

/** Google Chat channel status shown by Control UI. */
export type GoogleChatStatus = {
  configured: boolean;
  credentialSource?: string | null;
  audienceType?: string | null;
  audience?: string | null;
  webhookPath?: string | null;
  webhookUrl?: string | null;
  running: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: GoogleChatProbe | null;
  lastProbeAt?: number | null;
};

/** Slack bot identity returned by probe calls. */
export type SlackBot = {
  id?: string | null;
  name?: string | null;
};

/** Slack workspace identity returned by probe calls. */
export type SlackTeam = {
  id?: string | null;
  name?: string | null;
};

/** Slack probe result with bot and team details. */
export type SlackProbe = {
  ok: boolean;
  status?: number | null;
  error?: string | null;
  elapsedMs?: number | null;
  bot?: SlackBot | null;
  team?: SlackTeam | null;
};

/** Slack channel status shown by Control UI. */
export type SlackStatus = {
  configured: boolean;
  botTokenSource?: string | null;
  appTokenSource?: string | null;
  running: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: SlackProbe | null;
  lastProbeAt?: number | null;
};

/** Signal bridge probe result. */
export type SignalProbe = {
  ok: boolean;
  status?: number | null;
  error?: string | null;
  elapsedMs?: number | null;
  version?: string | null;
};

/** Signal channel status shown by Control UI. */
export type SignalStatus = {
  configured: boolean;
  baseUrl: string;
  running: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: SignalProbe | null;
  lastProbeAt?: number | null;
};

/** iMessage bridge probe result. */
export type IMessageProbe = {
  ok: boolean;
  error?: string | null;
};

/** iMessage channel status shown by Control UI. */
export type IMessageStatus = {
  configured: boolean;
  running: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  cliPath?: string | null;
  dbPath?: string | null;
  probe?: IMessageProbe | null;
  lastProbeAt?: number | null;
};

/** Nostr profile metadata resolved for the configured public key. */
export type NostrProfile = {
  name?: string | null;
  displayName?: string | null;
  about?: string | null;
  picture?: string | null;
  banner?: string | null;
  website?: string | null;
  nip05?: string | null;
  lud16?: string | null;
};

/** Nostr channel status shown by Control UI. */
export type NostrStatus = {
  configured: boolean;
  publicKey?: string | null;
  running: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  profile?: NostrProfile | null;
};

/** Microsoft Teams app probe result. */
export type MSTeamsProbe = {
  ok: boolean;
  error?: string | null;
  appId?: string | null;
};

/** Microsoft Teams channel status shown by Control UI. */
export type MSTeamsStatus = {
  configured: boolean;
  running: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  port?: number | null;
  probe?: MSTeamsProbe | null;
  lastProbeAt?: number | null;
};

/** Validation issue attached to a config snapshot. */
export type ConfigSnapshotIssue = {
  path: string;
  message: string;
};

/** Raw, parsed, and resolved config snapshot returned by the gateway. */
export type ConfigSnapshot = {
  path?: string | null;
  exists?: boolean | null;
  raw?: string | null;
  hash?: string | null;
  parsed?: unknown;
  valid?: boolean | null;
  sourceConfig?: Record<string, unknown> | null;
  resolved?: Record<string, unknown> | null;
  runtimeConfig?: Record<string, unknown> | null;
  config?: Record<string, unknown> | null;
  issues?: ConfigSnapshotIssue[] | null;
};

/** Config schema and UI hints used by settings editors. */
export type ConfigSchemaResponse = {
  schema: unknown;
  uiHints: ConfigUiHints;
  version: string;
  generatedAt: string;
};

/** Presence row advertised by a gateway or paired device. */
export type PresenceEntry = {
  instanceId?: string | null;
  host?: string | null;
  ip?: string | null;
  version?: string | null;
  platform?: string | null;
  deviceFamily?: string | null;
  modelIdentifier?: string | null;
  roles?: string[] | null;
  scopes?: string[] | null;
  mode?: string | null;
  lastInputSeconds?: number | null;
  reason?: string | null;
  text?: string | null;
  ts?: number | null;
};

/** Default model/thinking settings for session rows. */
export type GatewaySessionsDefaults = {
  modelProvider: string | null;
  model: string | null;
  contextTokens: number | null;
  thinkingLevels?: GatewayThinkingLevelOption[];
  thinkingOptions?: string[];
  thinkingDefault?: string;
};

/** Thinking level option available for a gateway session. */
export type GatewayThinkingLevelOption = {
  id: string;
  label: string;
};

/** Chat model override stored by Control UI. */
export type ChatModelOverride = import("./chat-model-ref.types.ts").ChatModelOverride;

/** Agent row shape returned by the gateway sessions API. */
export type GatewayAgentRow = SharedGatewayAgentRow;

/** Agent list response for the Control UI agent picker. */
export type AgentsListResult = {
  defaultId: string;
  mainKey: string;
  scope: string;
  agents: GatewayAgentRow[];
};

/** Display identity for one agent. */
export type AgentIdentityResult = {
  agentId: string;
  name: string;
  avatar: string;
  avatarSource?: string | null;
  avatarStatus?: "none" | "local" | "remote" | "data" | null;
  avatarReason?: string | null;
  emoji?: string;
};

/** Agent workspace file metadata and optional content. */
export type AgentFileEntry = {
  name: string;
  path: string;
  missing: boolean;
  size?: number;
  updatedAtMs?: number;
  content?: string;
};

/** File list response for an agent workspace. */
export type AgentsFilesListResult = {
  agentId: string;
  workspace: string;
  files: AgentFileEntry[];
};

/** Single-file response for an agent workspace. */
export type AgentsFilesGetResult = {
  agentId: string;
  workspace: string;
  file: AgentFileEntry;
};

/** Successful file write response for an agent workspace. */
export type AgentsFilesSetResult = {
  ok: true;
  agentId: string;
  workspace: string;
  file: AgentFileEntry;
};

/** Current or terminal run status shown on session rows. */
export type SessionRunStatus = "running" | "done" | "failed" | "killed" | "timeout";
/** Subagent run activity state projected into a parent session row. */
export type SubagentRunState = "active" | "interrupted" | "historical";

/** Reason a session compaction checkpoint was created. */
export type SessionCompactionCheckpointReason =
  | "manual"
  | "auto-threshold"
  | "overflow-retry"
  | "timeout-retry";

/** Transcript reference stored for a compaction checkpoint side. */
export type SessionCompactionTranscriptReference = {
  sessionId: string;
  sessionFile?: string;
  leafId?: string;
  entryId?: string;
};

/** Session compaction checkpoint metadata shown in restore/branch flows. */
export type SessionCompactionCheckpoint = {
  checkpointId: string;
  sessionKey: string;
  sessionId: string;
  createdAt: number;
  reason: SessionCompactionCheckpointReason;
  tokensBefore?: number;
  tokensAfter?: number;
  summary?: string;
  firstKeptEntryId?: string;
  preCompaction: SessionCompactionTranscriptReference;
  postCompaction: SessionCompactionTranscriptReference;
};

/** Compact checkpoint summary embedded in session rows. */
export type SessionCompactionCheckpointPreview = Pick<
  SessionCompactionCheckpoint,
  "checkpointId" | "createdAt" | "reason"
>;

/** Gateway session row rendered by the sessions/workboard views. */
export type GatewaySessionRow = {
  key: string;
  spawnedBy?: string;
  kind: "cron" | "direct" | "group" | "global" | "unknown";
  label?: string;
  displayName?: string;
  surface?: string;
  subject?: string;
  room?: string;
  space?: string;
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
  reasoningLevel?: string;
  elevatedLevel?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  totalTokensFresh?: boolean;
  status?: SessionRunStatus;
  archived?: boolean;
  hasActiveRun?: boolean;
  subagentRunState?: SubagentRunState;
  hasActiveSubagentRun?: boolean;
  startedAt?: number;
  endedAt?: number;
  runtimeMs?: number;
  childSessions?: string[];
  model?: string;
  modelProvider?: string;
  agentRuntime?: GatewayAgentRuntime;
  contextTokens?: number;
  compactionCheckpointCount?: number;
  latestCompactionCheckpoint?: SessionCompactionCheckpointPreview;
  goal?: SessionGoal;
};

/** Gateway sessions list response with UI-specific defaults and rows. */
export type SessionsListResult = SessionsListResultBase<GatewaySessionsDefaults, GatewaySessionRow>;

/** List of compaction checkpoints for one session. */
export type SessionsCompactionListResult = {
  ok: true;
  key: string;
  checkpoints: SessionCompactionCheckpoint[];
};

/** Single compaction checkpoint fetch response. */
export type SessionsCompactionGetResult = {
  ok: true;
  key: string;
  checkpoint: SessionCompactionCheckpoint;
};

/** Response after branching a session from a compaction checkpoint. */
export type SessionsCompactionBranchResult = {
  ok: true;
  sourceKey: string;
  key: string;
  sessionId: string;
  checkpoint: SessionCompactionCheckpoint;
  entry: {
    sessionId: string;
    updatedAt: number;
  } & Record<string, unknown>;
};

/** Response after restoring a session to a compaction checkpoint. */
export type SessionsCompactionRestoreResult = {
  ok: true;
  key: string;
  sessionId: string;
  checkpoint: SessionCompactionCheckpoint;
  entry: {
    sessionId: string;
    updatedAt: number;
  } & Record<string, unknown>;
};

/** Session patch response with resolved model/runtime fields. */
export type SessionsPatchResult = SessionsPatchResultBase<{
  sessionId: string;
  updatedAt?: number;
  thinkingLevel?: string;
  fastMode?: boolean;
  verboseLevel?: string;
  reasoningLevel?: string;
  elevatedLevel?: string;
}> & {
  resolved?: {
    modelProvider?: string;
    model?: string;
    agentRuntime?: GatewayAgentRuntime;
  };
};

/** Usage and cost DTOs rendered by Control UI charts. */
export type {
  CostUsageDailyEntry,
  CostUsageSummary,
  SessionsUsageEntry,
  SessionsUsageResult,
  SessionsUsageTotals,
  SessionUsageTimePoint,
  SessionUsageTimeSeries,
} from "./usage-types.ts";

/** Cron run outcome. */
export type CronRunStatus = "ok" | "error" | "skipped";
/** Cron delivery outcome. */
export type CronDeliveryStatus = "delivered" | "not-delivered" | "unknown" | "not-requested";
/** Enabled-state filter for cron jobs. */
export type CronJobsEnabledFilter = "all" | "enabled" | "disabled";
/** Sort keys for cron job lists. */
export type CronJobsSortBy = "nextRunAtMs" | "updatedAtMs" | "name";
/** Scope for manual cron run actions. */
export type CronRunScope = "job" | "all";
/** Status value used by cron run filters. */
export type CronRunsStatusValue = CronRunStatus;
/** Status filter for cron run logs. */
export type CronRunsStatusFilter = "all" | CronRunStatus;
/** Sort direction for cron tables. */
export type CronSortDir = "asc" | "desc";

/** Schedule forms supported by cron jobs. */
export type CronSchedule =
  | { kind: "at"; at: string }
  | { kind: "every"; everyMs: number; anchorMs?: number }
  | { kind: "cron"; expr: string; tz?: string; staggerMs?: number };

/** Target session selection for cron-triggered work. */
export type CronSessionTarget = "main" | "isolated" | "current" | `session:${string}`;
/** Wake behavior for cron-triggered work. */
export type CronWakeMode = "next-heartbeat" | "now";

/** Payload executed when a cron job fires. */
export type CronPayload =
  | { kind: "systemEvent"; text: string }
  | {
      kind: "agentTurn";
      message: string;
      model?: string;
      fallbacks?: string[];
      thinking?: string;
      timeoutSeconds?: number;
      allowUnsafeExternalContent?: boolean;
      lightContext?: boolean;
      deliver?: boolean;
      channel?: string;
      to?: string;
      bestEffortDeliver?: boolean;
    };

/** Delivery policy for cron job results. */
export type CronDelivery = {
  mode: "none" | "announce" | "webhook";
  channel?: string;
  to?: string;
  accountId?: string;
  bestEffort?: boolean;
  failureDestination?: CronFailureDestination;
};

/** Destination used for cron failure notifications. */
export type CronFailureDestination = {
  channel?: string;
  to?: string;
  mode?: "announce" | "webhook";
  accountId?: string;
};

/** Failure alert policy for repeated cron errors. */
export type CronFailureAlert = {
  after?: number;
  channel?: string;
  to?: string;
  cooldownMs?: number;
  mode?: "announce" | "webhook";
  accountId?: string;
};

/** Runtime state and last-run metadata for a cron job. */
export type CronJobState = {
  nextRunAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number;
  lastRunStatus?: CronRunStatus;
  lastStatus?: CronRunStatus;
  lastError?: string;
  lastErrorReason?: string;
  lastDurationMs?: number;
  consecutiveErrors?: number;
  lastDelivered?: boolean;
  lastDeliveryStatus?: CronDeliveryStatus;
  lastDeliveryError?: string;
  lastFailureNotificationDelivered?: boolean;
  lastFailureNotificationDeliveryStatus?: CronDeliveryStatus;
  lastFailureNotificationDeliveryError?: string;
  lastFailureAlertAtMs?: number;
};

/** Cron job row shape rendered by Control UI. */
export type CronJob = CronJobBase<
  CronSchedule,
  CronSessionTarget,
  CronWakeMode,
  CronPayload,
  CronDelivery,
  CronFailureAlert | false
> & {
  state?: CronJobState;
};

/** Aggregate cron scheduler status. */
export type CronStatus = {
  enabled: boolean;
  jobs: number;
  nextWakeAtMs?: number | null;
};

/** Cron run history row. */
export type CronRunLogEntry = {
  ts: number;
  jobId: string;
  action?: "finished";
  status?: CronRunStatus;
  durationMs?: number;
  error?: string;
  summary?: string;
  delivered?: boolean;
  deliveryStatus?: CronDeliveryStatus;
  deliveryError?: string;
  sessionId?: string;
  sessionKey?: string;
  runAtMs?: number;
  nextRunAtMs?: number;
  model?: string;
  provider?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    cache_read_tokens?: number;
    cache_write_tokens?: number;
  };
  jobName?: string;
};

/** Paginated cron jobs response. */
export type CronJobsListResult = {
  jobs: CronJob[];
  total?: number;
  limit?: number;
  offset?: number;
  nextOffset?: number | null;
  hasMore?: boolean;
};

/** Paginated cron run history response. */
export type CronRunsResult = {
  entries: CronRunLogEntry[];
  total?: number;
  limit?: number;
  offset?: number;
  nextOffset?: number | null;
  hasMore?: boolean;
};

/** Config prerequisite check for a skill. */
export type SkillsStatusConfigCheck = {
  path: string;
  satisfied: boolean;
};

/** Dependency install option advertised by a skill. */
export type SkillInstallOption = {
  id: string;
  kind: "brew" | "node" | "go" | "uv" | "download";
  label: string;
  bins: string[];
};

/** ClawHub registry link status for an installed skill. */
export type SkillClawHubLink =
  | {
      status: "linked";
      valid: true;
      registry: string;
      slug: string;
      installedVersion: string;
      installedAt: number;
      originPath?: string;
      lockPath?: string;
    }
  | {
      status: "invalid";
      valid: false;
      reason: string;
      registry?: string;
      slug?: string;
      installedVersion?: string;
      installedAt?: number;
      originPath?: string;
      lockPath?: string;
    };

/** Skill card file presence metadata. */
export type SkillCardStatus = {
  present: true;
  path: string;
  sizeBytes: number;
};

/** Skill status row rendered by skill management views. */
export type SkillStatusEntry = {
  name: string;
  description: string;
  source: string;
  filePath: string;
  baseDir: string;
  skillKey: string;
  bundled?: boolean;
  primaryEnv?: string;
  emoji?: string;
  homepage?: string;
  always: boolean;
  disabled: boolean;
  blockedByAllowlist: boolean;
  blockedByAgentFilter?: boolean;
  eligible: boolean;
  modelVisible?: boolean;
  userInvocable?: boolean;
  commandVisible?: boolean;
  requirements: {
    anyBins?: string[];
    bins: string[];
    env: string[];
    config: string[];
    os: string[];
  };
  missing: {
    bins: string[];
    env: string[];
    config: string[];
    os: string[];
  };
  configChecks: SkillsStatusConfigCheck[];
  install: SkillInstallOption[];
  clawhub?: SkillClawHubLink;
  skillCard?: SkillCardStatus;
};

/** Skill inventory/status report for a workspace and optional agent. */
export type SkillStatusReport = {
  workspaceDir: string;
  managedSkillsDir: string;
  agentId?: string;
  agentSkillFilter?: string[];
  skills: SkillStatusEntry[];
};

/** Loose gateway status summary used by generic panels. */
export type StatusSummary = Record<string, unknown>;

/** Loose gateway health snapshot used by generic panels. */
export type HealthSnapshot = Record<string, unknown>;

/** Strongly-typed health response from the gateway (richer than HealthSnapshot). */
export type HealthSummary = {
  ok: boolean;
  ts: number;
  durationMs: number;
  heartbeatSeconds: number;
  defaultAgentId: string;
  agents: Array<{ id: string; name?: string }>;
  sessions: {
    path: string;
    count: number;
    recent: Array<{
      key: string;
      updatedAt: number | null;
      age: number | null;
    }>;
  };
};

/** A model entry returned by the gateway model-catalog endpoint. */
export type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string;
  alias?: string;
  contextWindow?: number;
  reasoning?: boolean;
  input?: Array<"text" | "image" | "document">;
};

/** Tool catalog profile imported from gateway protocol schema. */
export type ToolCatalogProfile =
  import("../../../packages/gateway-protocol/src/schema.js").ToolCatalogProfile;
/** Tool catalog entry imported from gateway protocol schema. */
export type ToolCatalogEntry =
  import("../../../packages/gateway-protocol/src/schema.js").ToolCatalogEntry;
/** Tool catalog group imported from gateway protocol schema. */
export type ToolCatalogGroup =
  import("../../../packages/gateway-protocol/src/schema.js").ToolCatalogGroup;
/** Tool catalog response imported from gateway protocol schema. */
export type ToolsCatalogResult =
  import("../../../packages/gateway-protocol/src/schema.js").ToolsCatalogResult;
/** Effective tool entry imported from gateway protocol schema. */
export type ToolsEffectiveEntry =
  import("../../../packages/gateway-protocol/src/schema.js").ToolsEffectiveEntry;
/** Effective tool group imported from gateway protocol schema. */
export type ToolsEffectiveGroup =
  import("../../../packages/gateway-protocol/src/schema.js").ToolsEffectiveGroup;
/** Effective tool response imported from gateway protocol schema. */
export type ToolsEffectiveResult =
  import("../../../packages/gateway-protocol/src/schema.js").ToolsEffectiveResult;

/** Model auth expiry summary returned by the gateway. */
export type ModelAuthExpiry =
  import("../../../src/gateway/server-methods/models-auth-status.js").ModelAuthExpiry;
/** Auth profile status returned by the gateway. */
export type ModelAuthStatusProfile =
  import("../../../src/gateway/server-methods/models-auth-status.js").ModelAuthStatusProfile;
/** Provider auth status returned by the gateway. */
export type ModelAuthStatusProvider =
  import("../../../src/gateway/server-methods/models-auth-status.js").ModelAuthStatusProvider;
/** Model auth status response rendered by auth settings. */
export type ModelAuthStatusResult =
  import("../../../src/gateway/server-methods/models-auth-status.js").ModelAuthStatusResult;

/** Log severity parsed from gateway log lines. */
export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

/** Parsed log line shown by Control UI log viewers. */
export type LogEntry = {
  raw: string;
  time?: string | null;
  level?: LogLevel | null;
  subsystem?: string | null;
  message?: string | null;
  meta?: Record<string, unknown> | null;
};

// ── Attention ───────────────────────────────────────

/** Severity for dashboard attention items. */
export type AttentionSeverity = "error" | "warning" | "info";

/** Dashboard attention item with optional navigation target. */
export type AttentionItem = {
  severity: AttentionSeverity;
  icon: string;
  title: string;
  description: string;
  href?: string;
  external?: boolean;
};
