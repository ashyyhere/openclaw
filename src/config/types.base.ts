// Shared base configuration types used across channels, sessions, logging, and web runtime.
import type { ChatType } from "../channels/chat-type.js";

/** Reply handling mode for incoming channel messages. */
export type ReplyMode = "text" | "command";
/** Typing indicator policy for channel replies. */
export type TypingMode = "never" | "instant" | "thinking" | "message";
/** Scope used when deriving session keys. */
export type SessionScope = "per-sender" | "global";
/** DM session-key granularity. */
export type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
/** Thread reply target policy. */
export type ReplyToMode = "off" | "first" | "all" | "batched";
/** Group conversation access policy. */
export type GroupPolicy = "open" | "disabled" | "allowlist";
/** DM access policy for channels. */
export type DmPolicy = "pairing" | "allowlist" | "open" | "disabled";
/** Policy for exposing contextual content to replies. */
export type ContextVisibilityMode = "all" | "allowlist" | "allowlist_quote";
/** Chunking strategy for long outbound text. */
export type TextChunkMode = "length" | "newline";
/** Preview/streaming mode for channel replies. */
export type StreamingMode = "off" | "partial" | "block" | "progress";
/** Amount of command/exec detail shown during streaming progress. */
export type ChannelStreamingCommandTextMode = "raw" | "status";

/** Retry policy for outbound channel/provider requests. */
export type OutboundRetryConfig = {
  /** Max retry attempts for outbound requests (default: 3). */
  attempts?: number;
  /** Minimum retry delay in ms (default: 300-500ms depending on provider). */
  minDelayMs?: number;
  /** Maximum retry delay cap in ms (default: 30000). */
  maxDelayMs?: number;
  /** Jitter factor (0-1) applied to delays (default: 0.1). */
  jitter?: number;
};

/** Coalescing thresholds for block streaming delivery. */
export type BlockStreamingCoalesceConfig = {
  minChars?: number;
  maxChars?: number;
  idleMs?: number;
};

/** Text chunk sizing and break preference for block streaming. */
export type BlockStreamingChunkConfig = {
  minChars?: number;
  maxChars?: number;
  breakPreference?: "paragraph" | "newline" | "sentence";
};

/** Progress-preview rendering config for streaming channel replies. */
export type ChannelStreamingProgressConfig = {
  /** Initial progress title. "auto" picks from labels; false hides the title. Default: "auto". */
  label?: string | false;
  /** Candidate labels for label="auto". Defaults to OpenClaw's built-in progress labels. */
  labels?: string[];
  /** Maximum number of progress lines to keep below the label. Default: 8. */
  maxLines?: number;
  /** Maximum characters per compact progress line before truncation. Default: 120. */
  maxLineChars?: number;
  /** Progress draft renderer. "text" is the portable fallback; "rich" lets supported channels use structured UI. */
  render?: "text" | "rich";
  /** Include compact tool/task progress in the draft. Default: true. */
  toolProgress?: boolean;
  /** Command/exec progress detail in the draft. "raw" preserves released behavior; "status" shows only the tool label. Default: "raw". */
  commandText?: ChannelStreamingCommandTextMode;
};

/** Live preview config for channels that edit an in-progress message. */
export type ChannelStreamingPreviewConfig = {
  /** Chunking thresholds for preview-draft updates while streaming. */
  chunk?: BlockStreamingChunkConfig;
  /**
   * Render live tool/activity updates into the preview draft for channels that
   * edit a single preview message in place.
   * Default: true.
   */
  toolProgress?: boolean;
  /** Command/exec progress detail in the preview. "raw" preserves released behavior; "status" shows only the tool label. Default: "raw". */
  commandText?: ChannelStreamingCommandTextMode;
};

/** Chunked block delivery config for streaming replies. */
export type ChannelStreamingBlockConfig = {
  /** Enable chunked block-reply delivery for channels that support it. */
  enabled?: boolean;
  /** Merge streamed block replies before sending. */
  coalesce?: BlockStreamingCoalesceConfig;
};

