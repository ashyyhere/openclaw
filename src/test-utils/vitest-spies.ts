// Vitest spy helpers that restore platform/process mocks reliably.
import { vi } from "vitest";

/** Minimal mock handle that can be restored after a scoped test callback. */
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

/** Runs an async callback and restores mocks in reverse order afterwards. */
export function withRestoredMocks<T>(
  mocks: readonly RestorableMock[],
  run: () => Promise<T>,
): Promise<T>;
/** Runs a sync callback and restores mocks in reverse order afterwards. */
export function withRestoredMocks<T>(mocks: readonly RestorableMock[], run: () => T): T;
/** Shared implementation for sync and async mock restoration scopes. */
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

/** Mocks process.platform through a getter spy. */
export function mockProcessPlatform(platform: NodeJS.Platform): RestorableMock {
  return vi.spyOn(process, "platform", "get").mockReturnValue(platform);
}

/** Runs an async callback with process.platform mocked. */
export function withMockedPlatform<T>(platform: NodeJS.Platform, run: () => Promise<T>): Promise<T>;
/** Runs a sync callback with process.platform mocked. */
export function withMockedPlatform<T>(platform: NodeJS.Platform, run: () => T): T;
/** Shared implementation for scoped process.platform mocks. */
export function withMockedPlatform<T>(
  platform: NodeJS.Platform,
  run: () => T | Promise<T>,
): T | Promise<T> {
  return withRestoredMocks([mockProcessPlatform(platform)], run);
}

/** Runs an async callback with process.platform mocked as win32. */
export function withMockedWindowsPlatform<T>(run: () => Promise<T>): Promise<T>;
/** Runs a sync callback with process.platform mocked as win32. */
export function withMockedWindowsPlatform<T>(run: () => T): T;
/** Shared implementation for scoped win32 platform mocks. */
export function withMockedWindowsPlatform<T>(run: () => T | Promise<T>): T | Promise<T> {
  return withMockedPlatform("win32", run);
}
