// Shared core Vitest config runs shared source tests outside the faster unit shard list.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";
import { getUnitFastTestFiles } from "./vitest.unit-fast-paths.mjs";

/** Creates the shared core Vitest project config. */
export function createSharedCoreVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/shared/**/*.test.ts"], {
    dir: "src",
    env,
    exclude: getUnitFastTestFiles(),
    includeOpenClawRuntimeSetup: false,
    name: "shared-core",
    passWithNoTests: true,
  });
}

/** Default shared core Vitest project config. */
export default createSharedCoreVitestConfig();
