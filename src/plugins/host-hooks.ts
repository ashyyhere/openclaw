// Plugin host hook contracts for session state, tool policy, UI actions, and events.
import type { OperatorScope } from "../gateway/operator-scopes.js";
import type { AgentEventPayload, AgentEventStream } from "../infra/agent-events.js";
import type {
  PluginHookAgentContext,
  PluginHookBeforeToolCallEvent,
  PluginHookBeforeToolCallResult,
  PluginHookToolContext,
} from "./hook-types.js";
import type { PluginJsonValue } from "./host-hook-json.js";
import type {
  PluginAgentTurnPrepareResult,
  PluginNextTurnInjectionPlacement,
  PluginNextTurnInjectionRecord,
} from "./host-hook-turn-types.js";

/** JSON value validator shared by host hook payloads. */
export { isPluginJsonValue } from "./host-hook-json.js";
/** JSON value types accepted by host hook payloads and plugin state. */
export type { PluginJsonPrimitive, PluginJsonValue } from "./host-hook-json.js";
/** Agent-turn preparation, heartbeat, and next-turn injection hook contracts. */
export type {
  PluginAgentTurnPrepareEvent,
  PluginAgentTurnPrepareResult,
  PluginHeartbeatPromptContributionEvent,
  PluginHeartbeatPromptContributionResult,
  PluginNextTurnInjection,
  PluginNextTurnInjectionEnqueueResult,
  PluginNextTurnInjectionPlacement,
  PluginNextTurnInjectionRecord,
} from "./host-hook-turn-types.js";

/** Reason supplied when the host asks plugin-owned resources to clean up. */
export type PluginHostCleanupReason = "disable" | "reset" | "delete" | "restart";

/** Context passed when projecting plugin session extension state. */
export type PluginSessionExtensionProjectionContext = {
  sessionKey: string;
  sessionId?: string;
  state: PluginJsonValue | undefined;
};

/** Registration for plugin-owned session extension state and optional mirrors. */
export type PluginSessionExtensionRegistration = {
  namespace: string;
  description: string;
  project?: (ctx: PluginSessionExtensionProjectionContext) => PluginJsonValue | undefined;
  cleanup?: (ctx: { reason: PluginHostCleanupReason; sessionKey?: string }) => void | Promise<void>;
  /**
   * When set, after every successful `patchSessionExtension` the projected
   * value is mirrored to `SessionEntry[<slotKey>]` so non-plugin readers
   * can consume the typed slot without reaching into
   * `pluginExtensions[pluginId][namespace]`.
   *
   * The slot is a read-only mirror: writes always go through
   * `patchSessionExtension`; the host overwrites the slot value on every
   * subsequent patch.
   */
  sessionEntrySlotKey?: string;
  /**
   * Optional JSON-compatible schema describing the projected slot value.
   * Purely informational at this layer; clients may use it to validate the
   * mirrored slot against a contract.
   */
  sessionEntrySlotSchema?: PluginJsonValue;
};

/** Projected plugin session extension value ready for host exposure. */
export type PluginSessionExtensionProjection = {
  pluginId: string;
  namespace: string;
  value: PluginJsonValue;
};

/** Patch request for one plugin-owned session extension namespace. */
export type PluginSessionExtensionPatchParams = {
  key: string;
  pluginId: string;
  namespace: string;
  value?: PluginJsonValue;
  unset?: boolean;
};

/** Decision returned by plugin trusted-tool policy evaluators. */
export type PluginToolPolicyDecision =
  | PluginHookBeforeToolCallResult
  | {
      allow?: boolean;
      reason?: string;
    };

/** Registration for a plugin policy that can allow or deny trusted tool calls. */
export type PluginTrustedToolPolicyRegistration = {
  id: string;
  description: string;
  evaluate: (
    event: PluginHookBeforeToolCallEvent,
    ctx: PluginHookToolContext,
  ) => PluginToolPolicyDecision | void | Promise<PluginToolPolicyDecision | void>;
};

