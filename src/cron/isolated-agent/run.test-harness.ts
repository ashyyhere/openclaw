// Test harness for isolated-agent cron turn execution.
import { vi, type Mock } from "vitest";
import { resolveFastModeState as resolveFastModeStateImpl } from "../../agents/fast-mode.js";
import { LiveSessionModelSwitchError } from "../../agents/live-model-switch-error.js";
import { resolveAgentModelFallbackValues } from "../../config/model-input.js";
import { normalizeOptionalString } from "../../shared/string-coerce.js";

type CronSessionEntry = {
  sessionId: string;
  updatedAt: number;
  systemSent: boolean;
  skillsSnapshot: unknown;
  model?: string;
  modelProvider?: string;
  [key: string]: unknown;
};

type CronSession = {
  storePath: string;
  store: Record<string, unknown>;
  sessionEntry: CronSessionEntry;
  systemSent: boolean;
  isNewSession: boolean;
  [key: string]: unknown;
};

function createMock(): Mock {
  return vi.fn();
}

function normalizeModelSelectionForTest(value: unknown): string | undefined {
  const direct = normalizeOptionalString(value);
  if (direct) {
    return direct;
  }
  if (!value || typeof value !== "object") {
    return undefined;
  }
  return normalizeOptionalString((value as { primary?: unknown }).primary);
}

/** Mock workspace skill snapshot builder used by cron prompt setup. */
export const buildWorkspaceSkillSnapshotMock = createMock();
/** Mock agent config resolver. */
export const resolveAgentConfigMock = createMock();
/** Mock effective model fallback resolver. */
export const resolveEffectiveModelFallbacksMock = createMock();
/** Mock subagent model fallback override resolver. */
export const resolveSubagentModelFallbacksOverrideMock = createMock();
/** Mock agent model fallback override resolver. */
export const resolveAgentModelFallbacksOverrideMock = createMock();
/** Mock agent skill filter resolver. */
export const resolveAgentSkillsFilterMock = createMock();
/** Mock model-reference status lookup. */
export const getModelRefStatusMock = createMock();
/** Mock CLI-provider classifier. */
export const isCliProviderMock = createMock();
/** Mock CLI runtime execution provider resolver. */
export const resolveCliRuntimeExecutionProviderMock = createMock();
/** Mock allowed model ref resolver. */
export const resolveAllowedModelRefMock = createMock();
/** Mock configured model ref resolver. */
export const resolveConfiguredModelRefMock = createMock();
/** Mock hook-provided Gmail model resolver. */
export const resolveHooksGmailModelMock = createMock();
/** Mock default thinking-level resolver. */
export const resolveThinkingDefaultMock = createMock();
/** Mock model-fallback execution wrapper. */
export const runWithModelFallbackMock = createMock();
/** Mock embedded-agent execution path. */
export const runEmbeddedAgentMock = createMock();
/** Mock CLI-agent execution path. */
export const runCliAgentMock = createMock();
/** Mock context-token lookup for session history. */
export const lookupContextTokensMock = createMock();
/** Mock CLI session id lookup. */
export const getCliSessionIdMock = createMock();
export const clearCliSessionMock = createMock();
export const updateSessionStoreMock = createMock();
/** Mock cron session resolver. */
export const resolveCronSessionMock = createMock();
/** Mock warning logger. */
export const logWarnMock = createMock();
/** Mock active descendant-run counter. */
export const countActiveDescendantRunsMock = createMock();
/** Mock descendant-run lister for requester-scoped checks. */
export const listDescendantRunsForRequesterMock = createMock();
/** Mock output text extractor from agent payloads. */
export const pickLastNonEmptyTextFromPayloadsMock = createMock();
/** Mock cron payload outcome resolver. */
export const resolveCronPayloadOutcomeMock = createMock();
/** Mock cron delivery plan resolver. */
export const resolveCronDeliveryPlanMock = createMock();
/** Mock delivery target resolver. */
export const resolveDeliveryTargetMock = createMock();
/** Mock cron delivery dispatcher. */
export const dispatchCronDeliveryMock = createMock();
/** Mock cleanup for direct cron sessions. */
export const cleanupDirectCronSessionMock = createMock();
/** Mock provider preflight check for cron model runs. */
export const preflightCronModelProviderMock = createMock();
/** Mock heartbeat-only response detector. */
export const isHeartbeatOnlyResponseMock = createMock();
/** Mock heartbeat acknowledgement length resolver. */
export const resolveHeartbeatAckMaxCharsMock = createMock();
/** Mock session auth-profile override resolver. */
export const resolveSessionAuthProfileOverrideMock = createMock();
/** Mock fast-mode state resolver. */
export const resolveFastModeStateMock = createMock();
/** Mock channel plugin lookup for delivery routing. */
export const getChannelPluginMock = createMock();
/** Mock MCP runtime retirement for cron sessions. */
export const retireSessionMcpRuntimeMock = createMock();
/** Mock runtime plugin loader. */
export const ensureRuntimePluginsLoadedMock = createMock();