/** Full channel streaming config for previews, chunks, progress, and native transport. */
export type ChannelStreamingConfig = {
  /**
   * Preview streaming mode:
   * - "off": disable preview updates
   * - "partial": update one preview in place
   * - "block": emit larger chunked preview updates
   * - "progress": progress/status preview mode for channels that support it
   */
  mode?: StreamingMode;
  /** Chunking mode for outbound text delivery. */
  chunkMode?: TextChunkMode;
  /**
   * Channel-specific native transport streaming toggle.
   * Used today by Slack's native stream API.
   */
  nativeTransport?: boolean;
  preview?: ChannelStreamingPreviewConfig;
  progress?: ChannelStreamingProgressConfig;
  block?: ChannelStreamingBlockConfig;
};

/** Streaming subset used by final outbound delivery. */
export type ChannelDeliveryStreamingConfig = Pick<ChannelStreamingConfig, "chunkMode" | "block">;

/** Streaming subset used by in-progress preview rendering. */
export type ChannelPreviewStreamingConfig = Pick<
  ChannelStreamingConfig,
  "mode" | "chunkMode" | "preview" | "progress" | "block"
>;

/** Markdown table rendering mode for channel formatting. */
export type MarkdownTableMode = "off" | "bullets" | "code" | "block";

/** Markdown formatting config shared by reply renderers. */
export type MarkdownConfig = {
  /** Table rendering mode (off|bullets|code|block). */
  tables?: MarkdownTableMode;
};

/** Artificial pacing config for human-like block replies. */
export type HumanDelayConfig = {
  /** Delay style for block replies (off|natural|custom). */
  mode?: "off" | "natural" | "custom";
  /** Minimum delay in milliseconds (default: 800). */
  minMs?: number;
  /** Maximum delay in milliseconds (default: 2500). */
  maxMs?: number;
};

/** Decision returned by session send-policy rules. */
export type SessionSendPolicyAction = "allow" | "deny";
/** Match criteria for session send-policy rules. */
export type SessionSendPolicyMatch = {
  channel?: string;
  chatType?: ChatType;
  /**
   * Session key prefix match.
   * Note: some consumers match against a normalized key (for example, stripping `agent:<id>:`).
   */
  keyPrefix?: string;
  /** Optional raw session-key prefix match for consumers that normalize session keys. */
  rawKeyPrefix?: string;
};
/** One ordered session send-policy rule. */
export type SessionSendPolicyRule = {
  action: SessionSendPolicyAction;
  match?: SessionSendPolicyMatch;
};
/** Default and ordered rules for session send authorization. */
export type SessionSendPolicyConfig = {
  default?: SessionSendPolicyAction;
  rules?: SessionSendPolicyRule[];
};

/** Session reset boundary mode. */
export type SessionResetMode = "daily" | "idle";
/** Daily and/or idle reset policy for sessions. */
export type SessionResetConfig = {
  mode?: SessionResetMode;
  /** Local hour (0-23) for the daily reset boundary. */
  atHour?: number;
  /** Sliding idle window (minutes). When set with daily mode, whichever expires first wins. */
  idleMinutes?: number;
};
/** Session reset overrides by conversation type. */
export type SessionResetByTypeConfig = {
  direct?: SessionResetConfig;
  /** @deprecated Use `direct` instead. Kept for backward compatibility. */
  dm?: SessionResetConfig;
  group?: SessionResetConfig;
  thread?: SessionResetConfig;
};

/** Defaults for binding sessions to native channel threads/conversations. */
export type SessionThreadBindingsConfig = {
  /**
   * Master switch for thread-bound session routing features.
   * Channel/provider keys can override this default.
   */
  enabled?: boolean;
  /**
   * Inactivity window for thread-bound sessions (hours).
   * Session auto-unfocuses after this amount of idle time. Set to 0 to disable. Default: 24.
   */
  idleHours?: number;
  /**
   * Optional hard max age for thread-bound sessions (hours).
   * Session auto-unfocuses once this age is reached even if active. Set to 0 to disable. Default: 0.
   */
  maxAgeHours?: number;
  /**
   * Allow channel integrations to create thread-bound work sessions from
   * sessions_spawn or native ACP spawn flows. Channel/account keys can override.
   * Default: true when thread bindings are enabled.
   */
  spawnSessions?: boolean;
  /**
   * Default context mode for native subagents spawned into a bound thread.
   * Default: "fork" so the child starts from the requester transcript.
   */
  defaultSpawnContext?: "isolated" | "fork";
};

