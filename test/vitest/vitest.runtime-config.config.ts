// Vitest project config for runtime config tests with early sequencing.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for runtime config tests. */
export function createRuntimeConfigVitestConfig(env?: Record<string, string | undefined>) {
  const config = createScopedVitestConfig(["src/config/**/*.test.ts"], {
    dir: "src",
    env,
    includeOpenClawRuntimeSetup: false,
    name: "runtime-config",
    passWithNoTests: true,
  });
  return {
    ...config,
    test: {
      ...config.test,
      sequence: {
        ...config.test?.sequence,
        groupOrder: 3,
      },
    },
  };
}

/** Default runtime-config Vitest project configuration. */
export default createRuntimeConfigVitestConfig();