const resolveBootstrapWarningSignaturesSeenMock = createMock();
const resolveCronStyleNowMock = createMock();
/** Mock cron agent lane resolver. */
export const resolveCronAgentLaneMock = createMock();
const resolveAgentTimeoutMsMock = createMock();
const deriveSessionTotalTokensMock = createMock();
const hasNonzeroUsageMock = createMock();
const ensureAgentWorkspaceMock = createMock();
const normalizeThinkLevelMock = createMock();
const normalizeVerboseLevelMock = createMock();
/** Mock thinking-level support checker. */
export const isThinkingLevelSupportedMock = createMock();
/** Mock supported thinking-level resolver. */
export const resolveSupportedThinkingLevelMock = createMock();
const supportsXHighThinkingMock = createMock();
const resolveSessionTranscriptPathMock = createMock();
const setSessionRuntimeModelMock = createMock();
const registerAgentRunContextMock = createMock();
const buildSafeExternalPromptMock = createMock();
const detectSuspiciousPatternsMock = createMock();
const mapHookExternalContentSourceMock = createMock();
const isExternalHookSessionMock = createMock();
const resolveHookExternalContentSourceMock = createMock();
const getSkillsSnapshotVersionMock = createMock();
/** Mock model catalog loader. */
export const loadModelCatalogMock = createMock();
const getRemoteSkillEligibilityMock = createMock();

vi.mock("./run.runtime.js", () => ({
  resolveAgentConfig: resolveAgentConfigMock,
  resolveAgentDir: vi.fn().mockReturnValue("/tmp/agent-dir"),
  resolveAgentModelFallbacksOverride: resolveAgentModelFallbacksOverrideMock,
  resolveAgentWorkspaceDir: vi.fn().mockReturnValue("/tmp/workspace"),
  resolveDefaultAgentId: vi.fn().mockReturnValue("default"),
  resolveCronStyleNow: resolveCronStyleNowMock,
  DEFAULT_CONTEXT_TOKENS: 128000,
  isCliProvider: isCliProviderMock,
  resolveThinkingDefault: resolveThinkingDefaultMock,
  buildWorkspaceSkillSnapshot: buildWorkspaceSkillSnapshotMock,
  getSkillsSnapshotVersion: getSkillsSnapshotVersionMock,
  resolveAgentTimeoutMs: resolveAgentTimeoutMsMock,
  deriveSessionTotalTokens: deriveSessionTotalTokensMock,
  hasNonzeroUsage: hasNonzeroUsageMock,
  DEFAULT_IDENTITY_FILENAME: "IDENTITY.md",
  ensureAgentWorkspace: ensureAgentWorkspaceMock,
  normalizeThinkLevel: normalizeThinkLevelMock,
  isThinkingLevelSupported: isThinkingLevelSupportedMock,
  resolveSupportedThinkingLevel: resolveSupportedThinkingLevelMock,
  supportsXHighThinking: supportsXHighThinkingMock,
  resolveSessionTranscriptPath: resolveSessionTranscriptPathMock,
  setSessionRuntimeModel: setSessionRuntimeModelMock,
  setCliSessionId: vi.fn(),
  logWarn: (...args: unknown[]) => logWarnMock(...args),
  normalizeAgentId: vi.fn((id: string) => id),
  mapHookExternalContentSource: mapHookExternalContentSourceMock,
  isExternalHookSession: isExternalHookSessionMock,
  resolveHookExternalContentSource: resolveHookExternalContentSourceMock,
  getRemoteSkillEligibility: getRemoteSkillEligibilityMock,
}));

