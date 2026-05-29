// extensions/browser/src/test-utils vitest mock fn helpers and runtime behavior.
export type MockFn<T extends (...args: unknown[]) => unknown = (...args: unknown[]) => unknown> =
  import("vitest").Mock<T>;
