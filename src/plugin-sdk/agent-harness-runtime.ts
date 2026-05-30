// Lightweight runtime surface for plugin-owned agent harnesses.
// Keep heavyweight tool construction out of this module so harness imports can
// register quickly inside gateway startup and Docker e2e runs.

import type {
  CodexBundleMcpThreadConfig,
  LoadCodexBundleMcpThreadConfigParams,
} from "../agents/codex-mcp-config.types.js";
import type { EmbeddedRunAttemptResult } from "../agents/embedded-agent-runner/run/types.js";
import {
  abortEmbeddedAgentRun,
  clearActiveEmbeddedRun,
  queueEmbeddedAgentMessageWithOutcome,
  resolveActiveEmbeddedRunSessionId,
  setActiveEmbeddedRun,
  type EmbeddedAgentQueueMessageOptions,
} from "../agents/embedded-agent-runner/runs.js";
import type { SandboxFsBridge } from "../agents/sandbox/fs-bridge.js";
import { formatToolDetail, resolveToolDisplay } from "../agents/tool-display.js";
import type { ImageContent } from "../llm/types.js";
import { redactToolDetail } from "../logging/redact.js";
import type { PromptImageOrderEntry } from "../media/prompt-image-order.js";
import { truncateUtf16Safe } from "../utils.js";

/** Default max characters retained for user-facing tool progress output. */
export const TOOL_PROGRESS_OUTPUT_MAX_CHARS = 8_000;

/** Agent message type shared by harness adapters. */
export type { AgentMessage } from "../agents/runtime/index.js";
/** Public agent harness contracts implemented by plugin-owned runtimes. */
export type {
  AgentHarness,
  AgentHarnessAttemptParams,
  AgentHarnessAttemptResult,
  AgentHarnessCompactParams,
  AgentHarnessCompactResult,
  AgentHarnessDeliveryDefaults,
  AgentHarnessResultClassification,
  AgentHarnessSideQuestionParams,
  AgentHarnessSideQuestionResult,
  AgentHarnessResetParams,
  AgentHarnessSupport,
  AgentHarnessSupportContext,
} from "../agents/harness/types.js";
/** Embedded runner attempt parameter/result contracts reused by harness adapters. */
export type {
  EmbeddedRunAttemptParams,
  EmbeddedRunAttemptResult,
} from "../agents/embedded-agent-runner/run/types.js";
/** Context engine contracts available to plugin harnesses. */
export type {
  ContextEngine as HarnessContextEngine,
  ContextEngineHostCapability,
  ContextEngineOperation,
  ContextEngineProjection,
} from "../context-engine/types.js";
/** Embedded session compaction params, including legacy Pi alias. */
export type {
  CompactEmbeddedAgentSessionParams,
  /** @deprecated Use CompactEmbeddedAgentSessionParams. */
  CompactEmbeddedAgentSessionParams as CompactEmbeddedPiSessionParams,
} from "../agents/embedded-agent-runner/compact.js";
/** Embedded compaction result type, including legacy Pi alias. */
export type {
  EmbeddedAgentCompactResult,
  /** @deprecated Use EmbeddedAgentCompactResult. */
  EmbeddedAgentCompactResult as EmbeddedPiCompactResult,
} from "../agents/embedded-agent-runner/types.js";
/** Tool shape accepted by harness tool construction. */
export type { AnyAgentTool } from "../agents/tools/common.js";
/** Messaging tool send/payload contracts used by harnesses. */
export type {
  MessagingToolSend,
  MessagingToolSourceReplyPayload,
} from "../agents/embedded-agent-messaging.types.js";
/** Heartbeat tool response contract used by agent runtimes. */
export type { HeartbeatToolResponse } from "../auto-reply/heartbeat-tool-response.js";
/** Agent event payload types emitted by harness adapters. */
export type { AgentApprovalEventData, AgentEventPayload } from "../infra/agent-events.js";
/** Exec approval decision contract reused by tool approval flows. */
export type { ExecApprovalDecision } from "../infra/exec-approvals.js";
/** Normalized token usage type reported by harnesses. */
export type { NormalizedUsage } from "../agents/usage.js";
/** Tool result middleware contracts for agent harnesses. */
export type {
  AgentToolResultMiddleware,
  AgentToolResultMiddlewareContext,
  AgentToolResultMiddlewareEvent,
  AgentToolResultMiddlewareHarness,
  AgentToolResultMiddlewareOptions,
  AgentToolResultMiddlewareResult,
  AgentToolResultMiddlewareRuntime,
  OpenClawAgentToolResult,
} from "../plugins/agent-tool-result-middleware-types.js";
/** Codex app-server extension contracts for tool-result handling. */
export type {
  CodexAppServerExtensionContext,
  CodexAppServerExtensionFactory,
  CodexAppServerExtensionRuntime,
  CodexAppServerToolResultEvent,
  CodexAppServerToolResultHandlerResult,
} from "../plugins/codex-app-server-extension-types.js";
/** Native hook relay contracts for harness/tool integration. */
export type {
  NativeHookRelayEvent,
  NativeHookRelayProcessResponse,
  NativeHookRelayProvider,
  NativeHookRelayRegistrationHandle,
} from "../agents/harness/native-hook-relay.js";

