// media-understanding runner test mocks helpers and runtime behavior.
import { vi } from "vitest";

/** Reused helper for create Available Model Auth Mock Module behavior in src/media-understanding. */
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

/** Reused helper for create Empty Capability Provider Mock Module behavior in src/media-understanding. */
export function createEmptyCapabilityProviderMockModule() {
  return {
    resolvePluginCapabilityProviders: () => [],
  };
}