vi.mock("../../agents/model-runtime-aliases.js", async () => ({
  ...(await vi.importActual<typeof import("../../agents/model-runtime-aliases.js")>(
    "../../agents/model-runtime-aliases.js",
  )),
  resolveCliRuntimeExecutionProvider: resolveCliRuntimeExecutionProviderMock,
}));

vi.mock("./run-external-content.runtime.js", () => ({
  buildSafeExternalPrompt: buildSafeExternalPromptMock,
  detectSuspiciousPatterns: detectSuspiciousPatternsMock,
}));

vi.mock("./run-context.runtime.js", () => ({
  lookupContextTokens: lookupContextTokensMock,
}));

vi.mock("./run-model-catalog.runtime.js", () => ({
  loadModelCatalog: loadModelCatalogMock,
}));

vi.mock("../../plugins/runtime-plugins.runtime.js", () => ({
  ensureRuntimePluginsLoaded: ensureRuntimePluginsLoadedMock,
}));

vi.mock("../../skills/runtime/cron-snapshot.runtime.js", () => ({
  canExecRequestNode: vi.fn(() => false),
  getRemoteSkillEligibility: getRemoteSkillEligibilityMock,
  resolveEffectiveAgentSkillFilter: resolveAgentSkillsFilterMock,
  resolveReusableWorkspaceSkillSnapshot: (params: {
    workspaceDir: string;
    config?: unknown;
    agentId?: string;
    existingSnapshot?: { version?: number; skillFilter?: string[] };
    skillFilter?: string[];
    eligibility?: unknown;
  }) => {
    const normalize = (skillFilter?: string[]) =>
      Array.from(new Set(skillFilter?.map((entry) => entry.trim()).filter(Boolean))).toSorted();
    const sameFilter =
      JSON.stringify(normalize(params.existingSnapshot?.skillFilter)) ===
      JSON.stringify(normalize(params.skillFilter));
    const snapshotVersion = getSkillsSnapshotVersionMock(params.workspaceDir);
    const shouldRefresh =
      !params.existingSnapshot ||
      params.existingSnapshot.version !== snapshotVersion ||
      !sameFilter;
    return {
      snapshot: shouldRefresh
        ? buildWorkspaceSkillSnapshotMock(params.workspaceDir, {
            config: params.config,
            agentId: params.agentId,
            skillFilter: params.skillFilter,
            eligibility: params.eligibility,
            snapshotVersion,
          })
        : params.existingSnapshot,
      shouldRefresh,
      snapshotVersion,
    };
  },
}));

vi.mock("./run-model-selection.runtime.js", () => ({
  DEFAULT_MODEL: "gpt-5.4",
  DEFAULT_PROVIDER: "openai",
  loadModelCatalog: loadModelCatalogMock,
  getModelRefStatus: getModelRefStatusMock,
  normalizeModelSelection: normalizeModelSelectionForTest,
  resolveAllowedModelRef: resolveAllowedModelRefMock,
  resolveConfiguredModelRef: resolveConfiguredModelRefMock,
  resolveHooksGmailModel: resolveHooksGmailModelMock,
  resolveSubagentModelConfigSelectionResult: ({
    cfg,
    agentConfigOverride,
  }: {
    cfg?: { agents?: { defaults?: { subagents?: { model?: unknown } } } };
    agentConfigOverride?: { model?: unknown; subagents?: { model?: unknown } };
  }) => {
    for (const candidate of [
      { raw: agentConfigOverride?.subagents?.model, source: "subagent" as const },
      { raw: agentConfigOverride?.model, source: "agent" as const },
      { raw: cfg?.agents?.defaults?.subagents?.model, source: "default-subagent" as const },
    ]) {
      if (normalizeModelSelectionForTest(candidate.raw)) {
        return candidate;
      }
    }
    return undefined;
  },
}));

