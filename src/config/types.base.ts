// config types base helpers and runtime behavior.
import type { ChatType } from "../channels/chat-type.js";

/** Shared type for Reply Mode in src/config. */
export type ReplyMode = "text" | "command";
/** Shared type for Typing Mode in src/config. */
export type TypingMode = "never" | "instant" | "thinking" | "message";
/** Shared type for Session Scope in src/config. */
export type SessionScope = "per-sender" | "global";
/** Shared type for Dm Scope in src/config. */
export type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
/** Shared type for Reply To Mode in src/config. */
export type ReplyToMode = "off" | "first" | "all" | "batched";
/** Shared type for Group Policy in src/config. */
export type GroupPolicy = "open" | "disabled" | "allowlist";
/** Shared type for Dm Policy in src/config. */
export type DmPolicy = "pairing" | "allowlist" | "open" | "disabled";
/** Shared type for Context Visibility Mode in src/config. */
export type ContextVisibilityMode = "all" | "allowlist" | "allowlist_quote";
/** Shared type for Text Chunk Mode in src/config. */
export type TextChunkMode = "length" | "newline";
/** Shared type for Streaming Mode in src/config. */
export type StreamingMode = "off" | "partial" | "block" | "progress";
/** Shared type for Channel Streaming Command Text Mode in src/config. */
export type ChannelStreamingCommandTextMode = "raw" | "status";

/** Shared type for Outbound Retry Config in src/config. */
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

/** Shared type for Block Streaming Coalesce Config in src/config. */
export type BlockStreamingCoalesceConfig = {
  minChars?: number;
  maxChars?: number;
  idleMs?: number;
};

/** Shared type for Block Streaming Chunk Config in src/config. */
export type BlockStreamingChunkConfig = {
  minChars?: number;
  maxChars?: number;
  breakPreference?: "paragraph" | "newline" | "sentence";
};

/** Shared type for Channel Streaming Progress Config in src/config. */
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

/** Shared type for Channel Streaming Preview Config in src/config. */
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

/** Shared type for Channel Streaming Block Config in src/config. */
export type ChannelStreamingBlockConfig = {
  /** Enable chunked block-reply delivery for channels that support it. */
  enabled?: boolean;
  /** Merge streamed block replies before sending. */
  coalesce?: BlockStreamingCoalesceConfig;
};

/** Shared type for Channel Streaming Config in src/config. */
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

/** Shared type for Channel Delivery Streaming Config in src/config. */
export type ChannelDeliveryStreamingConfig = Pick<ChannelStreamingConfig, "chunkMode" | "block">;

/** Shared type for Channel Preview Streaming Config in src/config. */
export type ChannelPreviewStreamingConfig = Pick<
  ChannelStreamingConfig,
  "mode" | "chunkMode" | "preview" | "progress" | "block"
>;

/** Shared type for Markdown Table Mode in src/config. */
export type MarkdownTableMode = "off" | "bullets" | "code" | "block";

/** Shared type for Markdown Config in src/config. */
export type MarkdownConfig = {
  /** Table rendering mode (off|bullets|code|block). */
  tables?: MarkdownTableMode;
};

/** Shared type for Human Delay Config in src/config. */
export type HumanDelayConfig = {
  /** Delay style for block replies (off|natural|custom). */
  mode?: "off" | "natural" | "custom";
  /** Minimum delay in milliseconds (default: 800). */
  minMs?: number;
  /** Maximum delay in milliseconds (default: 2500). */
  maxMs?: number;
};

/** Shared type for Session Send Policy Action in src/config. */
export type SessionSendPolicyAction = "allow" | "deny";
/** Shared type for Session Send Policy Match in src/config. */
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
/** Shared type for Session Send Policy Rule in src/config. */
export type SessionSendPolicyRule = {
  action: SessionSendPolicyAction;
  match?: SessionSendPolicyMatch;
};
/** Shared type for Session Send Policy Config in src/config. */
export type SessionSendPolicyConfig = {
  default?: SessionSendPolicyAction;
  rules?: SessionSendPolicyRule[];
};

/** Shared type for Session Reset Mode in src/config. */
export type SessionResetMode = "daily" | "idle";
/** Shared type for Session Reset Config in src/config. */
export type SessionResetConfig = {
  mode?: SessionResetMode;
  /** Local hour (0-23) for the daily reset boundary. */
  atHour?: number;
  /** Sliding idle window (minutes). When set with daily mode, whichever expires first wins. */
  idleMinutes?: number;
};
/** Shared type for Session Reset By Type Config in src/config. */
export type SessionResetByTypeConfig = {
  direct?: SessionResetConfig;
  /** @deprecated Use `direct` instead. Kept for backward compatibility. */
  dm?: SessionResetConfig;
  group?: SessionResetConfig;
  thread?: SessionResetConfig;
};

/** Shared type for Session Thread Bindings Config in src/config. */
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

/** Shared type for Session Config in src/config. */
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

/** Shared type for Session Write Lock Config in src/config. */
export type SessionWriteLockConfig = {
  /** How long to wait while acquiring a session transcript write lock. Default: 60000. */
  acquireTimeoutMs?: number;
  /** When an existing lock can be treated as stale and reclaimed. Default: 1800000. */
  staleMs?: number;
  /** Maximum in-process hold time before the watchdog releases the lock. Default: 300000. */
  maxHoldMs?: number;
};

/** Shared type for Session Maintenance Mode in src/config. */
export type SessionMaintenanceMode = "enforce" | "warn";

/** Shared type for Session Maintenance Config in src/config. */
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

/** Shared type for Logging Config in src/config. */
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

/** Shared type for Diagnostics Otel Config in src/config. */
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

/** Shared type for Diagnostics Cache Trace Config in src/config. */
export type DiagnosticsCacheTraceConfig = {
  enabled?: boolean;
  filePath?: string;
  includeMessages?: boolean;
  includePrompt?: boolean;
  includeSystem?: boolean;
};

/** Shared type for Diagnostics Config in src/config. */
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

/** Shared type for Web Reconnect Config in src/config. */
export type WebReconnectConfig = {
  initialMs?: number;
  maxMs?: number;
  factor?: number;
  jitter?: number;
  maxAttempts?: number; // 0 = unlimited
};

/** Shared type for Web Whats App Config in src/config. */
export type WebWhatsAppConfig = {
  /** Baileys application ping interval in milliseconds. Default: 25000. */
  keepAliveIntervalMs?: number;
  /** WebSocket opening handshake timeout in milliseconds. Default: 60000. */
  connectTimeoutMs?: number;
  /** Baileys query timeout in milliseconds. Default: 60000. */
  defaultQueryTimeoutMs?: number;
};

/** Shared type for Web Config in src/config. */
export type WebConfig = {
  /** If false, do not start the WhatsApp web provider. Default: true. */
  enabled?: boolean;
  heartbeatSeconds?: number;
  reconnect?: WebReconnectConfig;
  whatsapp?: WebWhatsAppConfig;
};

// Provider docking: allowlists keyed by provider id (and internal "webchat").
/** Shared type for Agent Elevated Allow From Config in src/config. */
export type AgentElevatedAllowFromConfig = Partial<Record<string, Array<string | number>>>;

/** Shared type for Identity Config in src/config. */
export type IdentityConfig = {
  name?: string;
  theme?: string;
  emoji?: string;
  /** Avatar image: workspace-relative path, http(s) URL, or data URI. */
  avatar?: string;
};