/** OpenClaw version exposed to plugin harnesses. */
export { VERSION as OPENCLAW_VERSION } from "../version.js";
/** Error formatting helper used by harness adapters. */
export { formatErrorMessage } from "../infra/errors.js";
/** Approval display path formatter used by harness approval prompts. */
export { formatApprovalDisplayPath } from "../infra/approval-display-paths.js";
/** Build channel fields for agent hook context objects. */
export { buildAgentHookContextChannelFields } from "../plugins/hook-agent-context.js";
/** Agent event emit/subscribe/test-reset helpers. */
export { emitAgentEvent, onAgentEvent, resetAgentEventsForTest } from "../infra/agent-events.js";
/** Run bounded cleanup steps during harness shutdown. */
export { runAgentCleanupStep } from "../agents/run-cleanup-timeout.js";
/** Embedded-agent logger exposed under a harness-specific name. */
export { log as embeddedAgentLog } from "../agents/embedded-agent-runner/logger.js";
/** Build runtime plans for agent execution. */
export { buildAgentRuntimePlan } from "../agents/runtime-plan/build.js";
/** Classify embedded run results for model fallback, with legacy Pi alias. */
export {
  classifyEmbeddedAgentRunResultForModelFallback,
  /** @deprecated Use classifyEmbeddedAgentRunResultForModelFallback. */
  classifyEmbeddedAgentRunResultForModelFallback as classifyEmbeddedPiRunResultForModelFallback,
} from "../agents/embedded-agent-runner/result-fallback-classifier.js";
/** Resolve the embedded agent runtime id from inputs/config. */
export { resolveEmbeddedAgentRuntime } from "../agents/agent-runtime-id.js";
/** Resolve user-facing paths with home/workspace handling. */
export { resolveUserPath } from "../utils.js";
/** Invoke gateway tools from harness-owned tool flows. */
export { callGatewayTool } from "../agents/tools/gateway.js";
/** Node list item type used by node tool helpers. */
export type { NodeListNode } from "../agents/tools/nodes-utils.js";
/** Node listing and default-node selection helpers. */
export {
  listNodes,
  resolveNodeIdFromList,
  selectDefaultNodeFromList,
} from "../agents/tools/nodes-utils.js";
/** Format aggregate tool metadata for replies/progress. */
export { formatToolAggregate } from "../auto-reply/tool-meta.js";
/** Heartbeat response tool name and normalizer. */
export {
  HEARTBEAT_RESPONSE_TOOL_NAME,
  normalizeHeartbeatToolResponse,
} from "../auto-reply/heartbeat-tool-response.js";
/** Messaging tool type guards for harness routing. */
export { isMessagingTool, isMessagingToolSendAction } from "../agents/embedded-agent-messaging.js";
/** Media artifact extraction/filter helpers for tool results. */
export {
  extractToolResultMediaArtifact,
  filterToolResultMediaUrls,
} from "../agents/embedded-agent-subscribe.tools.js";
/** Normalize provider usage into OpenClaw usage fields. */
export { normalizeUsage } from "../agents/usage.js";
/** Resolve the OpenClaw agent directory through SDK compat rules. */
export { resolveOpenClawAgentDir } from "./agent-dir-compat.js";
/** Agent directory/scope resolution helpers. */
export {
  resolveAgentDir,
  resolveDefaultAgentDir,
  resolveSessionAgentIds,
} from "../agents/agent-scope.js";
/** Resolve model auth mode for a provider/model pair. */
export { resolveModelAuthMode } from "../agents/model-auth.js";
/** Check whether a model supports tool calls. */
export { supportsModelTools } from "../agents/model-tool-support.js";
/** Resolve whether an attempt should restrict filesystem access to workspace roots. */
export { resolveAttemptFsWorkspaceOnly } from "../agents/embedded-agent-runner/run/attempt.prompt-helpers.js";
/** Resolve spawned-attempt workspace directory. */
export { resolveAttemptSpawnWorkspaceDir } from "../agents/embedded-agent-runner/run/attempt.thread-helpers.js";
/** Build tool-run context for an embedded agent attempt. */
export { buildEmbeddedAttemptToolRunContext } from "../agents/embedded-agent-runner/run/attempt.tool-run-context.js";
/** Resolve and apply embedded-attempt tool construction plans. */
export {
  applyEmbeddedAttemptToolsAllow,
  resolveEmbeddedAttemptToolConstructionPlan,
} from "../agents/embedded-agent-runner/run/attempt-tool-construction-plan.js";
/** Read plugin metadata attached to registered tools. */
export { getPluginToolMeta } from "../plugins/tools.js";
/** Active embedded run controls exposed under harness-compatible names. */
export {
  abortEmbeddedAgentRun as abortAgentHarnessRun,
  clearActiveEmbeddedRun,
  resolveActiveEmbeddedRunSessionId,
  setActiveEmbeddedRun,
};

