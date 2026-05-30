/** Shared harness helpers for embedded-agent model resolution tests. */
import { vi } from "vitest";
import type { ModelDefinitionConfig } from "../../config/types.js";

type DiscoverModelsMock = typeof import("../agent-model-discovery.js").discoverModels;

/** Build the smallest model definition needed for resolution tests. */
export const makeModel = (id: string): ModelDefinitionConfig => ({
  id,
  name: id,
  reasoning: false,
  input: ["text"],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 1,
  maxTokens: 1,
});

/** Template model used when tests need OpenAI Codex catalog defaults. */
export const OPENAI_CODEX_TEMPLATE_MODEL = {
  id: "gpt-5.3-codex",
  name: "GPT-5.3 Codex",
  provider: "openai-codex",
  api: "openai-codex-responses",
  baseUrl: "https://chatgpt.com/backend-api",
  reasoning: true,
  input: ["text", "image"] as const,
  cost: { input: 2.5, output: 15, cacheRead: 0.25, cacheWrite: 0 },
  contextWindow: 1_050_000,
  contextTokens: 272_000,
  maxTokens: 128000,
};

function mockTemplateModel(
  discoverModelsMock: DiscoverModelsMock,
  provider: string,
  modelId: string,
  templateModel: unknown,
): void {
  mockDiscoveredModel(discoverModelsMock, {
    provider,
    modelId,
    templateModel,
  });
}

/** Mock discovery so OpenAI Codex lookups return the shared template model. */
export function mockOpenAICodexTemplateModel(discoverModelsMock: DiscoverModelsMock): void {
  mockTemplateModel(
    discoverModelsMock,
    "openai-codex",
    OPENAI_CODEX_TEMPLATE_MODEL.id,
    OPENAI_CODEX_TEMPLATE_MODEL,
  );
}

/** Build expected forward-compat fields for OpenAI Codex fallback model ids. */
export function buildOpenAICodexForwardCompatExpectation(
  id: string = "gpt-5.3-codex",
): Partial<ModelDefinitionConfig> & {
  provider: string;
  id: string;
  api: string;
  baseUrl: string;
} {
  const isGpt54 = id === "gpt-5.4";
  const isGpt55 = id === "gpt-5.5";
  const isGpt54Mini = id === "gpt-5.4-mini";
  const isSpark = id === "gpt-5.3-codex-spark";
  return {
    provider: "openai-codex",
    id,
    api: "openai-codex-responses",
    baseUrl: "https://chatgpt.com/backend-api",
    reasoning: true,
    input: isSpark ? ["text"] : ["text", "image"],
    cost: isSpark
      ? { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
      : isGpt54
        ? { input: 2.5, output: 15, cacheRead: 0.25, cacheWrite: 0 }
        : isGpt54Mini
          ? { input: 0.75, output: 4.5, cacheRead: 0.075, cacheWrite: 0 }
          : OPENAI_CODEX_TEMPLATE_MODEL.cost,
    contextWindow: isGpt54
      ? 1_050_000
      : isGpt55 || isGpt54Mini
        ? 400_000
        : isSpark
          ? 128_000
          : 272000,
    ...(isGpt54 || isGpt55 || isGpt54Mini ? { contextTokens: 272_000 } : {}),
    maxTokens: 128000,
  };
}

/** Reset discovery mocks to the no-model-found baseline. */
export function resetMockDiscoverModels(discoverModelsMock: DiscoverModelsMock): void {
  vi.mocked(discoverModelsMock).mockReturnValue({
    find: vi.fn(() => null),
  } as unknown as ReturnType<DiscoverModelsMock>);
}

/** Mock discovery for one provider/model id pair and leave all other ids missing. */
export function mockDiscoveredModel(
  discoverModelsMock: DiscoverModelsMock,
  params: {
    provider: string;
    modelId: string;
    templateModel: unknown;
  },
): void {
  vi.mocked(discoverModelsMock).mockReturnValue({
    find: vi.fn((provider: string, modelId: string) => {
      if (provider === params.provider && modelId === params.modelId) {
        return params.templateModel;
      }
      return null;
    }),
  } as unknown as ReturnType<DiscoverModelsMock>);
}