vi.mock("./run-execution.runtime.js", () => ({
  resolveEffectiveModelFallbacks: resolveEffectiveModelFallbacksMock,
  resolveSubagentModelFallbacksOverride: resolveSubagentModelFallbacksOverrideMock,
  resolveBootstrapWarningSignaturesSeen: resolveBootstrapWarningSignaturesSeenMock,
  getCliSessionId: getCliSessionIdMock,
  runCliAgent: runCliAgentMock,
  resolveFastModeState: resolveFastModeStateMock,
  resolveCronAgentLane: resolveCronAgentLaneMock,
  LiveSessionModelSwitchError,
  runWithModelFallback: runWithModelFallbackMock,
  isCliProvider: isCliProviderMock,
  runEmbeddedAgent: runEmbeddedAgentMock,
  countActiveDescendantRuns: countActiveDescendantRunsMock,
  listDescendantRunsForRequester: listDescendantRunsForRequesterMock,
  normalizeVerboseLevel: normalizeVerboseLevelMock,
  resolveSessionTranscriptPath: resolveSessionTranscriptPathMock,
  registerAgentRunContext: registerAgentRunContextMock,
  logWarn: (...args: unknown[]) => logWarnMock(...args),
}));

vi.mock("../../agents/model-runtime-aliases.js", () => ({
  resolveCliRuntimeExecutionProvider: ({
    provider,
    cfg,
    modelId,
  }: {
    provider?: string;
    cfg?: {
      agents?: {
        defaults?: {
          models?: Record<string, { agentRuntime?: { id?: string } }>;
        };
      };
    };
    modelId?: string;
  }) => {
    const key = provider && modelId ? `${provider}/${modelId}` : undefined;
    const runtime = key
      ? cfg?.agents?.defaults?.models?.[key]?.agentRuntime?.id?.trim()
      : undefined;
    return runtime || provider;
  },
}));

vi.mock("./run-auth-profile.runtime.js", () => ({
  resolveSessionAuthProfileOverride: resolveSessionAuthProfileOverrideMock,
}));

vi.mock("./run-embedded.runtime.js", () => ({
  resolveFastModeState: resolveFastModeStateMock,
  resolveCronAgentLane: resolveCronAgentLaneMock,
  runEmbeddedAgent: runEmbeddedAgentMock,
}));

vi.mock("./run-subagent-registry.runtime.js", () => ({
  countActiveDescendantRuns: countActiveDescendantRunsMock,
  listDescendantRunsForRequester: listDescendantRunsForRequesterMock,
}));

vi.mock("../../agents/cli-runner.runtime.js", () => ({
  clearCliSession: clearCliSessionMock,
  setCliSessionId: vi.fn(),
}));

vi.mock("../../agents/agent-bundle-mcp-tools.js", () => ({
  retireSessionMcpRuntime: retireSessionMcpRuntimeMock,
}));

vi.mock("../../config/sessions/store.runtime.js", () => ({
  updateSessionStore: updateSessionStoreMock,
}));

vi.mock("../delivery-plan.js", async () => ({
  ...(await vi.importActual<typeof import("../delivery-plan.js")>("../delivery-plan.js")),
  resolveCronDeliveryPlan: resolveCronDeliveryPlanMock,
}));