/**
 * @deprecated Active-run queueing is an internal runtime concern. This legacy
 * boolean API only reports immediate queue eligibility and cannot observe async
 * runtime rejection; runtime-owned delivery paths should use acceptance-aware
 * steering instead of public SDK queueing.
 */
export function queueAgentHarnessMessage(
  sessionId: string,
  text: string,
  options?: EmbeddedAgentQueueMessageOptions,
): boolean {
  return queueEmbeddedAgentMessageWithOutcome(sessionId, text, options).queued;
}
/** Dispose registered agent harnesses during tests/shutdown. */
export { disposeRegisteredAgentHarnesses } from "../agents/harness/registry.js";
/** Runtime tool normalization and diagnostics helpers. */
export {
  logAgentRuntimeToolDiagnostics,
  normalizeAgentRuntimeTools,
} from "../agents/runtime-plan/tools.js";
/** Runtime tool schema inspection/projection helpers and diagnostics. */
export {
  inspectRuntimeToolInputSchemas,
  projectRuntimeToolInputSchema,
  type RuntimeToolInputSchemaJson,
  type RuntimeToolInputSchemaProjection,
  type RuntimeToolSchemaDiagnostic,
} from "../agents/tool-schema-projection.js";
/** Codex bundle MCP thread config contracts. */
export type {
  CodexBundleMcpThreadConfig,
  LoadCodexBundleMcpThreadConfigParams,
} from "../agents/codex-mcp-config.types.js";
/** Normalize provider tool schemas for harness/runtime use. */
export { normalizeProviderToolSchemas } from "../agents/embedded-agent-runner/tool-schema-runtime.js";

/** Detect image references in a prompt and load them through the same limits as embedded runs. */
export async function detectAndLoadAgentHarnessPromptImages(params: {
  prompt: string;
  workspaceDir: string;
  model: { input?: string[] };
  existingImages?: ImageContent[];
  imageOrder?: PromptImageOrderEntry[];
  config?: import("../config/types.openclaw.js").OpenClawConfig;
  workspaceOnly?: boolean;
  localRoots?: readonly string[];
  sandbox?: { root: string; bridge: SandboxFsBridge };
}): Promise<{
  images: ImageContent[];
  detectedRefs: Array<{ raw: string; resolved: string; type: "path" | "media-uri" }>;
  loadedCount: number;
  skippedCount: number;
}> {
  const [{ resolveImageSanitizationLimits }, { detectAndLoadPromptImages }, { MAX_IMAGE_BYTES }] =
    await Promise.all([
      import("../agents/image-sanitization.js"),
      import("../agents/embedded-agent-runner/run/images.js"),
      import("../media/constants.js"),
    ]);

  return detectAndLoadPromptImages({
    prompt: params.prompt,
    workspaceDir: params.workspaceDir,
    model: params.model,
    existingImages: params.existingImages,
    imageOrder: params.imageOrder,
    maxBytes: MAX_IMAGE_BYTES,
    maxDimensionPx: resolveImageSanitizationLimits(params.config).maxDimensionPx,
    workspaceOnly: params.workspaceOnly,
    localRoots: params.localRoots,
    sandbox: params.sandbox,
  });
}

