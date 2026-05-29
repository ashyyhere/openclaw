// llm/providers google shared test helpers helpers and runtime behavior.
import { expect } from "vitest";
import type { Model } from "../types.js";

function makeZeroUsageSnapshot() {
  return {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadInputTokens: 0,
    cacheCreationInputTokens: 0,
    reasoningTokens: 0,
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      total: 0,
    },
  };
}

/** Reused constant for as Record behavior in src/llm/providers. */
export const asRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("expected record");
  }
  return value as Record<string, unknown>;
};

type ConvertedTools = ReadonlyArray<{
  functionDeclarations?: ReadonlyArray<{
    parametersJsonSchema?: unknown;
    parameters?: unknown;
  }>;
}>;

/** Reused constant for get First Tool Parameters behavior in src/llm/providers. */
export const getFirstToolParameters = (converted: ConvertedTools): Record<string, unknown> => {
  const functionDeclaration = asRecord(converted?.[0]?.functionDeclarations?.[0]);
  return asRecord(functionDeclaration.parametersJsonSchema ?? functionDeclaration.parameters);
};

/** Reused constant for make Model behavior in src/llm/providers. */
export const makeModel = (id: string): Model<"google-generative-ai"> =>
  ({
    id,
    name: id,
    api: "google-generative-ai",
    provider: "google",
    baseUrl: "https://example.invalid",
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 1,
    maxTokens: 1,
  }) as Model<"google-generative-ai">;

/** Reused constant for make Gemini Cli Model behavior in src/llm/providers. */
export const makeGeminiCliModel = (id: string): Model<"google-gemini-cli"> =>
  ({
    id,
    name: id,
    api: "google-gemini-cli",
    provider: "google-gemini-cli",
    baseUrl: "https://example.invalid",
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 1,
    maxTokens: 1,
  }) as Model<"google-gemini-cli">;

/** Reused helper for make Google Assistant Message behavior in src/llm/providers. */
export function makeGoogleAssistantMessage(model: string, content: unknown) {
  return {
    role: "assistant",
    content,
    api: "google-generative-ai",
    provider: "google",
    model,
    usage: makeZeroUsageSnapshot(),
    stopReason: "stop",
    timestamp: 0,
  };
}

/** Reused helper for make Gemini Cli Assistant Message behavior in src/llm/providers. */
export function makeGeminiCliAssistantMessage(model: string, content: unknown) {
  return {
    role: "assistant",
    content,
    api: "google-gemini-cli",
    provider: "google-gemini-cli",
    model,
    usage: makeZeroUsageSnapshot(),
    stopReason: "stop",
    timestamp: 0,
  };
}

/** Reused helper for expect Converted Roles behavior in src/llm/providers. */
export function expectConvertedRoles(contents: Array<{ role?: string }>, expectedRoles: string[]) {
  expect(contents).toHaveLength(expectedRoles.length);
  for (const [index, role] of expectedRoles.entries()) {
    expect(contents[index]?.role).toBe(role);
  }
}