vi.mock("./run-delivery.runtime.js", async () => {
  const actual = await vi.importActual<typeof import("./run-delivery.runtime.js")>(
    "./run-delivery.runtime.js",
  );
  return {
    ...actual,
    cleanupDirectCronSession: cleanupDirectCronSessionMock,
    resolveDeliveryTarget: resolveDeliveryTargetMock,
    dispatchCronDelivery: dispatchCronDeliveryMock,
  };
});

vi.mock("./model-preflight.runtime.js", () => ({
  preflightCronModelProvider: preflightCronModelProviderMock,
}));

vi.mock("./helpers.js", () => ({
  isHeartbeatOnlyResponse: isHeartbeatOnlyResponseMock,
  pickLastDeliverablePayload: vi.fn().mockReturnValue(undefined),
  pickLastNonEmptyTextFromPayloads: pickLastNonEmptyTextFromPayloadsMock,
  pickSummaryFromOutput: vi.fn().mockReturnValue("summary"),
  pickSummaryFromPayloads: vi.fn().mockReturnValue("summary"),
  resolveCronPayloadOutcome: resolveCronPayloadOutcomeMock,
  resolveHeartbeatAckMaxChars: resolveHeartbeatAckMaxCharsMock,
}));

vi.mock("../../channels/plugins/index.js", () => ({
  getChannelPlugin: getChannelPluginMock,
}));

vi.mock("./session.js", () => ({
  resolveCronSession: resolveCronSessionMock,
}));

/** Build a default cron session entry for isolated-agent tests. */
export function makeCronSessionEntry(overrides?: Record<string, unknown>): CronSessionEntry {
  return {
    sessionId: "test-session-id",
    updatedAt: 0,
    systemSent: false,
    skillsSnapshot: undefined,
    ...overrides,
  };
}

/** Build a default cron session wrapper for isolated-agent tests. */
export function makeCronSession(overrides?: Record<string, unknown>): CronSession {
  return {
    storePath: "/tmp/store.json",
    store: {},
    sessionEntry: makeCronSessionEntry(),
    systemSent: false,
    isNewSession: true,
    ...overrides,
  } as CronSession;
}

function makeDefaultModelFallbackResult() {
  return {
    result: {
      payloads: [{ text: "test output" }],
      meta: { agentMeta: {} },
    },
    provider: "openai",
    model: "gpt-5.4",
  };
}

function makeDefaultEmbeddedResult() {
  return {
    payloads: [{ text: "test output" }],
    meta: { agentMeta: {} },
  };
}

/** Configure model fallback execution to call the provided run callback directly. */
export function mockRunCronFallbackPassthrough(): void {
  runWithModelFallbackMock.mockImplementation(async ({ provider, model, run }) => {
    const result = await run(provider, model);
    return { result, provider, model, attempts: [] };
  });
}

