// QA Lab mock OpenAI provider entry registers the local Responses-compatible server.
import { createMockQaProviderDefinition } from "../shared/mock-provider-definition.js";

/** Provider definition for the QA mock OpenAI mode. */
export const mockOpenAiProviderDefinition = createMockQaProviderDefinition({
  mode: "mock-openai",
  commandName: "mock-openai",
  commandDescription: "Run the local mock OpenAI Responses API server for QA",
  serverLabel: "QA mock OpenAI",
  mockAuthProviders: ["openai", "anthropic"],
});
