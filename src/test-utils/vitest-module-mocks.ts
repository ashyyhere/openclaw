// test-utils vitest module mocks helpers and runtime behavior.
/** Reused helper for merge Mocked Module behavior in src/test-utils. */
export async function mergeMockedModule<TModule extends object>(
  actual: TModule,
  buildOverrides: (actual: TModule) => Partial<TModule> | Promise<Partial<TModule>>,
) {
  return {
    ...actual,
    ...(await buildOverrides(actual)),
  };
}
