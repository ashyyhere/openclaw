/** Test harness for overflow compaction and fallback loop scenarios. */
import { type Mock, vi } from "vitest";
import type { ThinkLevel } from "../../auto-reply/thinking.js";
import { formatErrorMessage } from "../../infra/errors.js";
import type {
  PluginHookAgentContext,
  PluginHookBeforeAgentReplyResult,
  PluginHookBeforeAgentStartResult,
  PluginHookBeforeModelResolveResult,
  PluginHookBeforePromptBuildResult,
} from "../../plugins/types.js";
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";
import type { FailoverReason } from "../embedded-agent-helpers/types.js";
import { clearAgentHarnesses, registerAgentHarness } from "../harness/registry.js";
import type { buildEmbeddedRunPayloads } from "./run/payloads.js";
import type { EmbeddedRunAttemptResult } from "./run/types.js";

type MockCompactionResult =
  | {
      ok: true;
      compacted: true;
      result: {
        summary: string;
        firstKeptEntryId?: string;
        tokensBefore?: number;
        tokensAfter?: number;
        sessionId?: string;
        sessionFile?: string;
      };
      reason?: string;
    }
  | {
      ok: false;
      compacted: false;
      reason: string;
      result?: undefined;
    }
  | {
      ok: true;
      compacted: false;
      reason: string;
      result?: undefined;
    };

/** Reused constant for mocked Global Hook Runner behavior in src/agents/embedded-agent-runner. */
export const mockedGlobalHookRunner = {
  hasHooks: vi.fn((_hookName: string) => false),
  runBeforeAgentReply: vi.fn(
    async (
      _eventValue: { cleanedBody: string },
      _ctx: PluginHookAgentContext,
    ): Promise<PluginHookBeforeAgentReplyResult | undefined> => undefined,
  ),
  runBeforeAgentStart: vi.fn(
    async (
      _eventValue: { prompt: string; messages?: unknown[] },
      _ctx: PluginHookAgentContext,
    ): Promise<PluginHookBeforeAgentStartResult | undefined> => undefined,
  ),
  runBeforePromptBuild: vi.fn(
    async (
      _eventValue: { prompt: string; messages: unknown[] },
      _ctx: PluginHookAgentContext,
    ): Promise<PluginHookBeforePromptBuildResult | undefined> => undefined,
  ),
  runBeforeModelResolve: vi.fn(
    async (
      _eventValue: { prompt: string },
      _ctx: PluginHookAgentContext,
    ): Promise<PluginHookBeforeModelResolveResult | undefined> => undefined,
  ),
  runBeforeCompaction: vi.fn(async () => undefined),
  runAfterCompaction: vi.fn(async () => undefined),
};

/** Reused constant for mocked Context Engine behavior in src/agents/embedded-agent-runner. */
export const mockedContextEngine = {
  info: { ownsCompaction: false as boolean },
  compact: vi.fn<(params: unknown) => Promise<MockCompactionResult>>(async () => ({
    ok: false as const,
    compacted: false as const,
    reason: "nothing to compact",
  })),
};

/** Reused constant for mocked Context Engine Compact behavior in src/agents/embedded-agent-runner. */
export const mockedContextEngineCompact = mockedContextEngine.compact;
/** Reused constant for mocked Compact Direct behavior in src/agents/embedded-agent-runner. */
export const mockedCompactDirect = mockedContextEngine.compact;
/** Reused constant for mocked Resolve Context Engine behavior in src/agents/embedded-agent-runner. */
export const mockedResolveContextEngine = vi.fn(async () => mockedContextEngine);
/** Reused constant for mocked Resolve Context Engine Owner Plugin Id behavior in src/agents/embedded-agent-runner. */
export const mockedResolveContextEngineOwnerPluginId = vi.fn(() => undefined);
/** Reused constant for mocked Build Agent Runtime Plan behavior in src/agents/embedded-agent-runner. */
export const mockedBuildAgentRuntimePlan = vi.fn(() => ({}));
/** Reused constant for mocked Run Post Compaction Side Effects behavior in src/agents/embedded-agent-runner. */
export const mockedRunPostCompactionSideEffects = vi.fn(async () => {});
/** Reused constant for mocked Ensure Runtime Plugins Loaded behavior in src/agents/embedded-agent-runner. */
export const mockedEnsureRuntimePluginsLoaded = vi.fn<(params?: unknown) => void>();
/** Reused constant for mocked Resolve Model Async behavior in src/agents/embedded-agent-runner. */
export const mockedResolveModelAsync = vi.fn(async () => ({
  model: {
    id: "test-model",
    provider: "anthropic",
    contextWindow: 200000,
    api: "messages",
  },
  error: null,
  authStorage: {
    setRuntimeApiKey: vi.fn(),
  },
  modelRegistry: {},
}));
/** Reused constant for mocked Prepare Provider Runtime Auth behavior in src/agents/embedded-agent-runner. */
export const mockedPrepareProviderRuntimeAuth = vi.fn(async () => undefined);
/** Reused constant for mocked Run Embedded Attempt behavior in src/agents/embedded-agent-runner. */
export const mockedRunEmbeddedAttempt =
  vi.fn<(params: unknown) => Promise<EmbeddedRunAttemptResult>>();
