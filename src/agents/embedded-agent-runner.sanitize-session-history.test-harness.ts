/** Shared harness for embedded-agent session-history sanitization tests. */
import { expect, vi } from "vitest";
import type { AgentMessage } from "./runtime/index.js";
import type { SessionManager } from "./sessions/index.js";
import type { TranscriptPolicy } from "./transcript-policy.js";

type SessionEntry = { type: string; customType: string; data: unknown };
/** Signature under test for replay-history sanitization. */
export type SanitizeSessionHistoryFn = (params: {
  messages: AgentMessage[];
  modelApi: string;
  provider: string;
  allowedToolNames?: Iterable<string>;
  sessionManager: SessionManager;
  sessionId: string;
  modelId?: string;
  policy?: TranscriptPolicy;
  preserveLatestAssistantThinking?: boolean;
}) => Promise<AgentMessage[]>;
type SanitizeSessionHistoryMockedHelpers = typeof import("./embedded-agent-helpers.js");
/** Loaded sanitization module plus the helper mocks tests assert against. */
export type SanitizeSessionHistoryHarness = {
  sanitizeSessionHistory: SanitizeSessionHistoryFn;
  mockedHelpers: SanitizeSessionHistoryMockedHelpers;
};
/** Stable session id shared by sanitization harness calls. */
export const TEST_SESSION_ID = "test-session";

/** Builds a transcript model-snapshot entry for replay history tests. */
export function makeModelSnapshotEntry(data: {
  timestamp?: number;
  provider: string;
  modelApi: string;
  modelId: string;
}): SessionEntry {
  return {
    type: "custom",
    customType: "model-snapshot",
    data: {
      timestamp: data.timestamp ?? Date.now(),
      provider: data.provider,
      modelApi: data.modelApi,
      modelId: data.modelId,
    },
  };
}

/** Creates a session manager mock backed by a mutable entry array. */
export function makeInMemorySessionManager(entries: SessionEntry[]): SessionManager {
  return {
    getEntries: vi.fn(() => entries),
    appendCustomEntry: vi.fn((customType: string, data: unknown) => {
      entries.push({ type: "custom", customType, data });
    }),
  } as unknown as SessionManager;
}

/** Creates an empty session manager mock for tests that only need calls. */
export function makeMockSessionManager(): SessionManager {
  return {
    getEntries: vi.fn().mockReturnValue([]),
    appendCustomEntry: vi.fn(),
  } as unknown as SessionManager;
}

/** Returns a minimal user-message history for sanitizer tests. */
export function makeSimpleUserMessages(): AgentMessage[] {
  const messages = [{ role: "user", content: "hello" }];
  return messages as unknown as AgentMessage[];
}

/** Creates the embedded-agent helper module mock used by sanitizer tests. */
export async function createSanitizeSessionHistoryHelpersMock(extra: Record<string, unknown> = {}) {
  return {
    ...(await vi.importActual("./embedded-agent-helpers.js")),
    sanitizeSessionMessagesImages: vi.fn(async (msgs) => msgs),
    ...extra,
  };
}

/** Creates a provider runtime mock with sanitizer plugin hooks disabled. */
export async function createSanitizeSessionHistoryProviderRuntimeMock(
  extra: Record<string, unknown> = {},
) {
  const actual = await vi.importActual<typeof import("../plugins/provider-runtime.js")>(
    "../plugins/provider-runtime.js",
  );
  return {
    ...actual,
    resolveProviderRuntimePlugin: vi.fn(() => undefined),
    sanitizeProviderReplayHistoryWithPlugin: vi.fn(() => undefined),
    validateProviderReplayTurnsWithPlugin: vi.fn(() => undefined),
    ...extra,
  };
}

/** Creates a provider hook runtime mock with cache-reset test hooks exposed. */
export async function createSanitizeSessionHistoryProviderHookRuntimeMock(
  extra: Record<string, unknown> = {},
) {
  const clearProviderRuntimePluginCacheForTest = vi.fn();
  const actual = await vi.importActual<typeof import("../plugins/provider-hook-runtime.js")>(
    "../plugins/provider-hook-runtime.js",
  );
  return {
    ...actual,
    clearProviderRuntimePluginCacheForTest,
    resolveProviderRuntimePlugin: vi.fn(() => undefined),
    resolveProviderHookPlugin: vi.fn(() => undefined),
    resolveProviderPluginsForHooks: vi.fn(() => []),
    prepareProviderExtraParams: vi.fn(() => undefined),
    wrapProviderStreamFn: vi.fn(() => undefined),
    testing: { clearProviderRuntimePluginCacheForTest },
    ...extra,
  };
}

