/** Shared expectations for model forward-compat tests. */
import { expect } from "vitest";

/** Reused helper for build Forward Compat Template behavior in src/agents/embedded-agent-runner. */
export function buildForwardCompatTemplate(params: {
  id: string;
  name: string;
  provider: string;
  api: "anthropic-messages" | "google-gemini-cli" | "openai-completions" | "openai-responses";
  baseUrl: string;
  reasoning?: boolean;
  input?: readonly ["text"] | readonly ["text", "image"];
  cost?: { input: number; output: number; cacheRead: number; cacheWrite: number };
  contextWindow?: number;
  maxTokens?: number;
}) {
  return {
    id: params.id,
    name: params.name,
    provider: params.provider,
    api: params.api,
    baseUrl: params.baseUrl,
    reasoning: params.reasoning ?? true,
    input: params.input ?? (["text", "image"] as const),
    cost: params.cost ?? { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
    contextWindow: params.contextWindow ?? 200000,
    maxTokens: params.maxTokens ?? 64000,
  };
}

/** Reused helper for expect Resolved Forward Compat Fallback Result behavior in src/agents/embedded-agent-runner. */
export function expectResolvedForwardCompatFallbackResult(params: {
  result: {
    error?: string;
    model?: unknown;
  };
  expectedModel: Record<string, unknown>;
}) {
  expect(params.result.error).toBeUndefined();
  expectModelFields(params.result.model, params.expectedModel);
}

/** Reused helper for expect Resolved Forward Compat Fallback With Registry Result behavior in src/agents/embedded-agent-runner. */
export function expectResolvedForwardCompatFallbackWithRegistryResult(params: {
  result: unknown;
  expectedModel: Record<string, unknown>;
}) {
  expectModelFields(params.result, params.expectedModel);
}

function expectModelFields(actual: unknown, expected: Record<string, unknown>) {
  const actualModel = actual as Record<string, unknown> | undefined;
  expect(actualModel).toBeDefined();
  for (const [key, value] of Object.entries(expected)) {
    expect(actualModel?.[key]).toEqual(value);
  }
}

/** Reused helper for expect Unknown Model Error Result behavior in src/agents/embedded-agent-runner. */
export function expectUnknownModelErrorResult(
  result: {
    error?: string;
    model?: unknown;
  },
  provider: string,
  id: string,
) {
  expect(result.model).toBeUndefined();
  expect(result.error).toBe(`Unknown model: ${provider}/${id}`);
}
