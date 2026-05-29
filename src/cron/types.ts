// Shared types for cron types behavior.
import type { FailoverReason } from "../agents/embedded-agent-helpers/types.js";
import type { EmbeddedAgentExecutionPhase } from "../agents/embedded-agent-runner/execution-phase.js";
import type { ChannelId } from "../channels/plugins/types.public.js";
import type { HookExternalContentSource } from "../security/external-content.js";
import type { CronJobBase } from "./types-shared.js";

/** Shared type for Cron Schedule in src/cron. */
export type CronSchedule =
  | { kind: "at"; at: string }
  | { kind: "every"; everyMs: number; anchorMs?: number }
  | {
      kind: "cron";
      expr: string;
      tz?: string;
      /** Optional deterministic stagger window in milliseconds (0 keeps exact schedule). */
      staggerMs?: number;
    };

/** Shared type for Cron Session Target in src/cron. */
export type CronSessionTarget = "main" | "isolated" | "current" | `session:${string}`;
/** Shared type for Cron Wake Mode in src/cron. */
export type CronWakeMode = "next-heartbeat" | "now";

/** Shared type for Cron Message Channel in src/cron. */
export type CronMessageChannel = ChannelId;

/** Shared type for Cron Delivery Mode in src/cron. */
export type CronDeliveryMode = "none" | "announce" | "webhook";

/** Shared type for Cron Delivery in src/cron. */
export type CronDelivery = {
  mode: CronDeliveryMode;
  channel?: CronMessageChannel;
  to?: string;
  /** Explicit thread/topic id for channels that support threaded delivery. */
  threadId?: string | number;
  /** Explicit channel account id for multi-account setups (e.g. multiple Telegram bots). */
  accountId?: string;
  bestEffort?: boolean;
  /** Separate destination for failure notifications. */
  failureDestination?: CronFailureDestination;
};

/** Shared type for Cron Failure Destination in src/cron. */
export type CronFailureDestination = {
  channel?: CronMessageChannel;
  to?: string;
  accountId?: string;
  mode?: "announce" | "webhook";
};

/** Shared type for Cron Delivery Patch in src/cron. */
export type CronDeliveryPatch = Partial<CronDelivery>;

/** Shared type for Cron Run Status in src/cron. */
export type CronRunStatus = "ok" | "error" | "skipped";
/** Shared type for Cron Delivery Status in src/cron. */
export type CronDeliveryStatus = "delivered" | "not-delivered" | "unknown" | "not-requested";

/** Shared type for Cron Delivery Trace Target in src/cron. */
export type CronDeliveryTraceTarget = {
  channel?: string;
  to?: string | null;
  accountId?: string;
  threadId?: string | number;
  source?: "explicit" | "last";
};

/** Shared type for Cron Delivery Trace Message Target in src/cron. */
export type CronDeliveryTraceMessageTarget = {
  channel: string;
  to?: string;
  accountId?: string;
  threadId?: string;
};

/** Shared type for Cron Delivery Trace in src/cron. */
export type CronDeliveryTrace = {
  intended?: CronDeliveryTraceTarget;
  resolved?: CronDeliveryTraceTarget & { ok: boolean; error?: string };
  messageToolSentTo?: CronDeliveryTraceMessageTarget[];
  fallbackUsed?: boolean;
  delivered?: boolean;
};

/** Shared type for Cron Failure Notification Delivery in src/cron. */
export type CronFailureNotificationDelivery = {
  /** Whether the last failed run's failure notification reached the target channel. */
  delivered?: boolean;
  status: CronDeliveryStatus;
  error?: string;
};

/** Shared type for Cron Delivery Preview in src/cron. */
export type CronDeliveryPreview = {
  label: string;
  detail: string;
};

/** Shared type for Cron Usage Summary in src/cron. */
export type CronUsageSummary = {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  cache_read_tokens?: number;
  cache_write_tokens?: number;
};

/** Shared type for Cron Run Telemetry in src/cron. */
export type CronRunTelemetry = {
  model?: string;
  provider?: string;
  usage?: CronUsageSummary;
};

/** Shared type for Cron Run Diagnostic Severity in src/cron. */
export type CronRunDiagnosticSeverity = "info" | "warn" | "error";

/** Shared type for Cron Run Diagnostic Source in src/cron. */
export type CronRunDiagnosticSource =
  | "cron-preflight"
  | "cron-setup"
  | "model-preflight"
  | "agent-run"
  | "tool"
  | "exec"
  | "delivery";

/** Shared type for Cron Run Diagnostic in src/cron. */
export type CronRunDiagnostic = {
  ts: number;
  source: CronRunDiagnosticSource;
  severity: CronRunDiagnosticSeverity;
  message: string;
  toolName?: string;
  exitCode?: number | null;
  truncated?: boolean;
};

/** Shared type for Cron Run Diagnostics in src/cron. */
export type CronRunDiagnostics = {
  summary?: string;
  entries: CronRunDiagnostic[];
};

/** Shared type for Cron Run Outcome in src/cron. */
export type CronRunOutcome = {
  status: CronRunStatus;
  error?: string;
  /** Optional classifier for execution errors to guide fallback behavior. */
  errorKind?: "delivery-target";
  summary?: string;
  sessionId?: string;
  sessionKey?: string;
  diagnostics?: CronRunDiagnostics;
};