/** Reloads replay-history with fresh Vitest module and helper mocks. */
export async function loadSanitizeSessionHistoryWithCleanMocks(): Promise<SanitizeSessionHistoryHarness> {
  vi.resetModules();
  vi.resetAllMocks();
  const mockedHelpers = await import("./embedded-agent-helpers.js");
  vi.mocked(mockedHelpers.sanitizeSessionMessagesImages).mockImplementation(async (msgs) => msgs);
  const mod = await import("./embedded-agent-runner/replay-history.js");
  return {
    sanitizeSessionHistory: mod.sanitizeSessionHistory,
    mockedHelpers,
  };
}

/** Builds assistant reasoning messages with object or JSON thinking signatures. */
export function makeReasoningAssistantMessages(opts?: {
  thinkingSignature?: "object" | "json";
  includeText?: boolean;
}): AgentMessage[] {
  const thinkingSignature: unknown =
    opts?.thinkingSignature === "json"
      ? JSON.stringify({ id: "rs_test", type: "reasoning" })
      : { id: "rs_test", type: "reasoning" };
  const content: Array<Record<string, unknown>> = [
    {
      type: "thinking",
      thinking: "reasoning",
      thinkingSignature,
    },
  ];
  if (opts?.includeText) {
    content.push({ type: "text", text: "answer" });
  }

  // Intentional: we want to build message payloads that can carry non-string
  // signatures, but core typing currently expects a string.
  const messages = [
    {
      role: "assistant",
      content,
    },
  ];

  return messages as unknown as AgentMessage[];
}

/** Runs the sanitizer with OpenAI Responses metadata defaults. */
export async function sanitizeWithOpenAIResponses(params: {
  sanitizeSessionHistory: SanitizeSessionHistoryFn;
  messages: AgentMessage[];
  sessionManager: SessionManager;
  modelId?: string;
}) {
  return await params.sanitizeSessionHistory({
    messages: params.messages,
    modelApi: "openai-responses",
    provider: "openai",
    sessionManager: params.sessionManager,
    modelId: params.modelId,
    sessionId: TEST_SESSION_ID,
  });
}

/** Asserts OpenAI Responses sanitization used strict image-only replay mode. */
export function expectOpenAIResponsesStrictSanitizeCall(
  sanitizeSessionMessagesImagesMock: unknown,
  messages: AgentMessage[],
) {
  const mock = sanitizeSessionMessagesImagesMock as {
    mock?: { calls: Array<[AgentMessage[], string, Record<string, unknown>]> };
  };
  const call = mock.mock?.calls[0];
  expect(call?.[0]).toBe(messages);
  expect(call?.[1]).toBe("session:history");
  expect(call?.[2]?.sanitizeMode).toBe("images-only");
  expect(call?.[2]?.sanitizeToolCallIds).toBe(false);
  expect(call?.[2]?.toolCallIdMode).toBe("strict");
}

function makeSnapshotChangedOpenAIReasoningScenario() {
  const sessionEntries = [
    makeModelSnapshotEntry({
      provider: "anthropic",
      modelApi: "anthropic-messages",
      modelId: "claude-3-7",
    }),
  ];
  return {
    sessionManager: makeInMemorySessionManager(sessionEntries),
    messages: makeReasoningAssistantMessages({ thinkingSignature: "object", includeText: true }),
    modelId: "gpt-5.4",
  };
}

/** Sanitizes the model-snapshot-change scenario for OpenAI reasoning replay. */
export async function sanitizeSnapshotChangedOpenAIReasoning(params: {
  sanitizeSessionHistory: SanitizeSessionHistoryFn;
}) {
  const { sessionManager, messages, modelId } = makeSnapshotChangedOpenAIReasoningScenario();
  return await sanitizeWithOpenAIResponses({
    sanitizeSessionHistory: params.sanitizeSessionHistory,
    messages,
    modelId,
    sessionManager,
  });
}
