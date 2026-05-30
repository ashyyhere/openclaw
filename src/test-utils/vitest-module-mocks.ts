// Vitest module mock helper for preserving actual exports with targeted overrides.
/** Merge a real module object with async or sync mock overrides. */
export async function mergeMockedModule<TModule extends object>(
  actual: TModule,
  buildOverrides: (actual: TModule) => Partial<TModule> | Promise<Partial<TModule>>,
) {
  return {
    ...actual,
    ...(await buildOverrides(actual)),
  };
}
