// Small Vitest module factories shared by media-understanding runner tests.
import { vi } from "vitest";

/** Creates auth mocks that make every provider appear configured for tests. */
export function createAvailableModelAuthMockModule() {
  return {
    hasAvailableAuthForProvider: vi.fn(() => true),
    resolveApiKeyForProvider: vi.fn(async () => ({
      apiKey: "test-key",
      source: "test",
      mode: "api-key",
    })),
    requireApiKey: vi.fn((auth: { apiKey?: string }) => auth.apiKey ?? "test-key"),
  };
}

/** Creates plugin capability-provider mocks with no discovered providers. */
export function createEmptyCapabilityProviderMockModule() {
  return {
    resolvePluginCapabilityProviders: () => [],
  };
}
