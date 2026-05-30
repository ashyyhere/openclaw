// Vitest project config for source utility tests outside the unit-fast lane.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";
import { getUnitFastTestFiles } from "./vitest.unit-fast-paths.mjs";

/** Create the scoped Vitest config for utility tests. */
export function createUtilsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/utils/**/*.test.ts"], {
    dir: "src",
    env,
    exclude: getUnitFastTestFiles(),
    includeOpenClawRuntimeSetup: false,
    name: "utils",
    passWithNoTests: true,
  });
}

/** Default utilities Vitest project configuration. */
export default createUtilsVitestConfig();