function resetRunConfigMocks(): void {
  buildWorkspaceSkillSnapshotMock.mockReturnValue({
    prompt: "<available_skills></available_skills>",
    resolvedSkills: [],
    version: 42,
  });
  resolveAgentConfigMock.mockReturnValue(undefined);
  resolveEffectiveModelFallbacksMock.mockReset();
  resolveEffectiveModelFallbacksMock.mockImplementation(
    ({ cfg, agentId, hasSessionModelOverride, modelOverrideSource }) => {
      const agentFallbacksOverride = resolveAgentModelFallbacksOverrideMock(cfg, agentId) as
        | string[]
        | undefined;
      if (!hasSessionModelOverride) {
        return agentFallbacksOverride;
      }
      if (modelOverrideSource !== "auto") {
        return [];
      }
      const defaultFallbacks = resolveAgentModelFallbackValues(cfg?.agents?.defaults?.model);
      return agentFallbacksOverride ?? defaultFallbacks;
    },
  );
  resolveSubagentModelFallbacksOverrideMock.mockReset();
  resolveSubagentModelFallbacksOverrideMock.mockImplementation((cfg, agentId) => {
    const agentConfig = resolveAgentConfigMock(cfg, agentId) as
      | { model?: unknown; subagents?: { model?: unknown } }
      | undefined;
    const resolveOverride = (raw: unknown): string[] | undefined => {
      const primary = normalizeModelSelectionForTest(raw);
      if (!raw) {
        return undefined;
      }
      if (typeof raw === "string") {
        return primary ? [] : undefined;
      }
      if (typeof raw !== "object" || Array.isArray(raw)) {
        return undefined;
      }
      if (!Object.hasOwn(raw, "fallbacks")) {
        return Object.hasOwn(raw, "primary") && primary ? [] : undefined;
      }
      const fallbacks = (raw as { fallbacks?: unknown }).fallbacks;
      return Array.isArray(fallbacks)
        ? fallbacks.filter((entry) => typeof entry === "string")
        : undefined;
    };
    const subagentFallbacks = resolveOverride(agentConfig?.subagents?.model);
    if (subagentFallbacks !== undefined) {
      return subagentFallbacks;
    }
    const selectedConfig = [
      agentConfig?.subagents?.model,
      agentConfig?.model,
      (cfg as { agents?: { defaults?: { subagents?: { model?: unknown } } } })?.agents?.defaults
        ?.subagents?.model,
    ].find((raw) => normalizeModelSelectionForTest(raw));
    return resolveOverride(selectedConfig);
  });
  resolveAgentModelFallbacksOverrideMock.mockReturnValue(undefined);
  resolveAgentSkillsFilterMock.mockReturnValue(undefined);
  resolveConfiguredModelRefMock.mockReturnValue({ provider: "openai", model: "gpt-5.4" });
  resolveCliRuntimeExecutionProviderMock.mockReturnValue(undefined);
  resolveAllowedModelRefMock.mockReturnValue({ ref: { provider: "openai", model: "gpt-5.4" } });
  resolveHooksGmailModelMock.mockReturnValue(null);
  resolveThinkingDefaultMock.mockReturnValue("off");
  getModelRefStatusMock.mockReturnValue({ allowed: false });
  resolveCronStyleNowMock.mockReturnValue({
    formattedTime: "2026-02-10 12:00",
    timeLine: "Current time: 2026-02-10 12:00 UTC",
  });
  resolveAgentTimeoutMsMock.mockReturnValue(60_000);
  deriveSessionTotalTokensMock.mockReturnValue(30);
  hasNonzeroUsageMock.mockImplementation(
    (usage: { input?: unknown; output?: unknown } | undefined) =>
      (typeof usage?.input === "number" && usage.input > 0) ||
      (typeof usage?.output === "number" && usage.output > 0),
  );
  ensureAgentWorkspaceMock.mockResolvedValue({ dir: "/tmp/workspace" });
  normalizeThinkLevelMock.mockImplementation((value: unknown) => value);
  isThinkingLevelSupportedMock.mockReturnValue(true);
  resolveSupportedThinkingLevelMock.mockImplementation(({ level }: { level?: unknown }) => level);
  supportsXHighThinkingMock.mockReturnValue(false);
  buildSafeExternalPromptMock.mockImplementation(
    ({ message }: { message?: string }) => message ?? "",
  );
  detectSuspiciousPatternsMock.mockReturnValue([]);
  mapHookExternalContentSourceMock.mockReturnValue("unknown");
  isExternalHookSessionMock.mockReturnValue(false);
  resolveHookExternalContentSourceMock.mockReturnValue(undefined);
  getSkillsSnapshotVersionMock.mockReturnValue(42);
  loadModelCatalogMock.mockResolvedValue([]);
  getRemoteSkillEligibilityMock.mockResolvedValue({ remoteSkillsEnabled: false });
}

