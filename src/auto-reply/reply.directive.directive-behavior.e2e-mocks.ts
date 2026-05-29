// Shared mocks for directive behavior E2E-style tests.
import { vi, type Mock } from "vitest";

/** Reused constant for run Embedded Agent Mock behavior in src/auto-reply. */
export const runEmbeddedAgentMock: Mock = vi.fn();
/** Reused constant for compact Embedded Agent Session Mock behavior in src/auto-reply. */
export const compactEmbeddedAgentSessionMock: Mock = vi.fn();
/** Reused constant for load Model Catalog Mock behavior in src/auto-reply. */
export const loadModelCatalogMock: Mock = vi.fn();
/** Reused constant for resolve Command Secret Refs Via Gateway Mock behavior in src/auto-reply. */
export const resolveCommandSecretRefsViaGatewayMock: Mock = vi.fn();
/** Reused constant for clear Session Auth Profile Override Mock behavior in src/auto-reply. */
export const clearSessionAuthProfileOverrideMock: Mock = vi.fn();
/** Reused constant for resolve Session Auth Profile Override Mock behavior in src/auto-reply. */
export const resolveSessionAuthProfileOverrideMock: Mock = vi.fn();

function objectRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

function normalizeReplyAgentPayload(payload: Record<string, unknown>, params: unknown) {
  const text = typeof payload.text === "string" ? payload.text : undefined;
  if (!text) {
    return payload;
  }
  const explicitReplyMatch = text.match(/\[\[\s*reply_to\s*:\s*([^\]]+?)\s*\]\]/i);
  const explicitReplyToId = explicitReplyMatch?.[1]?.trim();
  const replyToCurrentPattern = /\[\[\s*reply_to_current\s*\]\]/gi;
  const hasReplyToCurrent = replyToCurrentPattern.test(text);
  const currentMessageId = objectRecord(objectRecord(params)?.sessionCtx)?.MessageSid;
  const cleanedText = text
    .replace(replyToCurrentPattern, "")
    .replace(/\[\[\s*reply_to\s*:\s*([^\]]+?)\s*\]\]/gi, "")
    .trim();

  return {
    ...payload,
    text: cleanedText,
    ...(explicitReplyToId
      ? { replyToId: explicitReplyToId }
      : hasReplyToCurrent && typeof currentMessageId === "string"
        ? { replyToId: currentMessageId, replyToCurrent: true }
        : {}),
  };
}

async function runMockedReplyAgent(runParams: unknown, params: unknown) {
  const result = await runEmbeddedAgentMock(runParams);
  const payloadsRaw = objectRecord(result)?.payloads;
  const payloads = Array.isArray(payloadsRaw)
    ? payloadsRaw.flatMap((payload) => {
        const record = objectRecord(payload);
        return record ? [record] : [];
      })
    : [];
  const normalized = payloads.map((payload) => normalizeReplyAgentPayload(payload, params));
  if (normalized.length === 0) {
    return undefined;
  }
  return normalized.length === 1 ? normalized[0] : normalized;
}

/** Reused helper for run Directive Behavior Reply Agent behavior in src/auto-reply. */
export async function runDirectiveBehaviorReplyAgent(params: unknown) {
  const runParams = objectRecord(objectRecord(params)?.followupRun)?.run ?? {};
  return await runMockedReplyAgent(runParams, params);
}

/** Reused constant for run Reply Agent Mock behavior in src/auto-reply. */
export const runReplyAgentMock: Mock = vi.fn(runDirectiveBehaviorReplyAgent);

/** Reused helper for run Directive Behavior Prepared Reply behavior in src/auto-reply. */
export async function runDirectiveBehaviorPreparedReply(params: unknown) {
  const input = objectRecord(params) ?? {};
  const runParams = {
    provider: input.provider,
    model: input.model,
    thinkLevel: input.resolvedThinkLevel,
    reasoningLevel: input.resolvedReasoningLevel,
    bashElevated: {
      enabled: input.elevatedEnabled === true,
      allowed: input.elevatedAllowed === true,
      defaultLevel:
        typeof input.resolvedElevatedLevel === "string" ? input.resolvedElevatedLevel : "off",
      fullAccessAvailable: true,
    },
  };
  return await runMockedReplyAgent(runParams, params);
}

/** Reused constant for run Prepared Reply Mock behavior in src/auto-reply. */
export const runPreparedReplyMock: Mock = vi.fn(runDirectiveBehaviorPreparedReply);

vi.mock("../agents/embedded-agent.js", () => ({
  abortEmbeddedAgentRun: vi.fn().mockReturnValue(false),
  compactEmbeddedAgentSession: (...args: unknown[]) => compactEmbeddedAgentSessionMock(...args),
  runEmbeddedAgent: (...args: unknown[]) => runEmbeddedAgentMock(...args),
  queueEmbeddedAgentMessage: vi.fn().mockReturnValue(false),
  resolveEmbeddedSessionLane: (key: string) => `session:${key.trim() || "main"}`,
  isEmbeddedAgentRunActive: vi.fn().mockReturnValue(false),
  isEmbeddedAgentRunStreaming: vi.fn().mockReturnValue(false),
}));

vi.mock("../agents/embedded-agent.runtime.js", () => ({
  abortEmbeddedAgentRun: vi.fn().mockReturnValue(false),
  compactEmbeddedAgentSession: (...args: unknown[]) => compactEmbeddedAgentSessionMock(...args),
  runEmbeddedAgent: (...args: unknown[]) => runEmbeddedAgentMock(...args),
  queueEmbeddedAgentMessage: vi.fn().mockReturnValue(false),
  resolveActiveEmbeddedRunSessionId: vi.fn().mockReturnValue(undefined),
  resolveEmbeddedSessionLane: (key: string) => `session:${key.trim() || "main"}`,
  isEmbeddedAgentRunActive: vi.fn().mockReturnValue(false),
  isEmbeddedAgentRunStreaming: vi.fn().mockReturnValue(false),
  waitForEmbeddedAgentRunEnd: vi.fn().mockResolvedValue(true),
}));

vi.mock("../agents/model-catalog.js", () => ({
  loadModelCatalog: loadModelCatalogMock,
}));

vi.mock("../cli/command-secret-gateway.js", () => ({
  resolveCommandSecretRefsViaGateway: (...args: unknown[]) =>
    resolveCommandSecretRefsViaGatewayMock(...args),
}));

vi.mock("../agents/auth-profiles/session-override.js", () => ({
  clearSessionAuthProfileOverride: (...args: unknown[]) =>
    clearSessionAuthProfileOverrideMock(...args),
  resolveSessionAuthProfileOverride: (...args: unknown[]) =>
    resolveSessionAuthProfileOverrideMock(...args),
}));

vi.mock("../plugins/hook-runner-global.js", () => ({
  getGlobalHookRunner: () => undefined,
  initializeGlobalHookRunner: vi.fn(),
  resetGlobalHookRunner: vi.fn(),
}));

vi.mock("./reply/agent-runner.runtime.js", () => ({
  runReplyAgent: (...args: unknown[]) => runReplyAgentMock(...args),
}));

vi.mock("./reply/get-reply-run.js", () => ({
  runPreparedReply: (...args: unknown[]) => runPreparedReplyMock(...args),
}));