/** Plugin-provided metadata for host-visible tools. */
export type PluginToolMetadataRegistration = {
  toolName: string;
  displayName?: string;
  description?: string;
  risk?: "low" | "medium" | "high";
  tags?: string[];
};

/** Result shape for plugin commands that may continue the agent run. */
export type PluginCommandContinuation = {
  continueAgent?: boolean;
};

/** Descriptor for a plugin-provided Control UI surface. */
export type PluginControlUiDescriptor = {
  id: string;
  surface: "session" | "tool" | "run" | "settings";
  label: string;
  description?: string;
  placement?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[];
};

/** Context passed to plugin session action handlers. */
export type PluginSessionActionContext = {
  pluginId: string;
  actionId: string;
  sessionKey?: string;
  payload?: PluginJsonValue;
  client?: {
    connId?: string;
    scopes: string[];
  };
};

/** Success or failure result returned by plugin session actions. */
export type PluginSessionActionResult =
  | {
      ok?: true;
      result?: PluginJsonValue;
      reply?: PluginJsonValue;
      continueAgent?: boolean;
    }
  | {
      ok: false;
      error: string;
      code?: string;
      details?: PluginJsonValue;
    };

/** Registration for a plugin action callable from a session UI/control surface. */
export type PluginSessionActionRegistration = {
  id: string;
  description?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[];
  handler: (
    ctx: PluginSessionActionContext,
  ) => PluginSessionActionResult | void | Promise<PluginSessionActionResult | void>;
};

/** Registration for plugin runtime cleanup hooks. */
export type PluginRuntimeLifecycleRegistration = {
  id: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey?: string;
    runId?: string;
  }) => void | Promise<void>;
};

/** Registration for plugin subscriptions to host agent event streams. */
export type PluginAgentEventSubscriptionRegistration = {
  id: string;
  description?: string;
  streams?: AgentEventStream[];
  handle: (
    event: AgentEventPayload,
    ctx: {
      // oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- Run-context JSON reads are caller-typed by namespace.
      getRunContext: <T extends PluginJsonValue = PluginJsonValue>(
        namespace: string,
      ) => T | undefined;
      setRunContext: (namespace: string, value: PluginJsonValue) => void;
      clearRunContext: (namespace?: string) => void;
    },
  ) => void | Promise<void>;
};

/** Parameters for emitting a plugin-owned agent event. */
export type PluginAgentEventEmitParams = {
  runId: string;
  stream: AgentEventStream;
  data: PluginJsonValue;
  sessionKey?: string;
};

/** Result of emitting a plugin-owned agent event. */
export type PluginAgentEventEmitResult =
  | { emitted: true; stream: AgentEventStream }
  | { emitted: false; reason: string };

/** Patch request for plugin run-scoped JSON context. */
export type PluginRunContextPatch = {
  runId: string;
  namespace: string;
  value?: PluginJsonValue;
  unset?: boolean;
};

/** Lookup request for plugin run-scoped JSON context. */
export type PluginRunContextGetParams = {
  runId: string;
  namespace: string;
};

/** Registration for plugin-owned scheduled work tied to a session. */
export type PluginSessionSchedulerJobRegistration = {
  id: string;
  sessionKey: string;
  kind: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey: string;
    jobId: string;
  }) => void | Promise<void>;
};

/** Stable handle returned for a plugin-owned scheduled session job. */
export type PluginSessionSchedulerJobHandle = {
  id: string;
  pluginId: string;
  sessionKey: string;
  kind: string;
};

/** File path supplied for plugin-initiated session attachment delivery. */
export type PluginSessionAttachmentFile = {
  path: string;
};