function resetRunExecutionMocks(): void {
  isCliProviderMock.mockReturnValue(false);
  resolveBootstrapWarningSignaturesSeenMock.mockReturnValue(new Set());
  resolveFastModeStateMock.mockImplementation((params) => resolveFastModeStateImpl(params));
  resolveCronAgentLaneMock.mockReturnValue(undefined);
  normalizeVerboseLevelMock.mockImplementation((value: unknown) => value ?? "off");
  resolveSessionTranscriptPathMock.mockReturnValue("/tmp/transcript.jsonl");
  registerAgentRunContextMock.mockReturnValue(undefined);
  runWithModelFallbackMock.mockReset();
  runWithModelFallbackMock.mockResolvedValue(makeDefaultModelFallbackResult());
  runEmbeddedAgentMock.mockReset();
  runEmbeddedAgentMock.mockResolvedValue(makeDefaultEmbeddedResult());
  runCliAgentMock.mockReset();
  clearCliSessionMock.mockReset();
  getCliSessionIdMock.mockReturnValue(undefined);
  countActiveDescendantRunsMock.mockReset();
  countActiveDescendantRunsMock.mockReturnValue(0);
  listDescendantRunsForRequesterMock.mockReset();
  listDescendantRunsForRequesterMock.mockReturnValue([]);
}

function resetRunOutcomeMocks(): void {
  lookupContextTokensMock.mockReset();
  lookupContextTokensMock.mockReturnValue(undefined);
  pickLastNonEmptyTextFromPayloadsMock.mockReset();
  pickLastNonEmptyTextFromPayloadsMock.mockReturnValue("test output");
  resolveCronPayloadOutcomeMock.mockReset();
  resolveCronPayloadOutcomeMock.mockImplementation(
    ({
      payloads,
      failureSignal,
      runLevelError,
    }: {
      payloads: Array<{ isError?: boolean }>;
      failureSignal?: { fatalForCron?: boolean; message?: string };
      runLevelError?: unknown;
    }) => {
      const runLevelErrorMessage =
        typeof runLevelError === "string" && runLevelError.trim()
          ? `cron isolated run failed: ${runLevelError.trim()}`
          : runLevelError && typeof runLevelError === "object"
            ? (() => {
                const record = runLevelError as { message?: unknown; kind?: unknown };
                const message =
                  typeof record.message === "string" && record.message.trim()
                    ? record.message.trim()
                    : undefined;
                if (message) {
                  return `cron isolated run failed: ${message}`;
                }
                const kind =
                  typeof record.kind === "string" && record.kind.trim()
                    ? record.kind.trim()
                    : undefined;
                return kind ? `cron isolated run failed: ${kind}` : "cron isolated run failed";
              })()
            : undefined;
      const failureMessage =
        failureSignal?.fatalForCron === true
          ? (failureSignal.message ?? "cron isolated run returned a fatal failure signal")
          : undefined;
      const errorPayloadMessage = payloads.some((payload) => payload?.isError === true)
        ? "cron isolated run returned an error payload"
        : undefined;
      const outputText =
        errorPayloadMessage ??
        failureMessage ??
        runLevelErrorMessage ??
        pickLastNonEmptyTextFromPayloadsMock(payloads);
      const synthesizedText = outputText?.trim() || "summary";
      const hasFatalErrorPayload =
        errorPayloadMessage !== undefined ||
        failureMessage !== undefined ||
        runLevelErrorMessage !== undefined;
      const hasFatalStructuredErrorPayload = errorPayloadMessage !== undefined;
      const deliveryPayload =
        errorPayloadMessage || failureMessage || runLevelErrorMessage
          ? { text: errorPayloadMessage ?? failureMessage ?? runLevelErrorMessage, isError: true }
          : undefined;
      return {
        summary: errorPayloadMessage ?? failureMessage ?? runLevelErrorMessage ?? "summary",
        outputText,
        synthesizedText,
        deliveryPayload,
        deliveryPayloads: deliveryPayload
          ? [deliveryPayload]
          : synthesizedText
            ? [{ text: synthesizedText }]
            : [],
        deliveryPayloadHasStructuredContent: false,
        hasFatalErrorPayload,
        hasFatalStructuredErrorPayload,
        embeddedRunError:
          errorPayloadMessage ?? failureMessage ?? runLevelErrorMessage ?? undefined,
      };
    },
  );
  resolveCronDeliveryPlanMock.mockReset();
  resolveCronDeliveryPlanMock.mockReturnValue({ requested: false, mode: "none" });
  resolveDeliveryTargetMock.mockReset();
  resolveDeliveryTargetMock.mockResolvedValue({
    ok: true,
    channel: "messagechat",
    to: "test-target",
    accountId: undefined,
    threadId: undefined,
    mode: "explicit",
    error: undefined,
  });
  dispatchCronDeliveryMock.mockReset();
  dispatchCronDeliveryMock.mockImplementation(
    ({
      deliveryPayloads,
      summary,
      outputText,
      synthesizedText,
      deliveryRequested,
      skipHeartbeatDelivery,
      sourceDeliveryOutcome,
      resolvedDelivery,
    }) => ({
      result: undefined,
      delivered: Boolean(
        sourceDeliveryOutcome?.verifiedMessageToolDelivery ||
        (deliveryRequested &&
          !skipHeartbeatDelivery &&
          !sourceDeliveryOutcome?.satisfiesSourceDelivery &&
          resolvedDelivery.ok),
      ),
      deliveryAttempted: Boolean(
        sourceDeliveryOutcome?.verifiedMessageToolDelivery ||
        (deliveryRequested &&
          !skipHeartbeatDelivery &&
          !sourceDeliveryOutcome?.satisfiesSourceDelivery &&
          resolvedDelivery.ok),
      ),
      summary,
      outputText,
      synthesizedText,
      deliveryPayloads,
    }),
  );
  cleanupDirectCronSessionMock.mockReset();
  cleanupDirectCronSessionMock.mockResolvedValue(undefined);
  preflightCronModelProviderMock.mockReset();
  preflightCronModelProviderMock.mockResolvedValue({ status: "available" });
  isHeartbeatOnlyResponseMock.mockReset();
  isHeartbeatOnlyResponseMock.mockReturnValue(false);
  resolveHeartbeatAckMaxCharsMock.mockReset();
  resolveHeartbeatAckMaxCharsMock.mockReturnValue(100);
  resolveSessionAuthProfileOverrideMock.mockReset();
  resolveSessionAuthProfileOverrideMock.mockResolvedValue(undefined);
}