/** Shared type for Cron Agent Execution Phase in src/cron. */
export type CronAgentExecutionPhase = EmbeddedAgentExecutionPhase;

/** Shared type for Cron Agent Execution Started in src/cron. */
export type CronAgentExecutionStarted = {
  jobId: string;
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  phase?: CronAgentExecutionPhase;
  provider?: string;
  model?: string;
  backend?: string;
  source?: string;
  tool?: string;
  toolCallId?: string;
  itemId?: string;
  /** @deprecated Use phase-specific execution milestones for watchdog progress. */
  firstModelCallStarted?: boolean;
};

/** Shared type for Cron Agent Execution Phase Update in src/cron. */
export type CronAgentExecutionPhaseUpdate = CronAgentExecutionStarted & {
  phase: CronAgentExecutionPhase;
};

/** Shared type for Cron Failure Alert in src/cron. */
export type CronFailureAlert = {
  after?: number;
  channel?: CronMessageChannel;
  to?: string;
  cooldownMs?: number;
  /** When true, consecutive skipped runs count toward the alert threshold. */
  includeSkipped?: boolean;
  /** Delivery mode: announce (via messaging channels) or webhook (HTTP POST). */
  mode?: "announce" | "webhook";
  /** Account ID for multi-account channel configurations. */
  accountId?: string;
};

/** Shared type for Cron Payload in src/cron. */
export type CronPayload = { kind: "systemEvent"; text: string } | CronAgentTurnPayload;

/** Shared type for Cron Payload Patch in src/cron. */
export type CronPayloadPatch = { kind: "systemEvent"; text?: string } | CronAgentTurnPayloadPatch;

type CronAgentTurnPayloadFields = {
  message: string;
  /** Optional model override (provider/model or alias). */
  model?: string;
  /** Optional per-job fallback models; overrides agent/global fallbacks when defined. */
  fallbacks?: string[];
  thinking?: string;
  timeoutSeconds?: number;
  allowUnsafeExternalContent?: boolean;
  /** Immutable external hook provenance for async dispatch. */
  externalContentSource?: HookExternalContentSource;
  /** If true, run with lightweight bootstrap context. */
  lightContext?: boolean;
  /** Optional tool allow-list; when set, only these tools are sent to the model. */
  toolsAllow?: string[];
};

type CronAgentTurnPayload = {
  kind: "agentTurn";
} & CronAgentTurnPayloadFields;

type CronAgentTurnPayloadPatch = {
  kind: "agentTurn";
} & Partial<Omit<CronAgentTurnPayloadFields, "toolsAllow">> & {
    toolsAllow?: string[] | null;
  };
/** Shared type for Cron Job State in src/cron. */
export type CronJobState = {
  nextRunAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number;
  /** Preferred execution outcome field. */
  lastRunStatus?: CronRunStatus;
  /** @deprecated Use lastRunStatus. */
  lastStatus?: "ok" | "error" | "skipped";
  lastError?: string;
  lastDiagnostics?: CronRunDiagnostics;
  lastDiagnosticSummary?: string;
  /** Classified reason for the last error (when available). */
  lastErrorReason?: FailoverReason;
  lastDurationMs?: number;
  /** Number of consecutive execution errors (reset on success). Used for backoff. */
  consecutiveErrors?: number;
  /** Number of consecutive skipped executions (reset on success or error). */
  consecutiveSkipped?: number;
  /** Last failure alert timestamp (ms since epoch) for cooldown gating. */
  lastFailureAlertAtMs?: number;
  /** Number of consecutive schedule computation errors. Auto-disables job after threshold. */
  scheduleErrorCount?: number;
  /** Explicit delivery outcome, separate from execution outcome. */
  lastDeliveryStatus?: CronDeliveryStatus;
  /** Delivery-specific error text when available. */
  lastDeliveryError?: string;
  /** Whether the last run's output was delivered to the target channel. */
  lastDelivered?: boolean;
  /** Whether the last failed run's failure notification was delivered to the target channel. */
  lastFailureNotificationDelivered?: boolean;
  /** Delivery outcome for the last failed run's failure notification. */
  lastFailureNotificationDeliveryStatus?: CronDeliveryStatus;
  /** Delivery-specific error for the last failed run's failure notification. */
  lastFailureNotificationDeliveryError?: string;
};

/** Shared type for Cron Job in src/cron. */
export type CronJob = CronJobBase<
  CronSchedule,
  CronSessionTarget,
  CronWakeMode,
  CronPayload,
  CronDelivery,
  CronFailureAlert | false
> & {
  state: CronJobState;
};

/** Shared type for Cron Store File in src/cron. */
export type CronStoreFile = {
  version: 1;
  jobs: CronJob[];
};

/** Shared type for Cron Job Create in src/cron. */
export type CronJobCreate = Omit<CronJob, "id" | "createdAtMs" | "updatedAtMs" | "state"> & {
  state?: Partial<CronJobState>;
};

/** Shared type for Cron Job Patch in src/cron. */
export type CronJobPatch = Partial<Omit<CronJob, "id" | "createdAtMs" | "state" | "payload">> & {
  payload?: CronPayloadPatch;
  delivery?: CronDeliveryPatch;
  state?: Partial<CronJobState>;
};