/** Lazy-load Codex bundle MCP thread config without importing the heavy runtime at module load. */
export async function loadCodexBundleMcpThreadConfig(
  params: LoadCodexBundleMcpThreadConfigParams,
): Promise<CodexBundleMcpThreadConfig> {
  const { loadCodexBundleMcpThreadConfig: load } = await import("../agents/codex-mcp-config.js");
  return load(params);
}
/** Resolve sandbox context for harness attempts. */
export { resolveSandboxContext } from "../agents/sandbox.js";
/** Sandbox context/workspace-access types. */
export type { SandboxContext, SandboxWorkspaceAccess } from "../agents/sandbox.js";
/** Sandbox bind-root inspection helpers. */
export {
  hasSandboxBindContainerPathAliases,
  hasSandboxBindReadonlyHostShadows,
  resolveWritableSandboxBindHostRoots,
} from "../agents/sandbox/fs-paths.js";
/** Bootstrap file context helpers for harness runs. */
export {
  buildBootstrapContextForFiles,
  resolveBootstrapContextForRun,
  resolveBootstrapFilesForRun,
} from "../agents/bootstrap-files.js";
/** Embedded context-file type used by bootstrap/context helpers. */
export type { EmbeddedContextFile } from "../agents/embedded-agent-helpers/types.js";
/** Check whether a session key belongs to a subagent. */
export { isSubagentSessionKey } from "../routing/session-key.js";
/** Session transcript write-lock helpers. */
export {
  acquireSessionWriteLock,
  resolveSessionWriteLockAcquireTimeoutMs,
  resolveSessionWriteLockOptions,
  type SessionWriteLockAcquireTimeoutConfig,
} from "../agents/session-write-lock.js";
/** Append a message to a session transcript. */
export { appendSessionTranscriptMessage } from "../config/sessions/transcript-append.js";
/** Emit transcript update notifications after harness writes. */
export { emitSessionTranscriptUpdate } from "../sessions/transcript-events.js";
/** Before-tool-call policy hooks, wrappers, diagnostics, and deferred approval helpers. */
export {
  getBeforeToolCallPolicyDiagnosticState,
  hasBeforeToolCallPolicy,
  isToolWrappedWithBeforeToolCallHook,
  requestDeferredPluginToolApproval,
  runBeforeToolCallHook,
  setBeforeToolCallDiagnosticsEnabled,
  wrapToolWithBeforeToolCallHook,
  type BeforeToolCallPolicyDiagnosticState,
  type DeferredPluginToolApproval,
} from "../agents/agent-tools.before-tool-call.js";
/** Prompt/compaction hook helpers used by agent harness adapters. */
export {
  resolveAgentHarnessBeforePromptBuildResult,
  runAgentHarnessAfterCompactionHook,
  runAgentHarnessBeforeCompactionHook,
} from "../agents/harness/prompt-compaction-hook-helpers.js";
/** Create Codex app-server tool result extension runner. */
export { createCodexAppServerToolResultExtensionRunner } from "../agents/harness/codex-app-server-extensions.js";
/** Create tool result middleware runner for agent harnesses. */
export { createAgentToolResultMiddlewareRunner } from "../agents/harness/tool-result-middleware.js";
/** Context engine host compatibility helpers. */
export {
  assertContextEngineHostSupport,
  CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
} from "../context-engine/host-compat.js";
/** Context engine lifecycle helpers used by harness adapters. */
export {
  assembleHarnessContextEngine,
  bootstrapHarnessContextEngine,
  buildHarnessContextEngineRuntimeContext,
  buildHarnessContextEngineRuntimeContextFromUsage,
  finalizeHarnessContextEngineTurn,
  isActiveHarnessContextEngine,
  runHarnessContextEngineMaintenance,
} from "../agents/harness/context-engine-lifecycle.js";
// Plugin-owned (`ownsCompaction`) compaction safety timeout. Exposed on the
// agent-harness-runtime surface so plugin harnesses such as Codex bound their
// own `ContextEngine.compact()` calls with the exact same finite, host-resolved
// timeout the built-in embedded-agent runner uses — one shared implementation, no
// copy-pasted watchdog.
/** Compaction timeout helpers shared by plugin-owned harness compaction. */
export {
  compactContextEngineWithSafetyTimeout,
  resolveCompactionTimeoutMs,
} from "../agents/embedded-agent-runner/compaction-safety-timeout.js";
/** Preemptive compaction pressure estimation and logging helpers. */
export {
  estimateRenderedLlmBoundaryTokenPressure,
  formatPrePromptPrecheckLog,
  PREEMPTIVE_OVERFLOW_ERROR_TEXT,
  shouldPreemptivelyCompactBeforePrompt,
  type LlmBoundaryTokenPressure,
  type PreemptiveCompactionDecision,
} from "../agents/embedded-agent-runner/run/preemptive-compaction.js";
/** Resolve the plugin id that owns a context engine. */
export { resolveContextEngineOwnerPluginId } from "../context-engine/registry.js";
/** Tool/message hook helpers used around harness tool execution. */
export {
  runAgentHarnessAfterToolCallHook,
  runAgentHarnessBeforeMessageWriteHook,
} from "../agents/harness/hook-helpers.js";
/** Agent harness lifecycle hook helpers. */
export {
  awaitAgentHarnessAgentEndHook,
  getAgentHarnessHookRunner,
  runAgentHarnessBeforeAgentFinalizeHook,
  runAgentHarnessAgentEndHook,
  runAgentHarnessLlmInputHook,
  runAgentHarnessLlmOutputHook,
} from "../agents/harness/lifecycle-hook-helpers.js";
/** Native hook relay registration, invocation, and testing helpers. */
export {
  buildNativeHookRelayCommand,
  hasNativeHookRelayInvocation,
  invokeNativeHookRelay,
  resolveNativeHookRelayDeferredToolApproval,
  testing as nativeHookRelayTesting,
  registerNativeHookRelay,
} from "../agents/harness/native-hook-relay.js";

