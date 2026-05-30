/** Shared expectations for model forward-compat tests. */
import { expect } from "vitest";

/** Build a provider catalog template used to verify model forward-compat fallbacks. */
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

/** Assert that a resolver result contains the expected fallback model fields. */
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

/** Assert that a registry-backed resolver returns the expected fallback model fields. */
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

/** Assert that an unresolved provider/model id reports the canonical unknown-model error. */
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
