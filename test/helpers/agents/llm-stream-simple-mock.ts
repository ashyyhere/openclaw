// LLM stream mock helper provides a minimal async stream shape for agent tests.
import { vi } from "vitest";

type LlmMockModule = Record<string, unknown>;

/** Create a mock LLM module with a streamSimple function and async-iterable result. */
export function createLlmStreamSimpleMock(): LlmMockModule {
  return {
    streamSimple: vi.fn(() => ({
      push: vi.fn(),
      result: vi.fn(async () => undefined),
      [Symbol.asyncIterator]: vi.fn(async function* () {
        // Minimal async stream shape for wrappers that patch iteration/result.
      }),
    })),
  };
}
