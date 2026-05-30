// Vitest project config for tooling tests that must run with isolated workers.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the isolated tooling Vitest project config. */
export function createToolingIsolatedVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["test/scripts/openclaw-e2e-instance.test.ts"], {
    env,
    isolate: true,
    name: "tooling-isolated",
    passWithNoTests: true,
    useNonIsolatedRunner: false,
  });
}

/** Default isolated tooling Vitest project configuration. */
export default createToolingIsolatedVitestConfig();