/** Core session routing, storage, reset, typing, and maintenance config. */
export type SessionConfig = {
  scope?: SessionScope;
  /** DM session scoping (default: "main"). */
  dmScope?: DmScope;
  /** Map platform-prefixed identities (e.g. "telegram:123") to canonical DM peers. */
  identityLinks?: Record<string, string[]>;
  resetTriggers?: string[];
  idleMinutes?: number;
  reset?: SessionResetConfig;
  resetByType?: SessionResetByTypeConfig;
  /** Channel-specific reset overrides (e.g. { discord: { mode: "idle", idleMinutes: 10080 } }). */
  resetByChannel?: Record<string, SessionResetConfig>;
  store?: string;
  typingIntervalSeconds?: number;
  typingMode?: TypingMode;
  mainKey?: string;
  sendPolicy?: SessionSendPolicyConfig;
  /** Session transcript write-lock acquisition policy. */
  writeLock?: SessionWriteLockConfig;
  agentToAgent?: {
    /** Max ping-pong turns between requester/target (0-20). Default: 5. */
    maxPingPongTurns?: number;
  };
  /** Shared defaults for thread-bound session routing across channels/providers. */
  threadBindings?: SessionThreadBindingsConfig;
  /** Automatic session store maintenance (pruning, capping, archive retention, disk budget). */
  maintenance?: SessionMaintenanceConfig;
};

/** Session transcript write-lock timing config. */
export type SessionWriteLockConfig = {
  /** How long to wait while acquiring a session transcript write lock. Default: 60000. */
  acquireTimeoutMs?: number;
  /** When an existing lock can be treated as stale and reclaimed. Default: 1800000. */
  staleMs?: number;
  /** Maximum in-process hold time before the watchdog releases the lock. Default: 300000. */
  maxHoldMs?: number;
};

/** Whether session maintenance enforces cleanup or only warns. */
export type SessionMaintenanceMode = "enforce" | "warn";

/** Session store pruning, archive retention, and disk-budget config. */
export type SessionMaintenanceConfig = {
  /** Whether to enforce maintenance or warn only. Default: "warn". */
  mode?: SessionMaintenanceMode;
  /** Remove session entries older than this duration (e.g. "30d", "12h"). Default: "30d". */
  pruneAfter?: string | number;
  /** @deprecated Use pruneAfter instead. */
  pruneDays?: number;
  /** Maximum number of session entries to keep. Default: 500. */
  maxEntries?: number;
  /** @deprecated Ignored. Run `openclaw doctor --fix` to remove. */
  rotateBytes?: number | string;
  /**
   * Retention for archived reset transcripts (`*.reset.<timestamp>`).
   * Set `false` to disable reset-archive cleanup. Default: same as `pruneAfter` (30d).
   */
  resetArchiveRetention?: string | number | false;
  /**
   * Optional per-agent sessions-directory disk budget (e.g. "500mb").
   * When exceeded, warn (mode=warn) or enforce oldest-first cleanup (mode=enforce).
   */
  maxDiskBytes?: number | string;
  /**
   * Target size after disk-budget cleanup (high-water mark), e.g. "400mb".
   * Default: 80% of maxDiskBytes.
   */
  highWaterBytes?: number | string;
};

