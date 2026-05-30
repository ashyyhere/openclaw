// Process Vitest config runs process tests after runtime-independent setup.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the process Vitest project config. */
export function createProcessVitestConfig(env?: Record<string, string | undefined>) {
  const config = createScopedVitestConfig(["src/process/**/*.test.ts"], {
    dir: "src",
    env,
    includeOpenClawRuntimeSetup: false,
    name: "process",
    passWithNoTests: true,
  });
  return {
    ...config,
    test: {
      ...config.test,
      sequence: {
        ...config.test?.sequence,
        groupOrder: 2,
      },
    },
  };
}

/** Default process Vitest project config. */
export default createProcessVitestConfig();