/** Reused constant for mocked Build Embedded Run Payloads behavior in src/agents/embedded-agent-runner. */
export const mockedBuildEmbeddedRunPayloads = vi.fn<
  (
    ...args: Parameters<typeof buildEmbeddedRunPayloads>
  ) => ReturnType<typeof buildEmbeddedRunPayloads>
>(() => []);
/** Reused constant for mocked Run Context Engine Maintenance behavior in src/agents/embedded-agent-runner. */
export const mockedRunContextEngineMaintenance = vi.fn(async () => undefined);
/** Reused constant for mocked Session Likely Has Oversized Tool Results behavior in src/agents/embedded-agent-runner. */
export const mockedSessionLikelyHasOversizedToolResults = vi.fn(() => false);
/** Reused constant for mocked Resolve Live Tool Result Max Chars behavior in src/agents/embedded-agent-runner. */
export const mockedResolveLiveToolResultMaxChars = vi.fn(() => 32_000);
type MockTruncateOversizedToolResultsResult = {
  truncated: boolean;
  truncatedCount: number;
  reason?: string;
};
/** Reused constant for mocked Truncate Oversized Tool Results In Session behavior in src/agents/embedded-agent-runner. */
export const mockedTruncateOversizedToolResultsInSession = vi.fn<
  () => Promise<MockTruncateOversizedToolResultsResult>
>(async () => ({
  truncated: false,
  truncatedCount: 0,
  reason: "no oversized tool results",
}));

type MockFailoverErrorDescription = {
  message: string;
  reason: string | undefined;
  status: number | undefined;
  code: string | undefined;
};

type MockCoerceToFailoverError = (
  err: unknown,
  params?: { provider?: string; model?: string; profileId?: string },
) => unknown;
type MockDescribeFailoverError = (err: unknown) => MockFailoverErrorDescription;
type MockResolveFailoverStatus = (reason: string) => number | undefined;
/** Reused class for Mocked Failover Error behavior in src/agents/embedded-agent-runner. */
export class MockedFailoverError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FailoverError";
  }
}

/** Reused constant for mocked Coerce To Failover Error behavior in src/agents/embedded-agent-runner. */
export const mockedCoerceToFailoverError = vi.fn<MockCoerceToFailoverError>();
/** Reused constant for mocked Describe Failover Error behavior in src/agents/embedded-agent-runner. */
export const mockedDescribeFailoverError = vi.fn<MockDescribeFailoverError>(
  (err: unknown): MockFailoverErrorDescription => ({
    message: formatErrorMessage(err),
    reason: undefined,
    status: undefined,
    code: undefined,
  }),
);
/** Reused constant for mocked Resolve Failover Status behavior in src/agents/embedded-agent-runner. */
export const mockedResolveFailoverStatus = vi.fn<MockResolveFailoverStatus>();

/** Reused constant for mocked Log behavior in src/agents/embedded-agent-runner. */
export const mockedLog: {
  debug: Mock<(...args: unknown[]) => void>;
  info: Mock<(...args: unknown[]) => void>;
  warn: Mock<(...args: unknown[]) => void>;
  error: Mock<(...args: unknown[]) => void>;
  isEnabled: Mock<(level?: string) => boolean>;
} = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  isEnabled: vi.fn(() => false),
};