function resetRunSessionMocks(): void {
  updateSessionStoreMock.mockReset();
  updateSessionStoreMock.mockResolvedValue(undefined);
  resolveCronSessionMock.mockReset();
  resolveCronSessionMock.mockReturnValue(makeCronSession());
  retireSessionMcpRuntimeMock.mockReset();
  retireSessionMcpRuntimeMock.mockResolvedValue(true);
}

/** Reset all isolated-agent cron harness mocks to their default behaviors. */
export function resetRunCronIsolatedAgentTurnHarness(): void {
  vi.clearAllMocks();
  resetRunConfigMocks();
  resetRunExecutionMocks();
  resetRunOutcomeMocks();
  resetRunSessionMocks();
  setSessionRuntimeModelMock.mockReturnValue(undefined);
  logWarnMock.mockReset();
  ensureRuntimePluginsLoadedMock.mockReset();
}

/** Temporarily clear fast-test mode and return the previous value. */
export function clearFastTestEnv(): string | undefined {
  const previousFastTestEnv = process.env.OPENCLAW_TEST_FAST;
  delete process.env.OPENCLAW_TEST_FAST;
  return previousFastTestEnv;
}

/** Restore fast-test mode after a test changed it. */
export function restoreFastTestEnv(previousFastTestEnv: string | undefined): void {
  if (previousFastTestEnv == null) {
    delete process.env.OPENCLAW_TEST_FAST;
    return;
  }
  process.env.OPENCLAW_TEST_FAST = previousFastTestEnv;
}

/** Import the cron isolated-agent turn runner after module mocks are installed. */
export async function loadRunCronIsolatedAgentTurn() {
  const { runCronIsolatedAgentTurn } = await import("./run.js");
  return runCronIsolatedAgentTurn;
}
