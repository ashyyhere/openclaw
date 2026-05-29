// TypeBox schemas for session lifecycle, messaging, patching, compaction, and usage RPCs.
import { Type } from "typebox";
import { PluginJsonValueSchema } from "./plugins.js";
import { NonEmptyString, SessionLabelString } from "./primitives.js";

/** Allowed reasons for writing a session compaction checkpoint. */
export const SessionCompactionCheckpointReasonSchema = Type.Union([
  Type.Literal("manual"),
  Type.Literal("auto-threshold"),
  Type.Literal("overflow-retry"),
  Type.Literal("timeout-retry"),
]);

/** Event payload emitted while long-running session operations progress. */
export const SessionOperationEventSchema = Type.Object(
  {
    operationId: NonEmptyString,
    operation: Type.Literal("compact"),
    phase: Type.Union([Type.Literal("start"), Type.Literal("end")]),
    sessionKey: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    ts: Type.Integer({ minimum: 0 }),
    completed: Type.Optional(Type.Boolean()),
    reason: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Transcript location recorded before or after a compaction checkpoint. */
export const SessionCompactionTranscriptReferenceSchema = Type.Object(
  {
    sessionId: NonEmptyString,
    sessionFile: Type.Optional(NonEmptyString),
    leafId: Type.Optional(NonEmptyString),
    entryId: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Persisted checkpoint metadata for compaction branch/restore workflows. */
export const SessionCompactionCheckpointSchema = Type.Object(
  {
    checkpointId: NonEmptyString,
    sessionKey: NonEmptyString,
    sessionId: NonEmptyString,
    createdAt: Type.Integer({ minimum: 0 }),
    reason: SessionCompactionCheckpointReasonSchema,
    tokensBefore: Type.Optional(Type.Integer({ minimum: 0 })),
    tokensAfter: Type.Optional(Type.Integer({ minimum: 0 })),
    summary: Type.Optional(Type.String()),
    firstKeptEntryId: Type.Optional(NonEmptyString),
    preCompaction: SessionCompactionTranscriptReferenceSchema,
    postCompaction: SessionCompactionTranscriptReferenceSchema,
  },
  { additionalProperties: false },
);

/** Params schema for filtering and decorating session list results. */
export const SessionsListParamsSchema = Type.Object(
  {
    /**
     * Maximum rows to return. Omitted Gateway RPC calls use a bounded default
     * to keep large session stores from monopolizing the event loop.
     */
    limit: Type.Optional(Type.Integer({ minimum: 1 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
    activeMinutes: Type.Optional(Type.Integer({ minimum: 1 })),
    includeGlobal: Type.Optional(Type.Boolean()),
    includeUnknown: Type.Optional(Type.Boolean()),
    /**
     * Limit returned agent-scoped rows to agents currently present in config.
     * Broad disk discovery remains the default for recovery/ACP consumers.
     */
    configuredAgentsOnly: Type.Optional(Type.Boolean()),
    /**
     * Read first 8KB of each session transcript to derive title from first user message.
     * Performs a file read per session - use `limit` to bound result set on large stores.
     */
    includeDerivedTitles: Type.Optional(Type.Boolean()),
    /**
     * Read last 16KB of each session transcript to extract most recent message preview.
     * Performs a file read per session - use `limit` to bound result set on large stores.
     */
    includeLastMessage: Type.Optional(Type.Boolean()),
    label: Type.Optional(SessionLabelString),
    spawnedBy: Type.Optional(NonEmptyString),
    agentId: Type.Optional(NonEmptyString),
    search: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Params schema for repairing stale or malformed session bindings. */
export const SessionsCleanupParamsSchema = Type.Object(
  {
    agent: Type.Optional(NonEmptyString),
    allAgents: Type.Optional(Type.Boolean()),
    enforce: Type.Optional(Type.Boolean()),
    activeKey: Type.Optional(NonEmptyString),
    fixMissing: Type.Optional(Type.Boolean()),
    fixDmScope: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Params schema for reading bounded transcript previews for selected sessions. */
export const SessionsPreviewParamsSchema = Type.Object(
  {
    keys: Type.Array(NonEmptyString, { minItems: 1 }),
    limit: Type.Optional(Type.Integer({ minimum: 1 })),
    maxChars: Type.Optional(Type.Integer({ minimum: 20 })),
  },
  { additionalProperties: false },
);

/** Params schema for describing one session and optional derived display fields. */
export const SessionsDescribeParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    includeDerivedTitles: Type.Optional(Type.Boolean()),
    includeLastMessage: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Params schema for resolving a session by key, id, label, or ownership metadata. */
export const SessionsResolveParamsSchema = Type.Object(
  {
    key: Type.Optional(NonEmptyString),
    sessionId: Type.Optional(NonEmptyString),
    label: Type.Optional(SessionLabelString),
    agentId: Type.Optional(NonEmptyString),
    spawnedBy: Type.Optional(NonEmptyString),
    includeGlobal: Type.Optional(Type.Boolean()),
    includeUnknown: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Params schema for creating or adopting a session with optional seed message. */
export const SessionsCreateParamsSchema = Type.Object(
  {
    key: Type.Optional(NonEmptyString),
    agentId: Type.Optional(NonEmptyString),
    label: Type.Optional(SessionLabelString),
    model: Type.Optional(NonEmptyString),
    parentSessionKey: Type.Optional(NonEmptyString),
    emitCommandHooks: Type.Optional(Type.Boolean()),
    task: Type.Optional(Type.String()),
    message: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Params schema for sending a user message into an existing session. */
export const SessionsSendParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    message: Type.String(),
    thinking: Type.Optional(Type.String()),
    attachments: Type.Optional(Type.Array(Type.Unknown())),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
    idempotencyKey: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Params schema for subscribing to live message events for one session. */
export const SessionsMessagesSubscribeParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Params schema for unsubscribing from live message events for one session. */
export const SessionsMessagesUnsubscribeParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Params schema for aborting active work by session, run, or agent scope. */
export const SessionsAbortParamsSchema = Type.Object(
  {
    key: Type.Optional(NonEmptyString),
    runId: Type.Optional(NonEmptyString),
    agentId: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Params schema for updating persisted session settings and ownership metadata. */
export const SessionsPatchParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    label: Type.Optional(Type.Union([SessionLabelString, Type.Null()])),
    thinkingLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    fastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
    verboseLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    traceLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    reasoningLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    responseUsage: Type.Optional(
      Type.Union([
        Type.Literal("off"),
        Type.Literal("tokens"),
        Type.Literal("full"),
        // Backward compat with older clients/stores.
        Type.Literal("on"),
        Type.Null(),
      ]),
    ),
    elevatedLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    execHost: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    execSecurity: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    execAsk: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    execNode: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    model: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    spawnedBy: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    spawnedWorkspaceDir: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    spawnedCwd: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    spawnDepth: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
    subagentRole: Type.Optional(
      Type.Union([Type.Literal("orchestrator"), Type.Literal("leaf"), Type.Null()]),
    ),
    subagentControlScope: Type.Optional(
      Type.Union([Type.Literal("children"), Type.Literal("none"), Type.Null()]),
    ),
    inheritedToolAllow: Type.Optional(Type.Union([Type.Array(NonEmptyString), Type.Null()])),
    inheritedToolDeny: Type.Optional(Type.Union([Type.Array(NonEmptyString), Type.Null()])),
    sendPolicy: Type.Optional(
      Type.Union([Type.Literal("allow"), Type.Literal("deny"), Type.Null()]),
    ),
    groupActivation: Type.Optional(
      Type.Union([Type.Literal("mention"), Type.Literal("always"), Type.Null()]),
    ),
  },
  { additionalProperties: false },
);

/** Params schema for setting or unsetting plugin-owned session state. */
export const SessionsPluginPatchParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    pluginId: NonEmptyString,
    namespace: NonEmptyString,
    value: Type.Optional(PluginJsonValueSchema),
    unset: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Result schema for plugin-owned session state updates. */
export const SessionsPluginPatchResultSchema = Type.Object(
  {
    ok: Type.Literal(true),
    key: NonEmptyString,
    value: Type.Optional(PluginJsonValueSchema),
  },
  { additionalProperties: false },
);

/** Params schema for resetting a session transcript binding. */
export const SessionsResetParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    reason: Type.Optional(Type.Union([Type.Literal("new"), Type.Literal("reset")])),
  },
  { additionalProperties: false },
);

/** Params schema for deleting session metadata and optionally transcript data. */
export const SessionsDeleteParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    deleteTranscript: Type.Optional(Type.Boolean()),
    // Internal control: when false, still unbind thread bindings but skip hook emission.
    emitLifecycleHooks: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Params schema for manually compacting a session transcript. */
export const SessionsCompactParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    maxLines: Type.Optional(Type.Integer({ minimum: 1 })),
  },
  { additionalProperties: false },
);

/** Params schema for listing compaction checkpoints for a session. */
export const SessionsCompactionListParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Params schema for fetching one compaction checkpoint. */
export const SessionsCompactionGetParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    checkpointId: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Params schema for branching a session from a compaction checkpoint. */
export const SessionsCompactionBranchParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    checkpointId: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Params schema for restoring a session to a compaction checkpoint. */
export const SessionsCompactionRestoreParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    checkpointId: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Result schema for listing compaction checkpoints. */
export const SessionsCompactionListResultSchema = Type.Object(
  {
    ok: Type.Literal(true),
    key: NonEmptyString,
    checkpoints: Type.Array(SessionCompactionCheckpointSchema),
  },
  { additionalProperties: false },
);

/** Result schema for fetching one compaction checkpoint. */
export const SessionsCompactionGetResultSchema = Type.Object(
  {
    ok: Type.Literal(true),
    key: NonEmptyString,
    checkpoint: SessionCompactionCheckpointSchema,
  },
  { additionalProperties: false },
);

/** Result schema for creating a new branch from a compaction checkpoint. */
export const SessionsCompactionBranchResultSchema = Type.Object(
  {
    ok: Type.Literal(true),
    sourceKey: NonEmptyString,
    key: NonEmptyString,
    sessionId: NonEmptyString,
    checkpoint: SessionCompactionCheckpointSchema,
    entry: Type.Object(
      {
        sessionId: NonEmptyString,
        updatedAt: Type.Integer({ minimum: 0 }),
      },
      { additionalProperties: true },
    ),
  },
  { additionalProperties: false },
);

/** Result schema for restoring a session from a compaction checkpoint. */
export const SessionsCompactionRestoreResultSchema = Type.Object(
  {
    ok: Type.Literal(true),
    key: NonEmptyString,
    sessionId: NonEmptyString,
    checkpoint: SessionCompactionCheckpointSchema,
    entry: Type.Object(
      {
        sessionId: NonEmptyString,
        updatedAt: Type.Integer({ minimum: 0 }),
      },
      { additionalProperties: true },
    ),
  },
  { additionalProperties: false },
);

/** Params schema for session token/cost usage reports. */
export const SessionsUsageParamsSchema = Type.Object(
  {
    /** Specific session key to analyze; if omitted returns sessions for the effective agent. */
    key: Type.Optional(NonEmptyString),
    /** Agent scope for list-style usage queries. */
    agentId: Type.Optional(NonEmptyString),
    /** Explicit all-agent scope for list-style usage queries. */
    agentScope: Type.Optional(Type.Literal("all")),
    /** Start date for range filter (YYYY-MM-DD). */
    startDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
    /** End date for range filter (YYYY-MM-DD). */
    endDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
    /** How start/end dates should be interpreted. Defaults to UTC when omitted. */
    mode: Type.Optional(
      Type.Union([Type.Literal("utc"), Type.Literal("gateway"), Type.Literal("specific")]),
    ),
    /** Preset range for usage queries when explicit start/end dates are omitted. */
    range: Type.Optional(
      Type.Union([
        Type.Literal("7d"),
        Type.Literal("30d"),
        Type.Literal("90d"),
        Type.Literal("1y"),
        Type.Literal("all"),
      ]),
    ),
    /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
    groupBy: Type.Optional(Type.Union([Type.Literal("instance"), Type.Literal("family")])),
    /** Backward-compatible alias for requesting family grouping. */
    includeHistorical: Type.Optional(Type.Boolean()),
    /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
    utcOffset: Type.Optional(Type.String({ pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$" })),
    /** Maximum sessions to return (default 50). */
    limit: Type.Optional(Type.Integer({ minimum: 1 })),
    /** Include context weight breakdown (systemPromptReport). */
    includeContextWeight: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);
