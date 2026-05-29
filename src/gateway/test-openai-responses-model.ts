// gateway test openai responses model helpers and runtime behavior.
const MOCK_OPENAI_RESPONSES_PROVIDER_ID = "mock-openai";

function buildOpenAiResponsesTestModel(id = "gpt-5.4") {
  return {
    id,
    name: id,
    api: "openai-responses",
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128_000,
    maxTokens: 4096,
  } as const;
}

function buildOpenAiResponsesProviderConfig(baseUrl: string, modelId = "gpt-5.4") {
  return {
    baseUrl,
    apiKey: "test",
    api: "openai-responses",
    models: [buildOpenAiResponsesTestModel(modelId)],
  } as const;
}

/** Reused helper for build Mock Open Ai Responses Provider behavior in src/gateway. */
export function buildMockOpenAiResponsesProvider(baseUrl: string, modelId = "gpt-5.4") {
  return {
    providerId: MOCK_OPENAI_RESPONSES_PROVIDER_ID,
    modelId,
    modelRef: `${MOCK_OPENAI_RESPONSES_PROVIDER_ID}/${modelId}`,
    config: buildOpenAiResponsesProviderConfig(baseUrl, modelId),
  } as const;
}