/** File/console logging and redaction config. */
export type LoggingConfig = {
  level?: "silent" | "fatal" | "error" | "warn" | "info" | "debug" | "trace";
  file?: string;
  /** Maximum size of a single log file in bytes before rotation. Default: 100 MB. */
  maxFileBytes?: number;
  consoleLevel?: "silent" | "fatal" | "error" | "warn" | "info" | "debug" | "trace";
  consoleStyle?: "pretty" | "compact" | "json";
  /** Redact sensitive tokens in log sinks and persisted transcript text. Default: "tools". Safety-boundary UI/tool/diagnostic payloads may still redact when this is "off". */
  redactSensitive?: "off" | "tools";
  /** Regex patterns used to redact sensitive tokens from logs and transcripts. */
  redactPatterns?: string[];
};

/** OpenTelemetry export config for diagnostics. */
export type DiagnosticsOtelConfig = {
  enabled?: boolean;
  endpoint?: string;
  tracesEndpoint?: string;
  metricsEndpoint?: string;
  logsEndpoint?: string;
  protocol?: "http/protobuf" | "grpc";
  headers?: Record<string, string>;
  serviceName?: string;
  traces?: boolean;
  metrics?: boolean;
  logs?: boolean;
  /** Trace sample rate (0.0 - 1.0). */
  sampleRate?: number;
  /** Metric export interval (ms). */
  flushIntervalMs?: number;
  /**
   * Opt-in raw content capture for OTEL span attributes.
   * Boolean `true` captures non-system message/tool content; the object form
   * can enable each content class explicitly.
   */
  captureContent?:
    | boolean
    | {
        enabled?: boolean;
        inputMessages?: boolean;
        outputMessages?: boolean;
        toolInputs?: boolean;
        toolOutputs?: boolean;
        systemPrompt?: boolean;
        toolDefinitions?: boolean;
      };
};

/** Prompt-cache trace capture config. */
export type DiagnosticsCacheTraceConfig = {
  enabled?: boolean;
  filePath?: string;
  includeMessages?: boolean;
  includePrompt?: boolean;
  includeSystem?: boolean;
};

/** Runtime diagnostics flags and exporters. */
export type DiagnosticsConfig = {
  enabled?: boolean;
  /** Optional ad-hoc diagnostics flags (e.g. "telegram.http"). */
  flags?: string[];
  /** Threshold in ms before a processing session with no observed progress logs diagnostics. */
  stuckSessionWarnMs?: number;
  /** Threshold in ms before eligible stalled active work may be aborted for recovery. */
  stuckSessionAbortMs?: number;
  /** Capture a redacted stability snapshot when memory pressure reaches critical. Default: false. */
  memoryPressureSnapshot?: boolean;
  otel?: DiagnosticsOtelConfig;
  cacheTrace?: DiagnosticsCacheTraceConfig;
};

/** Exponential reconnect policy for web-backed providers. */
export type WebReconnectConfig = {
  initialMs?: number;
  maxMs?: number;
  factor?: number;
  jitter?: number;
  maxAttempts?: number; // 0 = unlimited
};

/** WhatsApp web transport timing config. */
export type WebWhatsAppConfig = {
  /** Baileys application ping interval in milliseconds. Default: 25000. */
  keepAliveIntervalMs?: number;
  /** WebSocket opening handshake timeout in milliseconds. Default: 60000. */
  connectTimeoutMs?: number;
  /** Baileys query timeout in milliseconds. Default: 60000. */
  defaultQueryTimeoutMs?: number;
};

/** Web-provider runtime config. */
export type WebConfig = {
  /** If false, do not start the WhatsApp web provider. Default: true. */
  enabled?: boolean;
  heartbeatSeconds?: number;
  reconnect?: WebReconnectConfig;
  whatsapp?: WebWhatsAppConfig;
};

// Provider docking: allowlists keyed by provider id (and internal "webchat").
/** Provider/channel keyed elevated allow-from entries for agent docking. */
export type AgentElevatedAllowFromConfig = Partial<Record<string, Array<string | number>>>;

/** Display identity shown by channels and generated replies. */
export type IdentityConfig = {
  name?: string;
  theme?: string;
  emoji?: string;
  /** Avatar image: workspace-relative path, http(s) URL, or data URI. */
  avatar?: string;
};