/** Channel-specific delivery hints for plugin session attachments. */
export type PluginAttachmentChannelHints = {
  telegram?: {
    parseMode?: "HTML";
    disableNotification?: boolean;
    /**
     * Require host-side detection to match this MIME before forcing document delivery.
     * Mismatched files are rejected before the outbound adapter is called.
     */
    forceDocumentMime?: string;
  };
  slack?: {
    threadTs?: string;
  };
};

/** Caption format requested for plugin session attachment text. */
export type PluginSessionAttachmentCaptionFormat = "plain" | "html" | "markdown";

/** Parameters for delivering plugin-provided files into a session channel. */
export type PluginSessionAttachmentParams = {
  sessionKey: string;
  files: PluginSessionAttachmentFile[];
  text?: string;
  threadId?: string | number;
  forceDocument?: boolean;
  maxBytes?: number;
  captionFormat?: PluginSessionAttachmentCaptionFormat;
  channelHints?: PluginAttachmentChannelHints;
};

/** Result of plugin-initiated session attachment delivery. */
export type PluginSessionAttachmentResult =
  | {
      ok: true;
      channel: string;
      deliveredTo: string;
      count: number;
    }
  | { ok: false; error: string };

/** Absolute, relative, or cron schedule for a plugin-created session turn. */
export type PluginSessionTurnSchedule =
  | { at: string | number | Date }
  | { delayMs: number }
  | { cron: string; tz?: string };

type PluginSessionTurnScheduleCommonParams = {
  sessionKey: string;
  message: string;
  agentId?: string;
  deliveryMode?: "none" | "announce";
  name?: string;
  /** Optional cleanup tag. Reserved cron-name delimiters like `:` are rejected. */
  tag?: string;
};

/** Parameters for scheduling a plugin-created session turn. */
export type PluginSessionTurnScheduleParams =
  | ({
      at: string | number | Date;
      deleteAfterRun?: boolean;
    } & PluginSessionTurnScheduleCommonParams)
  | ({
      delayMs: number;
      deleteAfterRun?: boolean;
    } & PluginSessionTurnScheduleCommonParams)
  | ({
      cron: string;
      tz?: string;
      deleteAfterRun?: false;
    } & PluginSessionTurnScheduleCommonParams);

/** Parameters for unscheduling plugin-created session turns by cleanup tag. */
export type PluginSessionTurnUnscheduleByTagParams = {
  sessionKey: string;
  tag: string;
};

/** Count result from unscheduling plugin-created session turns by tag. */
export type PluginSessionTurnUnscheduleByTagResult = {
  removed: number;
  failed: number;
};

/** Normalizes host hook registration ids before storage or comparison. */
export function normalizePluginHostHookId(value: string | undefined): string {
  return (value ?? "").trim();
}

function normalizeQueuedInjectionText(
  entry: PluginNextTurnInjectionRecord,
  placement: PluginNextTurnInjectionPlacement,
): string | undefined {
  const candidate = entry as {
    placement?: unknown;
    text?: unknown;
  };
  if (candidate.placement !== placement || typeof candidate.text !== "string") {
    return undefined;
  }
  const text = candidate.text.trim();
  return text || undefined;
}

/** Builds agent-turn context text from queued plugin next-turn injections. */
export function buildPluginAgentTurnPrepareContext(params: {
  queuedInjections: PluginNextTurnInjectionRecord[];
}): PluginAgentTurnPrepareResult {
  const prepend = params.queuedInjections
    .map((entry) => normalizeQueuedInjectionText(entry, "prepend_context"))
    .filter(Boolean);
  const append = params.queuedInjections
    .map((entry) => normalizeQueuedInjectionText(entry, "append_context"))
    .filter(Boolean);
  return {
    ...(prepend.length > 0 ? { prependContext: prepend.join("\n\n") } : {}),
    ...(append.length > 0 ? { appendContext: append.join("\n\n") } : {}),
  };
}

/** Agent run context shape passed through plugin host hooks. */
export type PluginHostHookRunContext = PluginHookAgentContext;