/** Reused constant for mocked Format Billing Error Message behavior in src/agents/embedded-agent-runner. */
export const mockedFormatBillingErrorMessage = vi.fn(() => "");
/** Reused constant for mocked Classify Failover Reason behavior in src/agents/embedded-agent-runner. */
export const mockedClassifyFailoverReason = vi.fn<(raw: string) => FailoverReason | null>(
  () => null,
);
/** Reused constant for mocked Extract Observed Overflow Token Count behavior in src/agents/embedded-agent-runner. */
export const mockedExtractObservedOverflowTokenCount = vi.fn((msg?: string) => {
  const match = msg?.match(/prompt is too long:\s*([\d,]+)\s+tokens\s*>\s*[\d,]+\s+maximum/i);
  return match?.[1] ? Number(match[1].replaceAll(",", "")) : undefined;
});
/** Reused constant for mocked Format Assistant Error Text behavior in src/agents/embedded-agent-runner. */
export const mockedFormatAssistantErrorText = vi.fn(() => "");
/** Reused constant for mocked Is Auth Assistant Error behavior in src/agents/embedded-agent-runner. */
export const mockedIsAuthAssistantError = vi.fn(() => false);
/** Reused constant for mocked Is Billing Assistant Error behavior in src/agents/embedded-agent-runner. */
export const mockedIsBillingAssistantError = vi.fn(() => false);
/** Reused constant for mocked Is Compaction Failure Error behavior in src/agents/embedded-agent-runner. */
export const mockedIsCompactionFailureError = vi.fn(() => false);
/** Reused constant for mocked Is Failover Assistant Error behavior in src/agents/embedded-agent-runner. */
export const mockedIsFailoverAssistantError = vi.fn(() => false);
/** Reused constant for mocked Is Failover Error Message behavior in src/agents/embedded-agent-runner. */
export const mockedIsFailoverErrorMessage = vi.fn(() => false);
/** Reused constant for mocked Is Likely Context Overflow Error behavior in src/agents/embedded-agent-runner. */
export const mockedIsLikelyContextOverflowError = vi.fn((msg?: string) => {
  const lower = normalizeLowercaseStringOrEmpty(msg ?? "");
  return (
    lower.includes("request_too_large") ||
    lower.includes("context window exceeded") ||
    (lower.includes("context window") && lower.includes("ran out of room")) ||
    lower.includes("prompt is too long")
  );
});
/** Reused constant for mocked Parse Image Size Error behavior in src/agents/embedded-agent-runner. */
export const mockedParseImageSizeError = vi.fn(() => null);
/** Reused constant for mocked Parse Image Dimension Error behavior in src/agents/embedded-agent-runner. */
export const mockedParseImageDimensionError = vi.fn(() => null);
/** Reused constant for mocked Is Rate Limit Assistant Error behavior in src/agents/embedded-agent-runner. */
export const mockedIsRateLimitAssistantError = vi.fn(() => false);
/** Reused constant for mocked Is Timeout Error Message behavior in src/agents/embedded-agent-runner. */
export const mockedIsTimeoutErrorMessage = vi.fn(() => false);
/** Reused constant for mocked Pick Fallback Thinking Level behavior in src/agents/embedded-agent-runner. */
export const mockedPickFallbackThinkingLevel = vi.fn<(params?: unknown) => ThinkLevel | null>(
  () => null,
);
/** Reused constant for mocked Evaluate Context Window Guard behavior in src/agents/embedded-agent-runner. */
export const mockedEvaluateContextWindowGuard = vi.fn(() => ({
  shouldWarn: false,
  shouldBlock: false,
  tokens: 200000,
  source: "model",
  hardMinTokens: 1000,
  warnBelowTokens: 5000,
}));
/** Reused constant for mocked Resolve Context Window Info behavior in src/agents/embedded-agent-runner. */
export const mockedResolveContextWindowInfo = vi.fn(() => ({
  tokens: 200000,
  source: "model",
}));
/** Reused constant for mocked Format Context Window Warning Message behavior in src/agents/embedded-agent-runner. */
export const mockedFormatContextWindowWarningMessage = vi.fn(
  (params: { provider: string; modelId: string; guard: { tokens: number; source: string } }) =>
    `low context window: ${params.provider}/${params.modelId} ctx=${params.guard.tokens} source=${params.guard.source}`,
);
/** Reused constant for mocked Format Context Window Block Message behavior in src/agents/embedded-agent-runner. */
export const mockedFormatContextWindowBlockMessage = vi.fn(
  (params: { guard: { tokens: number; source: string } }) =>
    `Model context window too small (${params.guard.tokens} tokens; source=${params.guard.source}). Minimum is 1000.`,
);
/** Reused constant for mocked Get Api Key For Model behavior in src/agents/embedded-agent-runner. */
export const mockedGetApiKeyForModel = vi.fn(
  async ({ profileId }: { profileId?: string } = {}) => ({
    apiKey: "test-key",
    profileId: profileId ?? "test-profile",
    source: "test",
    mode: "api-key" as const,
  }),
);
/** Reused constant for mocked Mark Auth Profile Failure behavior in src/agents/embedded-agent-runner. */
export const mockedMarkAuthProfileFailure = vi.fn(async () => {});
/** Reused constant for mocked Ensure Auth Profile Store behavior in src/agents/embedded-agent-runner. */
export const mockedEnsureAuthProfileStore = vi.fn(() => ({}));
/** Reused constant for mocked Ensure Auth Profile Store Without External Profiles behavior in src/agents/embedded-agent-runner. */
export const mockedEnsureAuthProfileStoreWithoutExternalProfiles = vi.fn(
  (_agentDir?: string, _options?: { allowKeychainPrompt?: boolean }) => ({}),
);
/** Reused constant for mocked Resolve Auth Profile Order behavior in src/agents/embedded-agent-runner. */
export const mockedResolveAuthProfileOrder = vi.fn<(_params?: unknown) => string[]>(
  (_params?: unknown) => [],
);
/** Reused constant for mocked Mark Auth Profile Success behavior in src/agents/embedded-agent-runner. */
export const mockedMarkAuthProfileSuccess = vi.fn(async () => {});
/** Reused constant for mocked Should Prefer Explicit Config Api Key Auth behavior in src/agents/embedded-agent-runner. */
export const mockedShouldPreferExplicitConfigApiKeyAuth = vi.fn(() => false);

