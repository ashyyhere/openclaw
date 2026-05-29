// test-utils vitest spies helpers and runtime behavior.
import { vi } from "vitest";

/** Shared type for Restorable Mock in src/test-utils. */
export type RestorableMock = {
  mockRestore(): void;
};

function restoreMocks(mocks: readonly RestorableMock[]): void {
  for (const mock of mocks.toReversed()) {
    mock.mockRestore();
  }
}

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Promise<T>).finally === "function"
  );
}

/** Reused helper for with Restored Mocks behavior in src/test-utils. */
export function withRestoredMocks<T>(
  mocks: readonly RestorableMock[],
  run: () => Promise<T>,
): Promise<T>;
/** Reused helper for with Restored Mocks behavior in src/test-utils. */
export function withRestoredMocks<T>(mocks: readonly RestorableMock[], run: () => T): T;
/** Reused helper for with Restored Mocks behavior in src/test-utils. */
export function withRestoredMocks<T>(
  mocks: readonly RestorableMock[],
  run: () => T | Promise<T>,
): T | Promise<T> {
  try {
    const result = run();
    if (isPromiseLike(result)) {
      return result.finally(() => restoreMocks(mocks));
    }
    restoreMocks(mocks);
    return result;
  } catch (error) {
    restoreMocks(mocks);
    throw error;
  }
}

/** Reused helper for mock Process Platform behavior in src/test-utils. */
export function mockProcessPlatform(platform: NodeJS.Platform): RestorableMock {
  return vi.spyOn(process, "platform", "get").mockReturnValue(platform);
}

/** Reused helper for with Mocked Platform behavior in src/test-utils. */
export function withMockedPlatform<T>(platform: NodeJS.Platform, run: () => Promise<T>): Promise<T>;
/** Reused helper for with Mocked Platform behavior in src/test-utils. */
export function withMockedPlatform<T>(platform: NodeJS.Platform, run: () => T): T;
/** Reused helper for with Mocked Platform behavior in src/test-utils. */
export function withMockedPlatform<T>(
  platform: NodeJS.Platform,
  run: () => T | Promise<T>,
): T | Promise<T> {
  return withRestoredMocks([mockProcessPlatform(platform)], run);
}

/** Reused helper for with Mocked Windows Platform behavior in src/test-utils. */
export function withMockedWindowsPlatform<T>(run: () => Promise<T>): Promise<T>;
/** Reused helper for with Mocked Windows Platform behavior in src/test-utils. */
export function withMockedWindowsPlatform<T>(run: () => T): T;
/** Reused helper for with Mocked Windows Platform behavior in src/test-utils. */
export function withMockedWindowsPlatform<T>(run: () => T | Promise<T>): T | Promise<T> {
  return withMockedPlatform("win32", run);
}
