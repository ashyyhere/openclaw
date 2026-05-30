// Test helpers for Google provider message conversion and stream lifecycle tests.
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

/** Assert that a test value is a plain object record. */
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

/** Return the first converted Google tool declaration parameter schema. */
export const getFirstToolParameters = (converted: ConvertedTools): Record<string, unknown> => {
  const functionDeclaration = asRecord(converted?.[0]?.functionDeclarations?.[0]);
  return asRecord(functionDeclaration.parametersJsonSchema ?? functionDeclaration.parameters);
};

/** Build a minimal Google Generative AI model fixture. */
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

/** Build a minimal Gemini CLI model fixture. */
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

/** Build a Google Generative AI assistant message fixture. */
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

/** Build a Gemini CLI assistant message fixture. */
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

/** Assert converted Google content roles in order. */
export function expectConvertedRoles(contents: Array<{ role?: string }>, expectedRoles: string[]) {
  expect(contents).toHaveLength(expectedRoles.length);
  for (const [index, role] of expectedRoles.entries()) {
    expect(contents[index]?.role).toBe(role);
  }
}