/**
 * Derive the same compact user-facing tool detail that embedded OpenClaw uses for progress logs.
 */
export type ToolProgressDetailMode = "explain" | "raw";

/** Infer compact, redacted tool metadata from a tool name and raw args. */
export function inferToolMetaFromArgs(
  toolName: string,
  args: unknown,
  options?: { detailMode?: ToolProgressDetailMode },
): string | undefined {
  const display = resolveToolDisplay({ name: toolName, args, detailMode: options?.detailMode });
  return formatToolDetail(display);
}

/**
 * Prepare verbose tool output for user-facing progress messages.
 */
export function formatToolProgressOutput(
  output: string,
  options?: { maxChars?: number },
): string | undefined {
  const trimmed = output.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!trimmed) {
    return undefined;
  }
  const redacted = redactToolDetail(trimmed);
  const maxChars = options?.maxChars ?? TOOL_PROGRESS_OUTPUT_MAX_CHARS;
  if (redacted.length <= maxChars) {
    return redacted;
  }
  return `${truncateUtf16Safe(redacted, maxChars)}\n...(truncated)...`;
}

/** Terminal turn facts used to classify harness fallback eligibility. */
export type AgentHarnessTerminalOutcomeInput = {
  assistantTexts: readonly string[];
  reasoningText?: string | null;
  planText?: string | null;
  promptError?: unknown;
  turnCompleted: boolean;
};

/** Classification emitted for empty/reasoning-only/planning-only harness turns. */
export type AgentHarnessTerminalOutcomeClassification = NonNullable<
  EmbeddedRunAttemptResult["agentHarnessResultClassification"]
>;

/**
 * Classify terminal harness turns that completed without assistant output that
 * should advance fallback. Deliberate silent replies such as NO_REPLY count as
 * intentional output, while whitespace-only text remains fallback-eligible.
 * This is intentionally SDK-level so plugin harness adapters such as Codex
 * preserve the same OpenClaw-owned fallback signals as the built-in OpenClaw path
 * without re-implementing terminal-result policy.
 */
export function classifyAgentHarnessTerminalOutcome(
  params: AgentHarnessTerminalOutcomeInput,
): AgentHarnessTerminalOutcomeClassification | undefined {
  if (
    !params.turnCompleted ||
    (params.promptError !== undefined && params.promptError !== null) ||
    hasVisibleAssistantText(params.assistantTexts)
  ) {
    return undefined;
  }
  if (params.planText?.trim()) {
    return "planning-only";
  }
  if (params.reasoningText?.trim()) {
    return "reasoning-only";
  }
  return "empty";
}

function hasVisibleAssistantText(assistantTexts: readonly string[]): boolean {
  return assistantTexts.some((text) => text.trim().length > 0);
}