/** Reused constant for overflow Base Run Params behavior in src/agents/embedded-agent-runner. */
export const overflowBaseRunParams = {
  sessionId: "test-session",
  sessionKey: "test-key",
  sessionFile: "/tmp/session.json",
  workspaceDir: "/tmp/workspace",
  prompt: "hello",
  timeoutMs: 30000,
  runId: "run-1",
} as const;

/** Reused helper for reset Run Overflow Compaction Harness Mocks behavior in src/agents/embedded-agent-runner. */
export function resetRunOverflowCompactionHarnessMocks(): void {
  clearAgentHarnesses();
  registerAgentHarness({
    id: "codex",
    label: "Codex",
    supports: (ctx) =>
      ctx.provider === "codex" || ctx.provider === "openai-codex" || ctx.provider === "openai"
        ? { supported: true, priority: 100 }
        : { supported: false },
    runAttempt: async (params) => await mockedRunEmbeddedAttempt(params),
  });

  mockedGlobalHookRunner.hasHooks.mockReset();
  mockedGlobalHookRunner.hasHooks.mockReturnValue(false);
  mockedGlobalHookRunner.runBeforeAgentReply.mockReset();
  mockedGlobalHookRunner.runBeforeAgentReply.mockResolvedValue(undefined);
  mockedGlobalHookRunner.runBeforeAgentStart.mockReset();
  mockedGlobalHookRunner.runBeforeAgentStart.mockResolvedValue(undefined);
  mockedGlobalHookRunner.runBeforePromptBuild.mockReset();
  mockedGlobalHookRunner.runBeforePromptBuild.mockResolvedValue(undefined);
  mockedGlobalHookRunner.runBeforeModelResolve.mockReset();
  mockedGlobalHookRunner.runBeforeModelResolve.mockResolvedValue(undefined);
  mockedGlobalHookRunner.runBeforeCompaction.mockReset();
  mockedGlobalHookRunner.runBeforeCompaction.mockResolvedValue(undefined);
  mockedGlobalHookRunner.runAfterCompaction.mockReset();
  mockedGlobalHookRunner.runAfterCompaction.mockResolvedValue(undefined);

  mockedContextEngine.info.ownsCompaction = false;
  mockedResolveContextEngine.mockReset();
  mockedResolveContextEngine.mockResolvedValue(mockedContextEngine);
  mockedBuildAgentRuntimePlan.mockReset();
  mockedBuildAgentRuntimePlan.mockReturnValue({});
  mockedContextEngineCompact.mockReset();
  mockedContextEngineCompact.mockResolvedValue({
    ok: false,
    compacted: false,
    reason: "nothing to compact",
  });

  mockedEnsureRuntimePluginsLoaded.mockReset();
  mockedResolveModelAsync.mockReset();
  mockedResolveModelAsync.mockResolvedValue({
    model: {
      id: "test-model",
      provider: "anthropic",
      contextWindow: 200000,
      api: "messages",
    },
    error: null,
    authStorage: {
      setRuntimeApiKey: vi.fn(),
    },
    modelRegistry: {},
  });
  mockedPrepareProviderRuntimeAuth.mockReset();
  mockedPrepareProviderRuntimeAuth.mockResolvedValue(undefined);
  mockedRunEmbeddedAttempt.mockReset();
  mockedBuildEmbeddedRunPayloads.mockReset();
  mockedBuildEmbeddedRunPayloads.mockReturnValue([]);
  mockedRunContextEngineMaintenance.mockReset();
  mockedRunContextEngineMaintenance.mockResolvedValue(undefined);
  mockedSessionLikelyHasOversizedToolResults.mockReset();
  mockedSessionLikelyHasOversizedToolResults.mockReturnValue(false);
  mockedResolveLiveToolResultMaxChars.mockReset();
  mockedResolveLiveToolResultMaxChars.mockReturnValue(32_000);
  mockedTruncateOversizedToolResultsInSession.mockReset();
  mockedTruncateOversizedToolResultsInSession.mockResolvedValue({
    truncated: false,
    truncatedCount: 0,
    reason: "no oversized tool results",
  });

  mockedCoerceToFailoverError.mockReset();
  mockedCoerceToFailoverError.mockReturnValue(null);
  mockedDescribeFailoverError.mockReset();
  mockedDescribeFailoverError.mockImplementation(
    (err: unknown): MockFailoverErrorDescription => ({
      message: formatErrorMessage(err),
      reason: undefined,
      status: undefined,
      code: undefined,
    }),
  );
  mockedResolveFailoverStatus.mockReset();
  mockedResolveFailoverStatus.mockReturnValue(undefined);

  mockedLog.debug.mockReset();
  mockedLog.info.mockReset();
  mockedLog.warn.mockReset();
  mockedLog.error.mockReset();
  mockedLog.isEnabled.mockReset();
  mockedLog.isEnabled.mockReturnValue(false);

  mockedClassifyFailoverReason.mockReset();
  mockedClassifyFailoverReason.mockReturnValue(null);
  mockedFormatBillingErrorMessage.mockReset();
  mockedFormatBillingErrorMessage.mockReturnValue("");
  mockedFormatAssistantErrorText.mockReset();
  mockedFormatAssistantErrorText.mockReturnValue("");
  mockedIsAuthAssistantError.mockReset();
  mockedIsAuthAssistantError.mockReturnValue(false);
  mockedIsBillingAssistantError.mockReset();
  mockedIsBillingAssistantError.mockReturnValue(false);
  mockedExtractObservedOverflowTokenCount.mockReset();
  mockedExtractObservedOverflowTokenCount.mockImplementation((msg?: string) => {
    const match = msg?.match(/prompt is too long:\s*([\d,]+)\s+tokens\s*>\s*[\d,]+\s+maximum/i);
    return match?.[1] ? Number(match[1].replaceAll(",", "")) : undefined;
  });
  mockedIsCompactionFailureError.mockReset();
  mockedIsCompactionFailureError.mockReturnValue(false);
  mockedIsFailoverAssistantError.mockReset();
  mockedIsFailoverAssistantError.mockReturnValue(false);
  mockedIsFailoverErrorMessage.mockReset();
  mockedIsFailoverErrorMessage.mockReturnValue(false);
  mockedIsLikelyContextOverflowError.mockReset();
  mockedIsLikelyContextOverflowError.mockImplementation((msg?: string) => {
    const lower = normalizeLowercaseStringOrEmpty(msg ?? "");
    return (
      lower.includes("request_too_large") ||
      lower.includes("context window exceeded") ||
      (lower.includes("context window") && lower.includes("ran out of room")) ||
      lower.includes("prompt is too long")
    );
  });
  mockedParseImageSizeError.mockReset();
  mockedParseImageSizeError.mockReturnValue(null);
  mockedParseImageDimensionError.mockReset();
  mockedParseImageDimensionError.mockReturnValue(null);
  mockedIsRateLimitAssistantError.mockReset();
  mockedIsRateLimitAssistantError.mockReturnValue(false);
  mockedIsTimeoutErrorMessage.mockReset();
  mockedIsTimeoutErrorMessage.mockReturnValue(false);
  mockedPickFallbackThinkingLevel.mockReset();
  mockedPickFallbackThinkingLevel.mockReturnValue(null);
  mockedEvaluateContextWindowGuard.mockReset();
  mockedEvaluateContextWindowGuard.mockReturnValue({
    shouldWarn: false,
    shouldBlock: false,
    tokens: 200000,
    source: "model",
    hardMinTokens: 1000,
    warnBelowTokens: 5000,
  });
  mockedResolveContextWindowInfo.mockReset();
  mockedResolveContextWindowInfo.mockReturnValue({
    tokens: 200000,
    source: "model",
  });
  mockedFormatContextWindowWarningMessage.mockReset();
  mockedFormatContextWindowWarningMessage.mockImplementation(
    (params: { provider: string; modelId: string; guard: { tokens: number; source: string } }) =>
      `low context window: ${params.provider}/${params.modelId} ctx=${params.guard.tokens} source=${params.guard.source}`,
  );
  mockedFormatContextWindowBlockMessage.mockReset();
  mockedFormatContextWindowBlockMessage.mockImplementation(
    (params: { guard: { tokens: number; source: string } }) =>
      `Model context window too small (${params.guard.tokens} tokens; source=${params.guard.source}). Minimum is 1000.`,
  );
  mockedGetApiKeyForModel.mockReset();
  mockedGetApiKeyForModel.mockImplementation(
    async ({ profileId }: { profileId?: string } = {}) => ({
      apiKey: "test-key",
      profileId: profileId ?? "test-profile",
      source: "test",
      mode: "api-key",
    }),
  );
  mockedMarkAuthProfileFailure.mockReset();
  mockedMarkAuthProfileFailure.mockResolvedValue(undefined);
  mockedEnsureAuthProfileStore.mockReset();
  mockedEnsureAuthProfileStore.mockReturnValue({});
  mockedEnsureAuthProfileStoreWithoutExternalProfiles.mockReset();
  mockedEnsureAuthProfileStoreWithoutExternalProfiles.mockReturnValue({});
  mockedResolveAuthProfileOrder.mockReset();
  mockedResolveAuthProfileOrder.mockReturnValue([]);
  mockedMarkAuthProfileSuccess.mockReset();
  mockedMarkAuthProfileSuccess.mockResolvedValue(undefined);
  mockedShouldPreferExplicitConfigApiKeyAuth.mockReset();
  mockedShouldPreferExplicitConfigApiKeyAuth.mockReturnValue(false);
  mockedRunPostCompactionSideEffects.mockReset();
  mockedRunPostCompactionSideEffects.mockResolvedValue(undefined);
}

