// plugins host hooks helpers and runtime behavior.
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

/** Re-exported API for src/plugins, starting with is Plugin Json Value. */
export { isPluginJsonValue } from "./host-hook-json.js";
/** Re-exported API for src/plugins, starting with Plugin Json Primitive. */
export type { PluginJsonPrimitive, PluginJsonValue } from "./host-hook-json.js";
/** Re-exported API for src/plugins. */
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

/** Shared type for Plugin Host Cleanup Reason in src/plugins. */
export type PluginHostCleanupReason = "disable" | "reset" | "delete" | "restart";

/** Shared type for Plugin Session Extension Projection Context in src/plugins. */
export type PluginSessionExtensionProjectionContext = {
  sessionKey: string;
  sessionId?: string;
  state: PluginJsonValue | undefined;
};

/** Shared type for Plugin Session Extension Registration in src/plugins. */
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

/** Shared type for Plugin Session Extension Projection in src/plugins. */
export type PluginSessionExtensionProjection = {
  pluginId: string;
  namespace: string;
  value: PluginJsonValue;
};

/** Shared type for Plugin Session Extension Patch Params in src/plugins. */
export type PluginSessionExtensionPatchParams = {
  key: string;
  pluginId: string;
  namespace: string;
  value?: PluginJsonValue;
  unset?: boolean;
};

/** Shared type for Plugin Tool Policy Decision in src/plugins. */
export type PluginToolPolicyDecision =
  | PluginHookBeforeToolCallResult
  | {
      allow?: boolean;
      reason?: string;
    };

/** Shared type for Plugin Trusted Tool Policy Registration in src/plugins. */
export type PluginTrustedToolPolicyRegistration = {
  id: string;
  description: string;
  evaluate: (
    event: PluginHookBeforeToolCallEvent,
    ctx: PluginHookToolContext,
  ) => PluginToolPolicyDecision | void | Promise<PluginToolPolicyDecision | void>;
};

/** Shared type for Plugin Tool Metadata Registration in src/plugins. */
export type PluginToolMetadataRegistration = {
  toolName: string;
  displayName?: string;
  description?: string;
  risk?: "low" | "medium" | "high";
  tags?: string[];
};

/** Shared type for Plugin Command Continuation in src/plugins. */
export type PluginCommandContinuation = {
  continueAgent?: boolean;
};

/** Shared type for Plugin Control Ui Descriptor in src/plugins. */
export type PluginControlUiDescriptor = {
  id: string;
  surface: "session" | "tool" | "run" | "settings";
  label: string;
  description?: string;
  placement?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[];
};

/** Shared type for Plugin Session Action Context in src/plugins. */
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

/** Shared type for Plugin Session Action Result in src/plugins. */
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

/** Shared type for Plugin Session Action Registration in src/plugins. */
export type PluginSessionActionRegistration = {
  id: string;
  description?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[];
  handler: (
    ctx: PluginSessionActionContext,
  ) => PluginSessionActionResult | void | Promise<PluginSessionActionResult | void>;
};

/** Shared type for Plugin Runtime Lifecycle Registration in src/plugins. */
export type PluginRuntimeLifecycleRegistration = {
  id: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey?: string;
    runId?: string;
  }) => void | Promise<void>;
};

/** Shared type for Plugin Agent Event Subscription Registration in src/plugins. */
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

/** Shared type for Plugin Agent Event Emit Params in src/plugins. */
export type PluginAgentEventEmitParams = {
  runId: string;
  stream: AgentEventStream;
  data: PluginJsonValue;
  sessionKey?: string;
};

/** Shared type for Plugin Agent Event Emit Result in src/plugins. */
export type PluginAgentEventEmitResult =
  | { emitted: true; stream: AgentEventStream }
  | { emitted: false; reason: string };

/** Shared type for Plugin Run Context Patch in src/plugins. */
export type PluginRunContextPatch = {
  runId: string;
  namespace: string;
  value?: PluginJsonValue;
  unset?: boolean;
};

/** Shared type for Plugin Run Context Get Params in src/plugins. */
export type PluginRunContextGetParams = {
  runId: string;
  namespace: string;
};

/** Shared type for Plugin Session Scheduler Job Registration in src/plugins. */
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

/** Shared type for Plugin Session Scheduler Job Handle in src/plugins. */
export type PluginSessionSchedulerJobHandle = {
  id: string;
  pluginId: string;
  sessionKey: string;
  kind: string;
};

/** Shared type for Plugin Session Attachment File in src/plugins. */
export type PluginSessionAttachmentFile = {
  path: string;
};

/** Shared type for Plugin Attachment Channel Hints in src/plugins. */
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

/** Shared type for Plugin Session Attachment Caption Format in src/plugins. */
export type PluginSessionAttachmentCaptionFormat = "plain" | "html" | "markdown";

/** Shared type for Plugin Session Attachment Params in src/plugins. */
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

/** Shared type for Plugin Session Attachment Result in src/plugins. */
export type PluginSessionAttachmentResult =
  | {
      ok: true;
      channel: string;
      deliveredTo: string;
      count: number;
    }
  | { ok: false; error: string };

/** Shared type for Plugin Session Turn Schedule in src/plugins. */
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

/** Shared type for Plugin Session Turn Schedule Params in src/plugins. */
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

/** Shared type for Plugin Session Turn Unschedule By Tag Params in src/plugins. */
export type PluginSessionTurnUnscheduleByTagParams = {
  sessionKey: string;
  tag: string;
};

/** Shared type for Plugin Session Turn Unschedule By Tag Result in src/plugins. */
export type PluginSessionTurnUnscheduleByTagResult = {
  removed: number;
  failed: number;
};

/** Reused helper for normalize Plugin Host Hook Id behavior in src/plugins. */
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

/** Reused helper for build Plugin Agent Turn Prepare Context behavior in src/plugins. */
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

/** Shared type for Plugin Host Hook Run Context in src/plugins. */
export type PluginHostHookRunContext = PluginHookAgentContext;
