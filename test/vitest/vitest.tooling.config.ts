// Vitest project config for repo tooling and script tests.
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";
import { boundaryTestFiles } from "./vitest.unit-paths.mjs";

/** Load tooling test include patterns from the Vitest include-file env var. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Create the scoped Vitest config for tooling and script tests. */
export function createToolingVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ?? ["test/**/*.test.ts", "src/scripts/**/*.test.ts"],
    {
      env,
      exclude: [...boundaryTestFiles, "test/scripts/openclaw-e2e-instance.test.ts"],
      name: "tooling",
      passWithNoTests: true,
    },
  );
}

/** Default tooling Vitest project configuration. */
export default createToolingVitestConfig();