/** Reused helper for load Run Overflow Compaction Harness behavior in src/agents/embedded-agent-runner. */
export async function loadRunOverflowCompactionHarness(): Promise<{
  runEmbeddedAgent: typeof import("./run.js").runEmbeddedAgent;
}> {
  resetRunOverflowCompactionHarnessMocks();
  vi.resetModules();

  vi.doMock("../../plugins/hook-runner-global.js", () => ({
    getGlobalHookRunner: vi.fn(() => mockedGlobalHookRunner),
    initializeGlobalHookRunner: vi.fn(),
  }));

  vi.doMock("../../context-engine/init.js", () => ({
    ensureContextEnginesInitialized: vi.fn(),
  }));
  vi.doMock("../../context-engine/registry.js", () => ({
    resolveContextEngine: mockedResolveContextEngine,
    resolveContextEngineOwnerPluginId: mockedResolveContextEngineOwnerPluginId,
  }));

  vi.doMock("../runtime-plugins.js", () => ({
    ensureRuntimePluginsLoaded: mockedEnsureRuntimePluginsLoaded,
  }));

  vi.doMock("../harness/runtime-plugin.js", () => ({
    ensureSelectedAgentHarnessPlugin: vi.fn(async () => {}),
  }));

  vi.doMock("../runtime-plan/build.js", () => ({
    buildAgentRuntimePlan: mockedBuildAgentRuntimePlan,
  }));

  vi.doMock("../model-runtime-aliases.js", () => ({
    isCliRuntimeAliasForProvider: ({
      runtime,
      provider,
    }: {
      runtime?: string;
      provider?: string;
    }) =>
      (provider?.trim().toLowerCase() === "anthropic" &&
        runtime?.trim().toLowerCase() === "claude-cli") ||
      (provider?.trim().toLowerCase() === "openai" &&
        runtime?.trim().toLowerCase() === "codex-cli"),
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
      return runtime || undefined;
    },
  }));

  vi.doMock("../../plugins/provider-runtime.js", () => ({
    prepareProviderRuntimeAuth: mockedPrepareProviderRuntimeAuth,
    resolveProviderCapabilitiesWithPlugin: vi.fn(() => ({})),
    resolveProviderAuthProfileId: vi.fn(() => undefined),
    prepareProviderExtraParams: vi.fn(async () => ({})),
    wrapProviderStreamFn: vi.fn((_cfg: unknown, _model: unknown, fn: unknown) => fn),
  }));

  vi.doMock("../auth-profiles.js", () => ({
    isProfileInCooldown: vi.fn(() => false),
    markAuthProfileFailure: mockedMarkAuthProfileFailure,
    markAuthProfileSuccess: mockedMarkAuthProfileSuccess,
    resolveProfilesUnavailableReason: vi.fn(() => undefined),
  }));

  vi.doMock("../usage.js", () => ({
    normalizeUsage: vi.fn((usage?: unknown) =>
      usage && typeof usage === "object" ? usage : undefined,
    ),
    derivePromptTokens: vi.fn(
      (usage?: { input?: number; cacheRead?: number; cacheWrite?: number }) =>
        usage
          ? (() => {
              const sum = (usage.input ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
              return sum > 0 ? sum : undefined;
            })()
          : undefined,
    ),
  }));

  vi.doMock("../cli-backends.js", async () => {
    const actual = await vi.importActual<typeof import("../cli-backends.js")>("../cli-backends.js");
    type ResolveBindingParams = Parameters<typeof actual.resolveCliRuntimeModelBackendBinding>[0];
    type ProviderCheckParams = Parameters<typeof actual.isCliRuntimeModelBackendForProvider>[0];
    const claudeBinding = {
      provider: "anthropic",
      runtime: "claude-cli",
      pluginId: "anthropic",
    };
    return {
      ...actual,
      listCliRuntimeModelBackendBindings: vi.fn((params?: unknown) => [
        claudeBinding,
        ...actual
          .listCliRuntimeModelBackendBindings(
            params as Parameters<typeof actual.listCliRuntimeModelBackendBindings>[0],
          )
          .filter(
            (binding) =>
              binding.provider !== claudeBinding.provider ||
              binding.runtime !== claudeBinding.runtime,
          ),
      ]),
      listCliRuntimeProviderIds: vi.fn(() => ["claude-cli"]),
      resolveCliRuntimeModelBackendBinding: vi.fn((params: ResolveBindingParams) =>
        params.provider === claudeBinding.provider && params.runtime === claudeBinding.runtime
          ? claudeBinding
          : actual.resolveCliRuntimeModelBackendBinding(params),
      ),
      isCliRuntimeModelBackendForProvider: vi.fn((params: ProviderCheckParams) =>
        params.provider === claudeBinding.provider && params.runtime === claudeBinding.runtime
          ? true
          : actual.isCliRuntimeModelBackendForProvider(params),
      ),
    };
  });

  vi.doMock("../workspace-run.js", () => ({
    resolveRunWorkspaceDir: vi.fn((params: { workspaceDir: string }) => ({
      workspaceDir: params.workspaceDir,
      usedFallback: false,
      fallbackReason: undefined,
      agentId: "main",
    })),
    redactRunIdentifier: vi.fn((value?: string) => value ?? ""),
  }));

  vi.doMock("../embedded-agent-helpers.js", () => ({
    formatBillingErrorMessage: mockedFormatBillingErrorMessage,
    classifyFailoverReason: mockedClassifyFailoverReason,
    extractObservedOverflowTokenCount: mockedExtractObservedOverflowTokenCount,
    formatAssistantErrorText: mockedFormatAssistantErrorText,
    isAuthAssistantError: mockedIsAuthAssistantError,
    isBillingAssistantError: mockedIsBillingAssistantError,
    isCompactionFailureError: mockedIsCompactionFailureError,
    isLikelyContextOverflowError: mockedIsLikelyContextOverflowError,
    isFailoverAssistantError: mockedIsFailoverAssistantError,
    isFailoverErrorMessage: mockedIsFailoverErrorMessage,
    parseImageSizeError: mockedParseImageSizeError,
    parseImageDimensionError: mockedParseImageDimensionError,
    isRateLimitAssistantError: mockedIsRateLimitAssistantError,
    isTimeoutErrorMessage: mockedIsTimeoutErrorMessage,
    pickFallbackThinkingLevel: mockedPickFallbackThinkingLevel,
    sanitizeUserFacingText: vi.fn((text: unknown) => (typeof text === "string" ? text : "")),
  }));

  vi.doMock("./run/attempt.js", () => ({
    runEmbeddedAttempt: mockedRunEmbeddedAttempt,
  }));

  vi.doMock("./tool-result-truncation.js", () => ({
    resolveLiveToolResultMaxChars: mockedResolveLiveToolResultMaxChars,
    sessionLikelyHasOversizedToolResults: mockedSessionLikelyHasOversizedToolResults,
    truncateOversizedToolResultsInSession: mockedTruncateOversizedToolResultsInSession,
  }));

  vi.doMock("./context-engine-maintenance.js", () => ({
    runContextEngineMaintenance: mockedRunContextEngineMaintenance,
  }));

  vi.doMock("./model.js", () => ({
    resolveModelAsync: mockedResolveModelAsync,
  }));

  vi.doMock("../model-auth.js", () => ({
    applyAuthHeaderOverride: vi.fn((model: unknown) => model),
    applyLocalNoAuthHeaderOverride: vi.fn((model: unknown) => model),
    ensureAuthProfileStore: mockedEnsureAuthProfileStore,
    ensureAuthProfileStoreWithoutExternalProfiles:
      mockedEnsureAuthProfileStoreWithoutExternalProfiles,
    getApiKeyForModel: mockedGetApiKeyForModel,
    resolveAuthProfileOrder: mockedResolveAuthProfileOrder,
    shouldPreferExplicitConfigApiKeyAuth: mockedShouldPreferExplicitConfigApiKeyAuth,
  }));

  vi.doMock("../models-config.js", () => ({
    ensureOpenClawModelsJson: vi.fn(async () => {}),
  }));

  vi.doMock("../context-window-guard.js", () => ({
    CONTEXT_WINDOW_HARD_MIN_TOKENS: 1000,
    CONTEXT_WINDOW_WARN_BELOW_TOKENS: 5000,
    evaluateContextWindowGuard: mockedEvaluateContextWindowGuard,
    formatContextWindowBlockMessage: mockedFormatContextWindowBlockMessage,
    formatContextWindowWarningMessage: mockedFormatContextWindowWarningMessage,
    resolveContextWindowInfo: mockedResolveContextWindowInfo,
  }));

  vi.doMock("../../process/command-queue.js", () => ({
    enqueueCommandInLane: vi.fn((_lane: string, task: () => unknown) => task()),
    clearCommandLane: vi.fn(() => 0),
  }));

  vi.doMock("../../utils/message-channel.js", () => ({
    isMarkdownCapableMessageChannel: vi.fn(() => true),
  }));

  vi.doMock("../defaults.js", () => ({
    DEFAULT_CONTEXT_TOKENS: 200000,
    DEFAULT_MODEL: "test-model",
    DEFAULT_PROVIDER: "anthropic",
  }));

  vi.doMock("../failover-error.js", () => ({
    FailoverError: MockedFailoverError,
    coerceToFailoverError: mockedCoerceToFailoverError,
    describeFailoverError: mockedDescribeFailoverError,
    resolveFailoverStatus: mockedResolveFailoverStatus,
  }));

  vi.doMock("./lanes.js", () => ({
    resolveSessionLane: vi.fn(() => "session-lane"),
    resolveEmbeddedSessionLane: vi.fn(() => "session-lane"),
    resolveGlobalLane: vi.fn(() => "global-lane"),
  }));

  vi.doMock("./logger.js", () => ({
    log: mockedLog,
  }));

  vi.doMock("./run/payloads.js", () => ({
    buildEmbeddedRunPayloads: mockedBuildEmbeddedRunPayloads,
  }));

  vi.doMock("./compaction-hooks.js", () => ({
    runPostCompactionSideEffects: mockedRunPostCompactionSideEffects,
  }));

  vi.doMock("./utils.js", () => ({
    describeUnknownError: vi.fn((err: unknown) => {
      if (err instanceof Error) {
        return err.message;
      }
      return String(err);
    }),
  }));

  const { runEmbeddedAgent } = await import("./run.js");
  return { runEmbeddedAgent };
}
